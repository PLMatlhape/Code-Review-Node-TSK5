export interface Project {
  id: string;
  name: string;
  description?: string;
  owner_id: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateProjectDto {
  name: string;
  description?: string;
}

export interface ProjectMember {
  id: string;
  project_id: string;
  user_id: string;
  role: string;
  added_at: Date;
}

export interface ProjectWithMembers extends Project {
  members: ProjectMember[];
}