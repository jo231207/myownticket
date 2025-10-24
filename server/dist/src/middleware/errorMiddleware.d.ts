import { NextFunction, Request, Response } from 'express';
type ErrorWithStatus = Error & {
    statusCode?: number;
    status?: number;
    details?: unknown;
};
export declare const notFoundHandler: (req: Request, _res: Response, next: NextFunction) => void;
export declare const errorHandler: (err: ErrorWithStatus, _req: Request, res: Response, _next: NextFunction) => void;
export {};
//# sourceMappingURL=errorMiddleware.d.ts.map