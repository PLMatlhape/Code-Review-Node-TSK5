"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubmissionService = void 0;
const database_1 = require("../config/database");
const project_service_1 = require("./project.service");
const projectService = new project_service_1.ProjectService();
class SubmissionService {
    async createSubmission(submitterId, data) {
        const isMember = await projectService.isUserMember(data.project_id, submitterId);
        if (!isMember) {
            throw new Error('You need to join this project before submitting code.');
        }
        const result = await (0, database_1.query)(`INSERT INTO submissions (project_id, submitter_id, title, description, code_content, file_name, language, status) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
       RETURNING *`, [data.project_id, submitterId, data.title, data.description, data.code_content, data.file_name, data.language, 'pending']);
        return result.rows[0];
    }
    async getSubmissionById(submissionId) {
        const result = await (0, database_1.query)(`SELECT s.*, u.name as submitter_name, u.email as submitter_email, p.name as project_name
       FROM submissions s
       JOIN users u ON s.submitter_id = u.id
       JOIN projects p ON s.project_id = p.id
       WHERE s.id = $1`, [submissionId]);
        return result.rows.length > 0 ? result.rows[0] : null;
    }
    async getSubmissionsByProject(projectId) {
        const result = await (0, database_1.query)(`SELECT s.*, u.name as submitter_name, u.email as submitter_email
       FROM submissions s
       JOIN users u ON s.submitter_id = u.id
       WHERE s.project_id = $1
       ORDER BY s.created_at DESC`, [projectId]);
        return result.rows;
    }
    async getSubmissionsByUser(userId) {
        const result = await (0, database_1.query)(`SELECT s.*, p.name as project_name
       FROM submissions s
       JOIN projects p ON s.project_id = p.id
       WHERE s.submitter_id = $1
       ORDER BY s.created_at DESC`, [userId]);
        return result.rows;
    }
    async updateSubmission(submissionId, data) {
        const fields = [];
        const values = [];
        let paramCount = 1;
        if (data.title) {
            fields.push(`title = $${paramCount++}`);
            values.push(data.title);
        }
        if (data.description !== undefined) {
            fields.push(`description = $${paramCount++}`);
            values.push(data.description);
        }
        if (data.code_content) {
            fields.push(`code_content = $${paramCount++}`);
            values.push(data.code_content);
        }
        if (data.file_name !== undefined) {
            fields.push(`file_name = $${paramCount++}`);
            values.push(data.file_name);
        }
        if (data.language !== undefined) {
            fields.push(`language = $${paramCount++}`);
            values.push(data.language);
        }
        fields.push(`updated_at = CURRENT_TIMESTAMP`);
        values.push(submissionId);
        const result = await (0, database_1.query)(`UPDATE submissions SET ${fields.join(', ')} 
       WHERE id = $${paramCount} 
       RETURNING *`, values);
        return result.rows[0];
    }
    async updateSubmissionStatus(submissionId, status) {
        const result = await (0, database_1.query)(`UPDATE submissions 
       SET status = $1, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $2 
       RETURNING *`, [status, submissionId]);
        return result.rows[0];
    }
    async deleteSubmission(submissionId) {
        await (0, database_1.query)('DELETE FROM submissions WHERE id = $1', [submissionId]);
    }
    async isSubmitter(submissionId, userId) {
        const result = await (0, database_1.query)('SELECT 1 FROM submissions WHERE id = $1 AND submitter_id = $2', [submissionId, userId]);
        return result.rows.length > 0;
    }
    async canAccessSubmission(submissionId, userId) {
        const result = await (0, database_1.query)(`SELECT 1 FROM submissions s
       WHERE s.id = $1 
       AND (
         s.submitter_id = $2 
         OR EXISTS (
           SELECT 1 FROM project_members pm 
           WHERE pm.project_id = s.project_id AND pm.user_id = $2
         )
         OR EXISTS (
           SELECT 1 FROM projects p 
           WHERE p.id = s.project_id AND p.owner_id = $2
         )
       )`, [submissionId, userId]);
        return result.rows.length > 0;
    }
}
exports.SubmissionService = SubmissionService;
//# sourceMappingURL=submission.service.js.map