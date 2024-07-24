class CustomError extends Error {
  // Next.js is censoring error message in production, but not digest
  // by overwriting digest, and manually setting it, can force it to pass to error.tsx
  private readonly _digest: string;

  constructor(params: { message: string; digest: string }) {
    const { message, digest } = params;

    super(message);
    this._digest = digest;

    // Only because extending a built in class
    Object.setPrototypeOf(this, CustomError.prototype);
  }

  get digest() {
    return this._digest;
  }
}

export default CustomError;
