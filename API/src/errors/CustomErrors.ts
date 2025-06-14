// export class ConfigError1 extends Error {
//   public readonly name: string = "ConfigError";
//   public readonly statusCode: number;
//   public readonly isOperational: boolean;
//   constructor(message: string, statusCode: number, isOperational: boolean) {
//     super(message);
//     // this.prototype = new.target.prototype;
//     // Main Proper Prototype Chain
//     Object.setPrototypeOf(this, new.target.prototype);
//     this.statusCode = statusCode;
//     this.isOperational = isOperational;
//     Error.captureStackTrace?.(this, this.constructor);
//   }
// }

// Stricter TS
export interface ConfigP {
  // name: any;
  message: string;
  statusCode: number;
  isOperational: boolean;
  stack?: string;
}

export class ConfigError extends Error implements ConfigP {
  public statusCode: number;
  public isOperational: boolean;
  constructor(
    message: string,
    statusCode: number = 5000,
    isOperational: boolean = true
  ) {
    super(message);
    this.name = "ConfigError";
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, new.target.prototype);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

// Without TS
// class ConfigErrorNode extends Error {
//   constructor(message) {
//     super(message);
//     this.name = "ConfigError";
//     this.statusCode = 500;
//     this.isOperational = true;
//     Error.captureStackTrace(this, this.constructor);
//   }
// }
