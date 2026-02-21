import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { v4 as uuidv4 } from 'uuid';
import imageCompression from 'browser-image-compression';
import { supabase } from '../lib/supabase';
import { Loader2, Upload, X } from 'lucide-react';
import SortableImage from './SortableImage';

interface CatImage {
  id: string;
  url: string;
  thumbnail_url: string;
  order: number;
}

const CatGalleryAdmin: React.FC = () => {
  const [images, setImages] = useState<CatImage[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isPageVisible, setIsPageVisible] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInitialState = async () => {
      try {
        // Fetch images
        const { data: imagesData, error: imagesError } = await supabase
          .from('cat_images')
          .select('*')
          .order('order');

        if (imagesError) throw imagesError;
        setImages(imagesData || []);

        // Fetch page visibility setting
        const { data: settingsData, error: settingsError } = await supabase
          .from('site_settings')
          .select('value')
          .eq('key', 'show_cats_page')
          .single();

        if (settingsError && settingsError.code !== 'PGRST116') {
          throw settingsError;
        }

        setIsPageVisible(settingsData?.value ?? true);
      } catch (error) {
        console.error('Error fetching initial state:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialState();
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const onDragEnd = async (event: any) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      setImages((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const newItems = arrayMove(items, oldIndex, newIndex);
        
        // Update order in database
        const updatedImages = newItems.map((image, index) => ({
          ...image,
          order: index,
        }));

        supabase
          .from('cat_images')
          .upsert(
            updatedImages.map(img => ({
              id: img.id,
              url: img.url,
              thumbnail_url: img.thumbnail_url,
              order: img.order
            }))
          )
          .then(({ error }) => {
            if (error) {
              console.error('Error updating image order:', error);
            }
          });

        return newItems;
      });
    }
  };

  const validateAndProcessImage = async (file: File): Promise<File> => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new Error('גודל הקובץ גדול מדי. הגודל המקסימלי הוא 10MB.');
    }

    // Validate file format
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type.toLowerCase())) {
      throw new Error('סוג קובץ לא נתמך. אנא השתמש בתמונות מסוג JPEG, PNG, או WebP.');
    }

    return file;
  };

  const compressImage = async (file: File) => {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      fileType: 'image/jpeg' as const,
    };

    try {
      const compressedFile = await imageCompression(file, options);
      return compressedFile;
    } catch (error) {
      console.error('Error compressing image:', error);
      throw error;
    }
  };

  const createThumbnail = async (file: File) => {
    const options = {
      maxSizeMB: 0.1,
      maxWidthOrHeight: 300,
      useWebWorker: true,
      fileType: 'image/jpeg' as const,
    };

    try {
      const thumbnail = await imageCompression(file, options);
      return thumbnail;
    } catch (error) {
      console.error('Error creating thumbnail:', error);
      throw error;
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setIsUploading(true);
    setUploadProgress(0);
    setError(null);

    try {
      for (let i = 0; i < acceptedFiles.length; i++) {
        const file = acceptedFiles[i];
        const fileId = uuidv4();
        
        try {
          // Process and validate the image
          const processedFile = await validateAndProcessImage(file);
          
          // Compress image and create thumbnail
          const [compressedFile, thumbnailFile] = await Promise.all([
            compressImage(processedFile),
            createThumbnail(processedFile)
          ]);

          // Upload both files
          const [imageUpload, thumbnailUpload] = await Promise.all([
            supabase.storage
              .from('cat-images')
              .upload(`${fileId}.jpg`, compressedFile),
            supabase.storage
              .from('cat-images')
              .upload(`thumbnails/${fileId}.jpg`, thumbnailFile)
          ]);

          if (imageUpload.error || thumbnailUpload.error) {
            throw new Error('שגיאה בהעלאת הקבצים');
          }

          // Get public URLs
          const [imageUrl, thumbnailUrl] = [
            supabase.storage
              .from('cat-images')
              .getPublicUrl(`${fileId}.jpg`).data.publicUrl,
            supabase.storage
              .from('cat-images')
              .getPublicUrl(`thumbnails/${fileId}.jpg`).data.publicUrl
          ];

          // Save to database
          const { error: dbError } = await supabase
            .from('cat_images')
            .insert([{
              id: fileId,
              url: imageUrl,
              thumbnail_url: thumbnailUrl,
              order: images.length + i
            }]);

          if (dbError) throw dbError;

          setImages(prev => [...prev, {
            id: fileId,
            url: imageUrl,
            thumbnail_url: thumbnailUrl,
            order: images.length + i
          }]);

          setUploadProgress(((i + 1) / acceptedFiles.length) * 100);
        } catch (error) {
          if (error instanceof Error) {
            setError(error.message);
          }
          // Skip to next file if current one fails
          continue;
        }
      }
    } catch (error) {
      console.error('Error processing images:', error);
      if (error instanceof Error) {
        setError(error.message);
      }
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, [images]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp']
    },
    onDrop,
    maxSize: 10 * 1024 * 1024 // 10MB
  });

  const handleDelete = async (imageId: string) => {
    if (!confirm('האם את/ה בטוח/ה שברצונך למחוק תמונה זו?')) return;

    try {
      // Delete the image files from storage
      await Promise.all([
        supabase.storage
          .from('cat-images')
          .remove([`${imageId}.jpg`]),
        supabase.storage
          .from('cat-images')
          .remove([`thumbnails/${imageId}.jpg`])
      ]);

      // Delete from database
      const { error } = await supabase
        .from('cat_images')
        .delete()
        .eq('id', imageId);

      if (error) throw error;

      setImages(prev => {
        const newImages = prev.filter(img => img.id !== imageId);
        // Update order for remaining images
        return newImages.map((img, index) => ({
          ...img,
          order: index
        }));
      });

      // Update order in database for remaining images
      const remainingImages = images.filter(img => img.id !== imageId);
      const updatedImages = remainingImages.map((img, index) => ({
        ...img,
        order: index
      }));

      await supabase
        .from('cat_images')
        .upsert(updatedImages.map(img => ({
          id: img.id,
          url: img.url,
          thumbnail_url: img.thumbnail_url,
          order: img.order
        })));

    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  const togglePageVisibility = async () => {
    try {
      const newVisibility = !isPageVisible;
      
      const { error } = await supabase
        .from('site_settings')
        .upsert({
          key: 'show_cats_page',
          value: newVisibility,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      setIsPageVisible(newVisibility);
    } catch (error) {
      console.error('Error updating page visibility:', error);
      // Revert the state if the update failed
      setIsPageVisible(!isPageVisible);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-purple-700" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-purple-900">גלריית חתולים</h2>
        <div className="flex items-center">
          <span className="text-sm text-purple-700 ml-3">
            {isPageVisible ? 'העמוד מוצג' : 'העמוד מוסתר'}
          </span>
          <button
            onClick={togglePageVisibility}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              isPageVisible ? 'bg-purple-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isPageVisible ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      <div className="bg-purple-50 p-6 rounded-lg">
        <p className="text-purple-800">
          כאן תוכלו להעלות, לסדר ולנהל את התמונות של החתולים שלנו. גררו את התמונות כדי לשנות את הסדר שלהן, או השתמשו בכפתור המחיקה להסרת תמונות.
        </p>
      </div>

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-purple-500 bg-purple-50' : 'border-gray-300 hover:border-purple-400'
        }`}
      >
        <input {...getInputProps()} />
        <div className="space-y-2">
          <Upload className="w-8 h-8 mx-auto text-gray-400" />
          <p className="text-gray-600">גרור תמונות לכאן או לחץ לבחירה</p>
          <p className="text-sm text-gray-500">JPEG, PNG, WebP עד 10MB</p>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {isUploading && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-purple-700">מעלה תמונות...</span>
            <span className="text-sm text-purple-700">{Math.round(uploadProgress)}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-500 transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={onDragEnd}
      >
        <SortableContext items={images} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image) => (
              <SortableImage
                key={image.id}
                image={image}
                onDelete={() => handleDelete(image.id)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default CatGalleryAdmin;