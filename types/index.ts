export interface Project {
  id: string;
  title: string;
  slug: string;
  description?: string;
  type: string;
  tech_stack: string[];
  design_tools: string[];
  thumbnail_url?: string;
  images: string[];
  repo_url?: string;
  live_demo_url?: string;
  case_study_url?: string;
  behance_url?: string;
  is_featured: boolean;
  display_order: number;
  created_at: string;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  employment_type: string;
  location_type: string;
  city?: string;
  period_start: string;
  period_end?: string;
  responsibilities: string[];
  technologies: string[];
  key_achievement?: string;
  display_order: number;
}

export interface Certificate {
  id: string;
  title: string;
  issuer?: string;
  credential_url?: string;
  image_url?: string;
  icon_type: string;
  issued_year: number;
  display_order: number;
}

export interface ContactMessage {
  id: string;
  full_name: string;
  email: string;
  subject?: string;
  message: string;
  budget?: string;
  project_type?: string;
  is_read: boolean;
  sent_at: string;
  phone_num?: string;
}

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  avatar_url?: string;
  bio?: string;
  site_title?: string;
  meta_description?: string;
}

export interface SkillCategory {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  type: string;
  display_order: number;
  skills?: any[];
}
