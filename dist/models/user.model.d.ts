import { User, UserRole } from '../types/user.types';
export declare class UserModel {
    static create(email: string, passwordHash: string, name: string, role?: UserRole): Promise<User>;
    static findById(id: string): Promise<User | null>;
    static findByEmail(email: string): Promise<User | null>;
    static update(id: string, updates: Partial<User>): Promise<User>;
    static delete(id: string): Promise<boolean>;
}
//# sourceMappingURL=user.model.d.ts.map