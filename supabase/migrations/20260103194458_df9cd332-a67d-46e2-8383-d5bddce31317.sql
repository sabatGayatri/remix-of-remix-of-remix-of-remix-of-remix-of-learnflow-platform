-- Create app_role enum for user roles
CREATE TYPE public.app_role AS ENUM ('learner', 'instructor');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role app_role NOT NULL DEFAULT 'learner',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_roles table for additional role management
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Create videos table for instructor uploads
CREATE TABLE public.videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instructor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  domain TEXT NOT NULL,
  topic TEXT NOT NULL,
  difficulty TEXT NOT NULL DEFAULT 'beginner',
  storage_path TEXT NOT NULL,
  duration_seconds INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_progress table for tracking student progress
CREATE TABLE public.user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  video_id UUID REFERENCES public.videos(id) ON DELETE CASCADE NOT NULL,
  progress_percent INTEGER NOT NULL DEFAULT 0 CHECK (progress_percent >= 0 AND progress_percent <= 100),
  completed BOOLEAN NOT NULL DEFAULT false,
  last_watched_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, video_id)
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

-- Security definer function to check user role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Function to get user role from profiles
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE user_id = _user_id
$$;

-- Profiles RLS policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- User roles RLS policies
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own roles"
  ON public.user_roles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Videos RLS policies
CREATE POLICY "Anyone can view videos"
  ON public.videos FOR SELECT
  USING (true);

CREATE POLICY "Instructors can insert videos"
  ON public.videos FOR INSERT
  WITH CHECK (
    auth.uid() = instructor_id AND
    public.get_user_role(auth.uid()) = 'instructor'
  );

CREATE POLICY "Instructors can update their own videos"
  ON public.videos FOR UPDATE
  USING (
    auth.uid() = instructor_id AND
    public.get_user_role(auth.uid()) = 'instructor'
  );

CREATE POLICY "Instructors can delete their own videos"
  ON public.videos FOR DELETE
  USING (
    auth.uid() = instructor_id AND
    public.get_user_role(auth.uid()) = 'instructor'
  );

-- User progress RLS policies
CREATE POLICY "Users can view their own progress"
  ON public.user_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress"
  ON public.user_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress"
  ON public.user_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- Instructors can view progress for their videos
CREATE POLICY "Instructors can view progress on their videos"
  ON public.user_progress FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.videos
      WHERE videos.id = user_progress.video_id
      AND videos.instructor_id = auth.uid()
    )
  );

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'name', 'User'),
    NEW.email,
    COALESCE((NEW.raw_user_meta_data ->> 'role')::app_role, 'learner')
  );
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (
    NEW.id,
    COALESCE((NEW.raw_user_meta_data ->> 'role')::app_role, 'learner')
  );
  
  RETURN NEW;
END;
$$;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_videos_updated_at
  BEFORE UPDATE ON public.videos
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_progress_updated_at
  BEFORE UPDATE ON public.user_progress
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for videos and user_progress
ALTER PUBLICATION supabase_realtime ADD TABLE public.videos;
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_progress;

-- Create storage bucket for videos
INSERT INTO storage.buckets (id, name, public) VALUES ('videos', 'videos', true);

-- Storage policies for videos bucket
CREATE POLICY "Anyone can view videos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'videos');

CREATE POLICY "Instructors can upload videos"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'videos' AND
    public.get_user_role(auth.uid()) = 'instructor'
  );

CREATE POLICY "Instructors can update their videos"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'videos' AND
    public.get_user_role(auth.uid()) = 'instructor'
  );

CREATE POLICY "Instructors can delete their videos"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'videos' AND
    public.get_user_role(auth.uid()) = 'instructor'
  );