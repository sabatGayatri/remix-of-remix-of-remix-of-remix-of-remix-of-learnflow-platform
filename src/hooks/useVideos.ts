import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Video {
  id: string;
  instructor_id: string;
  title: string;
  description: string | null;
  domain: string;
  topic: string;
  difficulty: string;
  storage_path: string;
  duration_seconds: number | null;
  created_at: string;
  updated_at: string;
}

export interface UploadVideoData {
  title: string;
  description?: string;
  domain: string;
  topic: string;
  difficulty: string;
  file: File;
}

export const useVideos = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchVideos = useCallback(async (filters?: { domain?: string; topic?: string; difficulty?: string }) => {
    setIsLoading(true);
    setError(null);

    try {
      let query = supabase.from('videos').select('*').order('created_at', { ascending: false });
      
      if (filters?.domain) {
        query = query.eq('domain', filters.domain);
      }
      if (filters?.topic) {
        query = query.eq('topic', filters.topic);
      }
      if (filters?.difficulty) {
        query = query.eq('difficulty', filters.difficulty);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        setError(fetchError.message);
        return;
      }

      setVideos(data as Video[]);
    } catch (err) {
      setError('Failed to fetch videos');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchInstructorVideos = useCallback(async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('videos')
        .select('*')
        .eq('instructor_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) {
        setError(fetchError.message);
        return;
      }

      setVideos(data as Video[]);
    } catch (err) {
      setError('Failed to fetch videos');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const uploadVideo = async (data: UploadVideoData): Promise<{ success: boolean; error?: string; video?: Video }> => {
    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    try {
      // Create storage path: videos/{domain}/{topic}/{filename}
      const fileExt = data.file.name.split('.').pop();
      const fileName = `${Date.now()}_${data.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.${fileExt}`;
      const storagePath = `${data.domain}/${data.topic}/${fileName}`;

      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from('videos')
        .upload(storagePath, data.file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        return { success: false, error: uploadError.message };
      }

      // Insert video record
      const { data: videoData, error: insertError } = await supabase
        .from('videos')
        .insert({
          instructor_id: user.id,
          title: data.title,
          description: data.description || null,
          domain: data.domain,
          topic: data.topic,
          difficulty: data.difficulty,
          storage_path: storagePath,
        })
        .select()
        .single();

      if (insertError) {
        // Try to clean up uploaded file
        await supabase.storage.from('videos').remove([storagePath]);
        return { success: false, error: insertError.message };
      }

      return { success: true, video: videoData as Video };
    } catch (err) {
      return { success: false, error: 'Failed to upload video' };
    }
  };

  const deleteVideo = async (videoId: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // Get the video to find storage path
      const { data: video, error: fetchError } = await supabase
        .from('videos')
        .select('storage_path')
        .eq('id', videoId)
        .single();

      if (fetchError) {
        return { success: false, error: fetchError.message };
      }

      // Delete from storage
      if (video?.storage_path) {
        await supabase.storage.from('videos').remove([video.storage_path]);
      }

      // Delete record
      const { error: deleteError } = await supabase
        .from('videos')
        .delete()
        .eq('id', videoId);

      if (deleteError) {
        return { success: false, error: deleteError.message };
      }

      // Update local state
      setVideos(prev => prev.filter(v => v.id !== videoId));

      return { success: true };
    } catch (err) {
      return { success: false, error: 'Failed to delete video' };
    }
  };

  const getVideoUrl = (storagePath: string): string => {
    const { data } = supabase.storage.from('videos').getPublicUrl(storagePath);
    return data.publicUrl;
  };

  // Set up realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel('videos-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'videos',
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setVideos(prev => [payload.new as Video, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setVideos(prev => prev.map(v => v.id === payload.new.id ? payload.new as Video : v));
          } else if (payload.eventType === 'DELETE') {
            setVideos(prev => prev.filter(v => v.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    videos,
    isLoading,
    error,
    fetchVideos,
    fetchInstructorVideos,
    uploadVideo,
    deleteVideo,
    getVideoUrl,
  };
};
