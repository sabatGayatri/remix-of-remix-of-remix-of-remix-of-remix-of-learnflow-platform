import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface UserProgress {
  id: string;
  user_id: string;
  video_id: string;
  progress_percent: number;
  completed: boolean;
  last_watched_at: string;
  created_at: string;
  updated_at: string;
}

export const useProgress = () => {
  const [progress, setProgress] = useState<UserProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchProgress = useCallback(async () => {
    if (!user) {
      setProgress([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .order('last_watched_at', { ascending: false });

      if (fetchError) {
        setError(fetchError.message);
        return;
      }

      setProgress(data as UserProgress[]);
    } catch (err) {
      setError('Failed to fetch progress');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const updateProgress = async (videoId: string, progressPercent: number): Promise<{ success: boolean; error?: string }> => {
    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    try {
      const completed = progressPercent >= 100;

      const { error: upsertError } = await supabase
        .from('user_progress')
        .upsert(
          {
            user_id: user.id,
            video_id: videoId,
            progress_percent: Math.min(progressPercent, 100),
            completed,
            last_watched_at: new Date().toISOString(),
          },
          {
            onConflict: 'user_id,video_id',
          }
        );

      if (upsertError) {
        return { success: false, error: upsertError.message };
      }

      // Refresh progress
      await fetchProgress();

      return { success: true };
    } catch (err) {
      return { success: false, error: 'Failed to update progress' };
    }
  };

  const markCompleted = async (videoId: string): Promise<{ success: boolean; error?: string }> => {
    return updateProgress(videoId, 100);
  };

  const getVideoProgress = (videoId: string): UserProgress | undefined => {
    return progress.find(p => p.video_id === videoId);
  };

  const getCompletedVideos = (): UserProgress[] => {
    return progress.filter(p => p.completed);
  };

  const getProgressStats = () => {
    const total = progress.length;
    const completed = progress.filter(p => p.completed).length;
    const inProgress = progress.filter(p => !p.completed && p.progress_percent > 0).length;
    const notStarted = progress.filter(p => p.progress_percent === 0).length;

    return {
      total,
      completed,
      inProgress,
      notStarted,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  };

  // Set up realtime subscription
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('progress-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_progress',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setProgress(prev => [payload.new as UserProgress, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setProgress(prev => prev.map(p => p.id === payload.new.id ? payload.new as UserProgress : p));
          } else if (payload.eventType === 'DELETE') {
            setProgress(prev => prev.filter(p => p.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  // Initial fetch
  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  return {
    progress,
    isLoading,
    error,
    fetchProgress,
    updateProgress,
    markCompleted,
    getVideoProgress,
    getCompletedVideos,
    getProgressStats,
  };
};
