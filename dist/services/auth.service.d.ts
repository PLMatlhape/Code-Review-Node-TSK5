import { CreateUserDto, LoginDto, AuthResponse } from '../types/user.types';
export declare class AuthService {
    register(data: CreateUserDto): Promise<AuthResponse>;
    login(data: LoginDto): Promise<AuthResponse>;
}
//# sourceMappingURL=auth.service.d.ts.map