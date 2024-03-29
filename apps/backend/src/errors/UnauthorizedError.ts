import { CustomError } from './CustomError';

class UnauthorizedError extends CustomError {
  private static readonly _statusCode = 401;
  private readonly _code: number;
  private readonly _logging: boolean;
  private readonly _context: { [key: string]: unknown };

  constructor(params?: {
    code?: number;
    message?: string;
    logging?: boolean;
    context?: { [key: string]: unknown };
  }) {
    const { code, message, logging } = params || {};

    super(message || 'Unauthorized');
    this._code = code || UnauthorizedError._statusCode;
    this._logging = logging || false;
    this._context = params?.context || {};

    // Only because extending a built in class
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }

  get errors() {
    return [{ message: this.message, context: this._context }];
  }

  get statusCode() {
    return this._code;
  }

  get logging() {
    return this._logging;
  }
}

export default UnauthorizedError;
