export declare enum UserRole {
    SUBMITTER = "submitter",
    REVIEWER = "reviewer",
    ADMIN = "admin"
}
export interface User {
    id: string;
    email: string;
    name: string;
    display_picture?: string;
    role: UserRole;
    created_at: Date;
    updated_at: Date;
}
export interface CreateUserDto {
    email: string;
    password: string;
    name: string;
    role?: UserRole;
}
export interface UpdateUserDto {
    name?: string;
    display_picture?: string;
    email?: string;
}
export interface LoginDto {
    email: string;
    password: string;
}
export interface AuthResponse {
    user: Omit<User, 'password_hash'>;
    token: string;
}
//# sourceMappingURL=user.types.d.ts.map