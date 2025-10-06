import { User, UpdateUserDto } from '../types/user.types';
export declare class UserService {
    getUserById(userId: string): Promise<User | null>;
    getUserByEmail(email: string): Promise<User | null>;
    updateUser(userId: string, data: UpdateUserDto): Promise<User>;
    getAllUsers(): Promise<User[]>;
    deleteUser(userId: string): Promise<void>;
}
//# sourceMappingURL=user.service.d.ts.map