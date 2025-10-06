"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubmissionController = void 0;
const submission_service_1 = require("../services/submission.service");
const project_service_1 = require("../services/project.service");
const submissionService = new submission_service_1.SubmissionService();
const projectService = new project_service_1.ProjectService();
class SubmissionController {
    async createSubmission(req, res) {
        try {
            const data = req.body;
            const submission = await submissionService.createSubmission(req.user.userId, data);
            res.status(201).json({
                success: true,
                data: submission
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }
    async getSubmission(req, res) {
        try {
            const { id } = req.params;
            const canAccess = await submissionService.canAccessSubmission(id, req.user.userId);
            if (!canAccess) {
                return res.status(403).json({
                    success: false,
                    error: 'Access denied'
                });
            }
            const submission = await submissionService.getSubmissionById(id);
            if (!submission) {
                return res.status(404).json({
                    success: false,
                    error: 'Submission not found'
                });
            }
            res.status(200).json({
                success: true,
                data: submission
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
    async getSubmissionsByProject(req, res) {
        try {
            const { id } = req.params;
            const isMember = await projectService.isUserMember(id, req.user.userId);
            if (!isMember) {
                return res.status(403).json({
                    success: false,
                    error: 'Access denied'
                });
            }
            const submissions = await submissionService.getSubmissionsByProject(id);
            res.status(200).json({
                success: true,
                data: submissions
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
    async getMySubmissions(req, res) {
        try {
            const submissions = await submissionService.getSubmissionsByUser(req.user.userId);
            res.status(200).json({
                success: true,
                data: submissions
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
    async updateSubmission(req, res) {
        try {
            const { id } = req.params;
            const data = req.body;
            const isSubmitter = await submissionService.isSubmitter(id, req.user.userId);
            if (!isSubmitter) {
                return res.status(403).json({
                    success: false,
                    error: 'Only submitter can update'
                });
            }
            const submission = await submissionService.updateSubmission(id, data);
            res.status(200).json({
                success: true,
                data: submission
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }
    async updateSubmissionStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const canAccess = await submissionService.canAccessSubmission(id, req.user.userId);
            if (!canAccess) {
                return res.status(403).json({
                    success: false,
                    error: 'Access denied'
                });
            }
            const submission = await submissionService.updateSubmissionStatus(id, status);
            res.status(200).json({
                success: true,
                data: submission
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }
    async deleteSubmission(req, res) {
        try {
            const { id } = req.params;
            const isSubmitter = await submissionService.isSubmitter(id, req.user.userId);
            if (!isSubmitter) {
                return res.status(403).json({
                    success: false,
                    error: 'Only submitter can delete'
                });
            }
            await submissionService.deleteSubmission(id);
            res.status(200).json({
                success: true,
                message: 'Submission deleted successfully'
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
}
exports.SubmissionController = SubmissionController;
//# sourceMappingURL=submission.controller.js.map