import { Comment, CreateCommentDto } from '../types/submission.types';
export declare class CommentModel {
    static create(submissionId: string, userId: string, data: CreateCommentDto): Promise<Comment>;
    static findById(id: string): Promise<Comment | null>;
    static findBySubmission(submissionId: string): Promise<Comment[]>;
    static update(id: string, content: string): Promise<Comment>;
    static delete(id: string): Promise<boolean>;
    static findByUser(userId: string): Promise<Comment[]>;
}
//# sourceMappingURL=comment.model.d.ts.map