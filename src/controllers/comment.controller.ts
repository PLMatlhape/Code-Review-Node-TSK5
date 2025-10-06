import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { CommentService } from '../services/comment.service';
import { SubmissionService } from '../services/submission.service';
import { CreateCommentDto } from '../types/submission.types';

const commentService = new CommentService();
const submissionService = new SubmissionService();

export class CommentController {
  async createComment(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const data: CreateCommentDto = req.body;

      const comment = await commentService.createComment(id, req.user!.userId, data);

      res.status(201).json({
        success: true,
        data: comment
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async getComments(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      const canAccess = await submissionService.canAccessSubmission(id, req.user!.userId);

      if (!canAccess) {
        return res.status(403).json({
          success: false,
          error: 'Access denied'
        });
      }

      const comments = await commentService.getCommentsBySubmission(id);

      res.status(200).json({
        success: true,
        data: comments
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async updateComment(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const { content } = req.body;

      const isOwner = await commentService.isCommentOwner(id, req.user!.userId);

      if (!isOwner) {
        return res.status(403).json({
          success: false,
          error: 'Only comment owner can update'
        });
      }

      const comment = await commentService.updateComment(id, content);

      res.status(200).json({
        success: true,
        data: comment
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async deleteComment(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      const isOwner = await commentService.isCommentOwner(id, req.user!.userId);

      if (!isOwner) {
        return res.status(403).json({
          success: false,
          error: 'Only comment owner can delete'
        });
      }

      await commentService.deleteComment(id);

      res.status(200).json({
        success: true,
        message: 'Comment deleted successfully'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async getComment(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      const canAccess = await commentService.canAccessComment(id, req.user!.userId);

      if (!canAccess) {
        return res.status(403).json({
          success: false,
          error: 'Access denied'
        });
      }

      const comment = await commentService.getCommentById(id);

      if (!comment) {
        return res.status(404).json({
          success: false,
          error: 'Comment not found'
        });
      }

      res.status(200).json({
        success: true,
        data: comment
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}