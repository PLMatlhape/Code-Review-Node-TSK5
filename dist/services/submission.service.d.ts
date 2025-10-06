import { Submission, CreateSubmissionDto, SubmissionStatus } from '../types/submission.types';
export declare class SubmissionService {
    createSubmission(submitterId: string, data: CreateSubmissionDto): Promise<Submission>;
    getSubmissionById(submissionId: string): Promise<Submission | null>;
    getSubmissionsByProject(projectId: string): Promise<Submission[]>;
    getSubmissionsByUser(userId: string): Promise<Submission[]>;
    updateSubmission(submissionId: string, data: Partial<CreateSubmissionDto>): Promise<Submission>;
    updateSubmissionStatus(submissionId: string, status: SubmissionStatus): Promise<Submission>;
    deleteSubmission(submissionId: string): Promise<void>;
    isSubmitter(submissionId: string, userId: string): Promise<boolean>;
    canAccessSubmission(submissionId: string, userId: string): Promise<boolean>;
}
//# sourceMappingURL=submission.service.d.ts.map