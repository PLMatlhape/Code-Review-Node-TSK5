import { Project, CreateProjectDto } from '../types/project.types';
export declare class ProjectModel {
    static create(ownerId: string, data: CreateProjectDto): Promise<Project>;
    static findById(id: string): Promise<Project | null>;
    static findByOwner(ownerId: string): Promise<Project[]>;
    static findAll(): Promise<Project[]>;
    static update(id: string, updates: Partial<CreateProjectDto>): Promise<Project>;
    static delete(id: string): Promise<boolean>;
}
//# sourceMappingURL=project.model.d.ts.map