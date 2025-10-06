"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectService = void 0;
const database_1 = require("../config/database");
class ProjectService {
    async createProject(ownerId, data) {
        const result = await (0, database_1.query)(`INSERT INTO projects (name, description, owner_id) 
       VALUES ($1, $2, $3) 
       RETURNING *`, [data.name, data.description, ownerId]);
        await (0, database_1.query)(`INSERT INTO project_members (project_id, user_id, role) 
       VALUES ($1, $2, $3)`, [result.rows[0].id, ownerId, 'admin']);
        return result.rows[0];
    }
    async getProjectById(projectId) {
        const result = await (0, database_1.query)('SELECT * FROM projects WHERE id = $1', [projectId]);
        return result.rows.length > 0 ? result.rows[0] : null;
    }
    async getAllProjects(userId) {
        let queryText = 'SELECT DISTINCT p.* FROM projects p';
        const params = [];
        if (userId) {
            queryText += ` LEFT JOIN project_members pm ON p.id = pm.project_id 
                     WHERE p.owner_id = $1 OR pm.user_id = $1`;
            params.push(userId);
        }
        queryText += ' ORDER BY p.created_at DESC';
        const result = await (0, database_1.query)(queryText, params);
        return result.rows;
    }
    async updateProject(projectId, data) {
        const fields = [];
        const values = [];
        let paramCount = 1;
        if (data.name) {
            fields.push(`name = $${paramCount++}`);
            values.push(data.name);
        }
        if (data.description !== undefined) {
            fields.push(`description = $${paramCount++}`);
            values.push(data.description);
        }
        fields.push(`updated_at = CURRENT_TIMESTAMP`);
        values.push(projectId);
        const result = await (0, database_1.query)(`UPDATE projects SET ${fields.join(', ')} 
       WHERE id = $${paramCount} 
       RETURNING *`, values);
        return result.rows[0];
    }
    async deleteProject(projectId) {
        await (0, database_1.query)('DELETE FROM projects WHERE id = $1', [projectId]);
    }
    async addMember(projectId, userId, role = 'reviewer') {
        const existing = await (0, database_1.query)('SELECT * FROM project_members WHERE project_id = $1 AND user_id = $2', [projectId, userId]);
        if (existing.rows.length > 0) {
            throw new Error('This person is already part of the project team.');
        }
        const result = await (0, database_1.query)(`INSERT INTO project_members (project_id, user_id, role) 
       VALUES ($1, $2, $3) 
       RETURNING *`, [projectId, userId, role]);
        return result.rows[0];
    }
    async removeMember(projectId, userId) {
        const project = await this.getProjectById(projectId);
        if (project && project.owner_id === userId) {
            throw new Error('Project owners cannot be removed from their own projects.');
        }
        await (0, database_1.query)('DELETE FROM project_members WHERE project_id = $1 AND user_id = $2', [projectId, userId]);
    }
    async getProjectMembers(projectId) {
        const result = await (0, database_1.query)(`SELECT pm.*, u.name, u.email, u.display_picture 
       FROM project_members pm 
       JOIN users u ON pm.user_id = u.id 
       WHERE pm.project_id = $1 
       ORDER BY pm.added_at`, [projectId]);
        return result.rows;
    }
    async isUserMember(projectId, userId) {
        const result = await (0, database_1.query)(`SELECT 1 FROM project_members WHERE project_id = $1 AND user_id = $2
       UNION
       SELECT 1 FROM projects WHERE id = $1 AND owner_id = $2`, [projectId, userId]);
        return result.rows.length > 0;
    }
    async isUserOwner(projectId, userId) {
        const result = await (0, database_1.query)('SELECT 1 FROM projects WHERE id = $1 AND owner_id = $2', [projectId, userId]);
        return result.rows.length > 0;
    }
}
exports.ProjectService = ProjectService;
//# sourceMappingURL=project.service.js.map