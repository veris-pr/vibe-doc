export interface User {
  id: number;
  email: string | null;
  username: string;
  github_id: string | null;
  avatar_url: string | null;
}

export interface Project {
  id: number;
  organization_id: number;
  name: string;
  slug: string;
  description: string | null;
  logo_url: string | null;
  primary_color: string;
  github_repo: string | null;
  github_branch: string;
  custom_domain: string | null;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface Document {
  id: number;
  project_id: number;
  version_id: number | null;
  title: string;
  slug: string;
  path: string;
  content: string;
  frontmatter: Frontmatter;
  ordering: number;
  parent_id: number | null;
  created_at: string;
  updated_at: string;
}

export interface Frontmatter {
  title: string;
  description: string;
  order: number;
  slug: string;
  hidden: boolean;
  [key: string]: unknown;
}

export interface Version {
  id: number;
  project_id: number;
  name: string;
  branch: string | null;
  is_default: boolean;
  created_at: string;
}

export interface Organization {
  id: number;
  name: string;
  slug: string;
  logo_url: string | null;
  created_at: string;
}

export interface NavigationItem {
  title: string;
  slug: string;
  path: string;
  order: number;
  children: NavigationItem[];
}

export interface ProjectMember {
  user_id: number;
  role: 'owner' | 'editor' | 'viewer';
}