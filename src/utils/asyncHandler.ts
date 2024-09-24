import { Request, Response, NextFunction } from "express";

const asyncHandlerWithResponse = (fn: Function) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await fn(req, res, next);
        } catch (err) {
            const error = err as Error;
            res.status((error as any).statusCode || 500).json({
                success: false,
                message: error.message || "Internal Server Error"
            });
        }
    };
};

export { asyncHandlerWithResponse };
