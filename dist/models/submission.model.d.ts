import { Submission, CreateSubmissionDto, SubmissionStatus } from '../types/submission.types';
export declare class SubmissionModel {
    static create(submitterId: string, data: CreateSubmissionDto): Promise<Submission>;
    static findById(id: string): Promise<Submission | null>;
    static findByProject(projectId: string): Promise<Submission[]>;
    static findBySubmitter(submitterId: string): Promise<Submission[]>;
    static updateStatus(id: string, status: SubmissionStatus): Promise<Submission>;
    static update(id: string, updates: Partial<CreateSubmissionDto>): Promise<Submission>;
    static delete(id: string): Promise<boolean>;
}
//# sourceMappingURL=submission.model.d.ts.map