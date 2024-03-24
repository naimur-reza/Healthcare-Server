class GenericError extends Error {
  statusCode: number;
  message: string;
  stack?: string | undefined;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default GenericError;
