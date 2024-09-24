export class ApiResponse<T = any> {
    public data: T | null;
    public statusCode: number;
    public success: boolean;
    public message: string;

    constructor(statusCode: number, data: T | null = null, message: string = "Success") {
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = statusCode < 400;
    }
}
