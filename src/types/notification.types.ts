export enum NotificationType {
  COMMENT = 'comment',
  REVIEW = 'review',
  ASSIGNMENT = 'assignment',
  STATUS_CHANGE = 'status_change'
}

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  related_id?: string;
  is_read: boolean;
  created_at: Date;
}

export interface CreateNotificationDto {
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  related_id?: string;
}

export interface ProjectStats {
  total_submissions: number;
  pending_submissions: number;
  in_review_submissions: number;
  approved_submissions: number;
  changes_requested_submissions: number;
  avg_review_time_hours: number;
  approval_rate: number;
  most_active_reviewers: Array<{
    user_id: string;
    name: string;
    review_count: number;
  }>;
  most_commented_submission: {
    submission_id: string;
    title: string;
    comment_count: number;
  } | null;
}