import { useState, useEffect, useCallback } from 'react';

export interface VideoData {
  id: string;
  title: string;
  uploadDate: string;
  views: number;
  doubts: number;
}

export interface StudentData {
  id: string;
  name: string;
  lastActive: string;
  quizzesCompleted: number;
  avgScore: number;
}

export interface DoubtData {
  id: string;
  studentName: string;
  message: string;
  videoTitle: string;
  timestamp: string;
  resolved: boolean;
}

export interface QuizData {
  id: string;
  title: string;
  topic: string;
  createdDate: string;
  attempts: number;
  avgScore: number;
  avgTimeMinutes: number;
}

export interface ActivityData {
  id: string;
  date: string;
  type: 'video_upload' | 'quiz_created' | 'doubt_received' | 'doubt_resolved';
  title: string;
  details?: string;
}

export interface InstructorData {
  videos: VideoData[];
  students: StudentData[];
  doubts: DoubtData[];
  quizzes: QuizData[];
  activities: ActivityData[];
}

const STORAGE_KEY = 'instructor_data';

const getDefaultData = (): InstructorData => ({
  videos: [
    { id: '1', title: 'Introduction to Algebra', uploadDate: '2025-01-02', views: 156, doubts: 12 },
    { id: '2', title: 'Quadratic Equations', uploadDate: '2025-01-01', views: 89, doubts: 8 },
    { id: '3', title: 'Linear Functions', uploadDate: '2024-12-30', views: 234, doubts: 15 },
  ],
  students: [
    { id: '1', name: 'Rahul Kumar', lastActive: '2025-01-03', quizzesCompleted: 5, avgScore: 78 },
    { id: '2', name: 'Priya Sharma', lastActive: '2025-01-03', quizzesCompleted: 8, avgScore: 92 },
    { id: '3', name: 'Amit Singh', lastActive: '2025-01-02', quizzesCompleted: 3, avgScore: 65 },
    { id: '4', name: 'Sneha Patel', lastActive: '2025-01-03', quizzesCompleted: 6, avgScore: 85 },
  ],
  doubts: [
    { id: '1', studentName: 'Rahul Kumar', message: 'How do we factor trinomials?', videoTitle: 'Introduction to Algebra', timestamp: '2025-01-03T10:30:00', resolved: false },
    { id: '2', studentName: 'Priya Sharma', message: 'Can you explain the quadratic formula?', videoTitle: 'Quadratic Equations', timestamp: '2025-01-03T09:15:00', resolved: false },
    { id: '3', studentName: 'Amit Singh', message: 'What is the slope-intercept form?', videoTitle: 'Linear Functions', timestamp: '2025-01-02T14:45:00', resolved: true },
  ],
  quizzes: [
    { id: '1', title: 'Algebra Basics Quiz', topic: 'Algebra', createdDate: '2025-01-02', attempts: 45, avgScore: 76, avgTimeMinutes: 12 },
    { id: '2', title: 'Quadratic Mastery', topic: 'Quadratics', createdDate: '2025-01-01', attempts: 32, avgScore: 68, avgTimeMinutes: 18 },
    { id: '3', title: 'Functions Test', topic: 'Functions', createdDate: '2024-12-29', attempts: 67, avgScore: 82, avgTimeMinutes: 15 },
  ],
  activities: [
    { id: '1', date: '2025-01-03', type: 'doubt_received', title: 'New doubt from Rahul Kumar', details: 'Introduction to Algebra' },
    { id: '2', date: '2025-01-03', type: 'doubt_received', title: 'New doubt from Priya Sharma', details: 'Quadratic Equations' },
    { id: '3', date: '2025-01-02', type: 'video_upload', title: 'Uploaded: Introduction to Algebra' },
    { id: '4', date: '2025-01-02', type: 'quiz_created', title: 'Created: Algebra Basics Quiz' },
    { id: '5', date: '2025-01-01', type: 'video_upload', title: 'Uploaded: Quadratic Equations' },
    { id: '6', date: '2025-01-01', type: 'quiz_created', title: 'Created: Quadratic Mastery' },
    { id: '7', date: '2024-12-30', type: 'video_upload', title: 'Uploaded: Linear Functions' },
    { id: '8', date: '2024-12-29', type: 'quiz_created', title: 'Created: Functions Test' },
    { id: '9', date: '2024-12-28', type: 'doubt_resolved', title: 'Resolved doubt from Amit Singh' },
  ],
});

