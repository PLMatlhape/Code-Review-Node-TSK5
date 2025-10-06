import { query } from '../config/database';
import { Project, CreateProjectDto, ProjectMember } from '../types/project.types';

export class ProjectService {
  async createProject(ownerId: string, data: CreateProjectDto): Promise<Project> {
    const result = await query(
      `INSERT INTO projects (name, description, owner_id) 
       VALUES ($1, $2, $3) 
       RETURNING *`,
      [data.name, data.description, ownerId]
    );

    await query(
      `INSERT INTO project_members (project_id, user_id, role) 
       VALUES ($1, $2, $3)`,
      [result.rows[0].id, ownerId, 'admin']
    );

    return result.rows[0];
  }

  async getProjectById(projectId: string): Promise<Project | null> {
    const result = await query(
      'SELECT * FROM projects WHERE id = $1',
      [projectId]
    );

    return result.rows.length > 0 ? result.rows[0] : null;
  }

  async getAllProjects(userId?: string): Promise<Project[]> {
    let queryText = 'SELECT DISTINCT p.* FROM projects p';
    const params: any[] = [];

    if (userId) {
      queryText += ` LEFT JOIN project_members pm ON p.id = pm.project_id 
                     WHERE p.owner_id = $1 OR pm.user_id = $1`;
      params.push(userId);
    }

    queryText += ' ORDER BY p.created_at DESC';

    const result = await query(queryText, params);
    return result.rows;
  }

  async updateProject(projectId: string, data: Partial<CreateProjectDto>): Promise<Project> {
    const fields: string[] = [];
    const values: any[] = [];
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

    const result = await query(
      `UPDATE projects SET ${fields.join(', ')} 
       WHERE id = $${paramCount} 
       RETURNING *`,
      values
    );

    return result.rows[0];
  }

  async deleteProject(projectId: string): Promise<void> {
    await query('DELETE FROM projects WHERE id = $1', [projectId]);
  }

  async addMember(projectId: string, userId: string, role: string = 'reviewer'): Promise<ProjectMember> {
    const existing = await query(
      'SELECT * FROM project_members WHERE project_id = $1 AND user_id = $2',
      [projectId, userId]
    );

    if (existing.rows.length > 0) {
      throw new Error('This person is already part of the project team.');
    }

    const result = await query(
      `INSERT INTO project_members (project_id, user_id, role) 
       VALUES ($1, $2, $3) 
       RETURNING *`,
      [projectId, userId, role]
    );

    return result.rows[0];
  }

  async removeMember(projectId: string, userId: string): Promise<void> {
    const project = await this.getProjectById(projectId);
    
    if (project && project.owner_id === userId) {
      throw new Error('Project owners cannot be removed from their own projects.');
    }

    await query(
      'DELETE FROM project_members WHERE project_id = $1 AND user_id = $2',
      [projectId, userId]
    );
  }

  async getProjectMembers(projectId: string): Promise<ProjectMember[]> {
    const result = await query(
      `SELECT pm.*, u.name, u.email, u.display_picture 
       FROM project_members pm 
       JOIN users u ON pm.user_id = u.id 
       WHERE pm.project_id = $1 
       ORDER BY pm.added_at`,
      [projectId]
    );

    return result.rows;
  }

  async isUserMember(projectId: string, userId: string): Promise<boolean> {
    const result = await query(
      `SELECT 1 FROM project_members WHERE project_id = $1 AND user_id = $2
       UNION
       SELECT 1 FROM projects WHERE id = $1 AND owner_id = $2`,
      [projectId, userId]
    );

    return result.rows.length > 0;
  }

  async isUserOwner(projectId: string, userId: string): Promise<boolean> {
    const result = await query(
      'SELECT 1 FROM projects WHERE id = $1 AND owner_id = $2',
      [projectId, userId]
    );

    return result.rows.length > 0;
  }
}