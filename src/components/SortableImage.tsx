import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { X, GripHorizontal } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface SortableImageProps {
  image: {
    id: string;
    url: string;
    thumbnail_url: string;
  };
  onDelete: () => void;
}

const SortableImage: React.FC<SortableImageProps> = ({ image, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleDelete = async () => {
    try {
      // Delete the image files from storage
      await Promise.all([
        supabase.storage
          .from('cat-images')
          .remove([`${image.id}.jpg`]),
        supabase.storage
          .from('cat-images')
          .remove([`thumbnails/${image.id}.jpg`])
      ]);

      // Call the onDelete callback to remove from database and state
      onDelete();
    } catch (error) {
      console.error('Error deleting image files:', error);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative group aspect-square rounded-lg overflow-hidden shadow-md"
    >
      <img
        src={image.thumbnail_url}
        alt="תמונת חתול"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center opacity-0 group-hover:opacity-100">
        <button
          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
          onClick={handleDelete}
        >
          <X size={16} />
        </button>
        <button
          {...attributes}
          {...listeners}
          className="absolute top-2 left-2 p-1 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition-colors cursor-move"
        >
          <GripHorizontal size={16} />
        </button>
      </div>
    </div>
  );
};

export default SortableImage;