import { Project, CreateProjectDto, ProjectMember } from '../types/project.types';
export declare class ProjectService {
    createProject(ownerId: string, data: CreateProjectDto): Promise<Project>;
    getProjectById(projectId: string): Promise<Project | null>;
    getAllProjects(userId?: string): Promise<Project[]>;
    updateProject(projectId: string, data: Partial<CreateProjectDto>): Promise<Project>;
    deleteProject(projectId: string): Promise<void>;
    addMember(projectId: string, userId: string, role?: string): Promise<ProjectMember>;
    removeMember(projectId: string, userId: string): Promise<void>;
    getProjectMembers(projectId: string): Promise<ProjectMember[]>;
    isUserMember(projectId: string, userId: string): Promise<boolean>;
    isUserOwner(projectId: string, userId: string): Promise<boolean>;
}
//# sourceMappingURL=project.service.d.ts.map