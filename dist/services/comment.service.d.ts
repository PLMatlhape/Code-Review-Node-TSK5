import { Comment, CreateCommentDto } from '../types/submission.types';
export declare class CommentService {
    private wsServer?;
    setWebSocketServer(wsServer: any): void;
    createComment(submissionId: string, userId: string, data: CreateCommentDto): Promise<Comment>;
    getCommentsBySubmission(submissionId: string): Promise<Comment[]>;
    getCommentById(commentId: string): Promise<Comment | null>;
    updateComment(commentId: string, content: string): Promise<Comment>;
    deleteComment(commentId: string): Promise<void>;
    isCommentOwner(commentId: string, userId: string): Promise<boolean>;
    canAccessComment(commentId: string, userId: string): Promise<boolean>;
}
//# sourceMappingURL=comment.service.d.ts.map