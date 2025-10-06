import { query } from '../config/database';
import { ProjectStats } from '../types/notification.types';

export class StatsService {
  async getProjectStats(projectId: string): Promise<ProjectStats> {
    const totalResult = await query(
      'SELECT COUNT(*) as count FROM submissions WHERE project_id = $1',
      [projectId]
    );

    const statusResult = await query(
      `SELECT status, COUNT(*) as count 
       FROM submissions 
       WHERE project_id = $1 
       GROUP BY status`,
      [projectId]
    );

    const statusCounts: any = {
      pending: 0,
      in_review: 0,
      approved: 0,
      changes_requested: 0
    };

    statusResult.rows.forEach((row: any) => {
      statusCounts[row.status] = parseInt(row.count);
    });

    const avgReviewTimeResult = await query(
      `SELECT AVG(EXTRACT(EPOCH FROM (r.created_at - s.created_at))/3600) as avg_hours
       FROM reviews r
       JOIN submissions s ON r.submission_id = s.id
       WHERE s.project_id = $1 AND r.status IN ('approved', 'changes_requested')`,
      [projectId]
    );

    const avgReviewTime = parseFloat(avgReviewTimeResult.rows[0].avg_hours) || 0;

    const approvalRate = statusCounts.approved + statusCounts.changes_requested > 0
      ? (statusCounts.approved / (statusCounts.approved + statusCounts.changes_requested)) * 100
      : 0;

    const activeReviewersResult = await query(
      `SELECT r.reviewer_id as user_id, u.name, COUNT(*) as review_count
       FROM reviews r
       JOIN submissions s ON r.submission_id = s.id
       JOIN users u ON r.reviewer_id = u.id
       WHERE s.project_id = $1
       GROUP BY r.reviewer_id, u.name
       ORDER BY review_count DESC
       LIMIT 5`,
      [projectId]
    );

    const mostCommentedResult = await query(
      `SELECT s.id as submission_id, s.title, COUNT(c.id) as comment_count
       FROM submissions s
       LEFT JOIN comments c ON s.id = c.submission_id
       WHERE s.project_id = $1
       GROUP BY s.id, s.title
       ORDER BY comment_count DESC
       LIMIT 1`,
      [projectId]
    );

    const mostCommented = mostCommentedResult.rows.length > 0 && mostCommentedResult.rows[0].comment_count > 0
      ? {
          submission_id: mostCommentedResult.rows[0].submission_id,
          title: mostCommentedResult.rows[0].title,
          comment_count: parseInt(mostCommentedResult.rows[0].comment_count)
        }
      : null;

    return {
      total_submissions: parseInt(totalResult.rows[0].count),
      pending_submissions: statusCounts.pending,
      in_review_submissions: statusCounts.in_review,
      approved_submissions: statusCounts.approved,
      changes_requested_submissions: statusCounts.changes_requested,
      avg_review_time_hours: Math.round(avgReviewTime * 100) / 100,
      approval_rate: Math.round(approvalRate * 100) / 100,
      most_active_reviewers: activeReviewersResult.rows.map((row: any) => ({
        user_id: row.user_id,
        name: row.name,
        review_count: parseInt(row.review_count)
      })),
      most_commented_submission: mostCommented
    };
  }
}