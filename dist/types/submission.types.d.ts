export declare enum SubmissionStatus {
    PENDING = "pending",
    IN_REVIEW = "in_review",
    APPROVED = "approved",
    CHANGES_REQUESTED = "changes_requested"
}
export interface Submission {
    id: string;
    project_id: string;
    submitter_id: string;
    title: string;
    description?: string;
    code_content: string;
    file_name?: string;
    language?: string;
    status: SubmissionStatus;
    created_at: Date;
    updated_at: Date;
}
export interface CreateSubmissionDto {
    project_id: string;
    title: string;
    description?: string;
    code_content: string;
    file_name?: string;
    language?: string;
}
export interface UpdateSubmissionStatusDto {
    status: SubmissionStatus;
}
export interface Comment {
    id: string;
    submission_id: string;
    user_id: string;
    content: string;
    line_number?: number;
    created_at: Date;
    updated_at: Date;
}
export interface CreateCommentDto {
    content: string;
    line_number?: number;
}
export interface Review {
    id: string;
    submission_id: string;
    reviewer_id: string;
    status: SubmissionStatus;
    comment?: string;
    created_at: Date;
}
export interface CreateReviewDto {
    status: SubmissionStatus;
    comment?: string;
}
//# sourceMappingURL=submission.types.d.ts.map