export type CustomErrorContent = {
  message: string;
  context?: { [key: string]: unknown };
};

// Create abstract class as immutable archetype for all future error types
export abstract class CustomError extends Error {
  abstract readonly statusCode: number;
  abstract readonly errors: CustomErrorContent[];
  abstract readonly logging: boolean;

  constructor(message: string) {
    super(message);

    // Only because extending a built in class
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}
