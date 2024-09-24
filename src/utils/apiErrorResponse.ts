export class ApiError extends Error {
    public data: string | null;
    public statusCode: number;
    public success: boolean;
    public errors: string[];

    constructor(
        statusCode: number = 500,
        message: string = "Something went wrong",
        errors: string[] = [],
        stack?: string
    ) {
        super(message); // Call the base class constructor with the message
        this.statusCode = statusCode;
        this.data = null;
        this.success = false;
        this.errors = errors;

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
