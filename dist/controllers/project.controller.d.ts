import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare class ProjectController {
    createProject(req: AuthRequest, res: Response): Promise<void>;
    getProject(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getAllProjects(req: AuthRequest, res: Response): Promise<void>;
    updateProject(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    deleteProject(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    addMember(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    removeMember(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getMembers(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=project.controller.d.ts.map