import { NextFunction, Request, Response } from "express";

export const notFound = (
    req: Request,
    res: Response,
    _next: NextFunction
) => {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.originalUrl}`
    });
};

export const errorHandler = (
    err: any,
    _req: Request,
    res: Response,
    _next: NextFunction
) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal server error";

    if (statusCode >= 500) {
        console.error("UNHANDLED ERROR:", err);
    }

    res.status(statusCode).json({
        success: false,
        message
    });
};
