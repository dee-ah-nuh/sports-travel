export * from './flight.types.js';
export * from './event.types.js';
export * from './itinerary.types.js';
export * from './ticket.types.js';
export * from './user.types.js';

// Common API response wrappers
export type ApiResponse<T> = {
  data: T;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    cachedAt?: string;
  };
};

export type ApiError = {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
};
