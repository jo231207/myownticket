export declare class AppError extends Error {
    readonly statusCode: number;
    readonly details?: unknown;
    readonly isOperational: boolean;
    constructor(message: string, statusCode?: number, details?: unknown, isOperational?: boolean);
}
//# sourceMappingURL=appError.d.ts.map