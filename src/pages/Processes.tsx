import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { Process } from '../types';

const ProcessesPage: React.FC = () => {
  const [processes, setProcesses] = useState<Process[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProcesses = async () => {
      try {
        const { data, error } = await supabase
          .from('processes')
          .select('*')
          .order('name');

        if (error) throw error;
        setProcesses(data || []);
      } catch (error) {
        console.error('Error fetching processes:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProcesses();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-purple-900 mb-8 text-center">תהליכי הכנה</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {processes.map((process) => (
            <Link
              key={process.id}
              to={`/process/${process.id}`}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <h2 className="text-xl font-bold text-purple-900 mb-2">{process.name}</h2>
              <p className="text-purple-700 line-clamp-3">{process.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProcessesPage;