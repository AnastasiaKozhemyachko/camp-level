import { Injectable } from '@angular/core';
import { COPY } from '../constants/copy';

/**
 * Service for uniform error handling across the application
 */
@Injectable({ providedIn: 'root' })
export class ErrorService {
  /**
   * Converts unknown error to readable message
   */
  formatError(error: unknown): string {
    if (error instanceof Error && error.message) {
      return error.message;
    }

    if (typeof error === 'string') {
      return error;
    }

    return COPY.common.unknownError;
  }
}

