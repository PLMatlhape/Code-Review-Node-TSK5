export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}
export interface PaginationQuery {
    page?: number;
    limit?: number;
}
export interface PaginatedResponse<T> {
    success: boolean;
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}
export interface QueryOptions {
    orderBy?: string;
    order?: 'ASC' | 'DESC';
    limit?: number;
    offset?: number;
}
//# sourceMappingURL=common.types.d.ts.map