export const useInstructorData = () => {
  const [data, setData] = useState<InstructorData>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return getDefaultData();
      }
    }
    return getDefaultData();
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const addVideo = useCallback((video: Omit<VideoData, 'id'>) => {
    const newVideo = { ...video, id: Date.now().toString() };
    setData(prev => ({
      ...prev,
      videos: [newVideo, ...prev.videos],
      activities: [
        { id: Date.now().toString(), date: new Date().toISOString().split('T')[0], type: 'video_upload' as const, title: `Uploaded: ${video.title}` },
        ...prev.activities
      ]
    }));
  }, []);

  const addQuiz = useCallback((quiz: Omit<QuizData, 'id'>) => {
    const newQuiz = { ...quiz, id: Date.now().toString() };
    setData(prev => ({
      ...prev,
      quizzes: [newQuiz, ...prev.quizzes],
      activities: [
        { id: Date.now().toString(), date: new Date().toISOString().split('T')[0], type: 'quiz_created' as const, title: `Created: ${quiz.title}` },
        ...prev.activities
      ]
    }));
  }, []);

  const addDoubt = useCallback((doubt: Omit<DoubtData, 'id'>) => {
    const newDoubt = { ...doubt, id: Date.now().toString() };
    setData(prev => ({
      ...prev,
      doubts: [newDoubt, ...prev.doubts],
      activities: [
        { id: Date.now().toString(), date: new Date().toISOString().split('T')[0], type: 'doubt_received' as const, title: `New doubt from ${doubt.studentName}`, details: doubt.videoTitle },
        ...prev.activities
      ]
    }));
  }, []);

  const resolveDoubt = useCallback((doubtId: string) => {
    setData(prev => ({
      ...prev,
      doubts: prev.doubts.map(d => d.id === doubtId ? { ...d, resolved: true } : d),
      activities: [
        { id: Date.now().toString(), date: new Date().toISOString().split('T')[0], type: 'doubt_resolved' as const, title: 'Resolved a student doubt' },
        ...prev.activities
      ]
    }));
  }, []);

  // Computed stats
  const stats = {
    totalVideos: data.videos.length,
    activeStudents: data.students.filter(s => {
      const lastActive = new Date(s.lastActive);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return lastActive >= weekAgo;
    }).length,
    totalDoubts: data.doubts.length,
    pendingDoubts: data.doubts.filter(d => !d.resolved).length,
    totalViews: data.videos.reduce((sum, v) => sum + v.views, 0),
    avgQuizScore: data.quizzes.length > 0 
      ? Math.round(data.quizzes.reduce((sum, q) => sum + q.avgScore, 0) / data.quizzes.length)
      : 0,
    completionRate: data.students.length > 0
      ? Math.round((data.students.filter(s => s.quizzesCompleted > 0).length / data.students.length) * 100)
      : 0,
    avgTimeMinutes: data.quizzes.length > 0
      ? Math.round(data.quizzes.reduce((sum, q) => sum + q.avgTimeMinutes, 0) / data.quizzes.length)
      : 0,
  };

  const getActivitiesByDate = useCallback((date: string) => {
    return data.activities.filter(a => a.date === date);
  }, [data.activities]);

  return {
    data,
    stats,
    addVideo,
    addQuiz,
    addDoubt,
    resolveDoubt,
    getActivitiesByDate,
  };
};
