import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { ProjectService } from '../services/project.service';
import { CreateProjectDto } from '../types/project.types';

const projectService = new ProjectService();

export class ProjectController {
  async createProject(req: AuthRequest, res: Response) {
    try {
      const data: CreateProjectDto = req.body;
      const project = await projectService.createProject(req.user!.userId, data);

      res.status(201).json({
        success: true,
        data: project
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async getProject(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const project = await projectService.getProjectById(id);

      if (!project) {
        return res.status(404).json({
          success: false,
          error: 'Project not found'
        });
      }

      const isMember = await projectService.isUserMember(id, req.user!.userId);

      if (!isMember) {
        return res.status(403).json({
          success: false,
          error: 'Access denied'
        });
      }

      res.status(200).json({
        success: true,
        data: project
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async getAllProjects(req: AuthRequest, res: Response) {
    try {
      const projects = await projectService.getAllProjects(req.user!.userId);

      res.status(200).json({
        success: true,
        data: projects
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async updateProject(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const data: Partial<CreateProjectDto> = req.body;

      const isOwner = await projectService.isUserOwner(id, req.user!.userId);

      if (!isOwner) {
        return res.status(403).json({
          success: false,
          error: 'Only project owner can update'
        });
      }

      const project = await projectService.updateProject(id, data);

      res.status(200).json({
        success: true,
        data: project
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async deleteProject(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      const isOwner = await projectService.isUserOwner(id, req.user!.userId);

      if (!isOwner) {
        return res.status(403).json({
          success: false,
          error: 'Only project owner can delete'
        });
      }

      await projectService.deleteProject(id);

      res.status(200).json({
        success: true,
        message: 'Project deleted successfully'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async addMember(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const { userId, role } = req.body;

      const isOwner = await projectService.isUserOwner(id, req.user!.userId);

      if (!isOwner) {
        return res.status(403).json({
          success: false,
          error: 'Only project owner can add members'
        });
      }

      const member = await projectService.addMember(id, userId, role);

      res.status(201).json({
        success: true,
        data: member
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async removeMember(req: AuthRequest, res: Response) {
    try {
      const { id, userId } = req.params;

      const isOwner = await projectService.isUserOwner(id, req.user!.userId);

      if (!isOwner) {
        return res.status(403).json({
          success: false,
          error: 'Only project owner can remove members'
        });
      }

      await projectService.removeMember(id, userId);

      res.status(200).json({
        success: true,
        message: 'Member removed successfully'
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async getMembers(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      const isMember = await projectService.isUserMember(id, req.user!.userId);

      if (!isMember) {
        return res.status(403).json({
          success: false,
          error: 'Access denied'
        });
      }

      const members = await projectService.getProjectMembers(id);

      res.status(200).json({
        success: true,
        data: members
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}