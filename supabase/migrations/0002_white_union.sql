/*
  # Initial Schema Setup for NelsonBot AI

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `role` (enum: 'student', 'doctor')
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `pdf_files`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `file_path` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `created_by` (uuid, references profiles)

  2. Security
    - Enable RLS on all tables
    - Add policies for role-based access
*/

-- Create enum for user roles
CREATE TYPE user_role AS ENUM ('student', 'doctor');

-- Create profiles table
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  role user_role NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create pdf_files table
CREATE TABLE pdf_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  file_path text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES profiles(id) ON DELETE SET NULL
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE pdf_files ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- PDF files policies
CREATE POLICY "Authenticated users can view PDFs"
  ON pdf_files
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Doctors can insert PDFs"
  ON pdf_files
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'doctor'
    )
  );

-- Create function to handle profile updates
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON pdf_files
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();