import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

/**
 * gRPC status codes (from @grpc/grpc-js)
 * @see https://grpc.io/grpc/core/md_doc_statuscodes.html
 */
const GRPC_TO_HTTP: Record<number, number> = {
  0: HttpStatus.OK,
  1: HttpStatus.REQUEST_TIMEOUT, // CANCELLED
  2: HttpStatus.INTERNAL_SERVER_ERROR, // UNKNOWN
  3: HttpStatus.BAD_REQUEST, // INVALID_ARGUMENT
  4: HttpStatus.GATEWAY_TIMEOUT, // DEADLINE_EXCEEDED
  5: HttpStatus.NOT_FOUND, // NOT_FOUND
  6: HttpStatus.CONFLICT, // ALREADY_EXISTS
  7: HttpStatus.FORBIDDEN, // PERMISSION_DENIED
  8: HttpStatus.TOO_MANY_REQUESTS, // RESOURCE_EXHAUSTED
  9: HttpStatus.BAD_REQUEST, // FAILED_PRECONDITION
  10: HttpStatus.CONFLICT, // ABORTED
  11: HttpStatus.BAD_REQUEST, // OUT_OF_RANGE
  12: HttpStatus.NOT_IMPLEMENTED, // UNIMPLEMENTED
  13: HttpStatus.INTERNAL_SERVER_ERROR, // INTERNAL
  14: HttpStatus.SERVICE_UNAVAILABLE, // UNAVAILABLE
  15: HttpStatus.INTERNAL_SERVER_ERROR, // DATA_LOSS
  16: HttpStatus.UNAUTHORIZED, // UNAUTHENTICATED
};

export interface GrpcErrorLike {
  code?: number;
  details?: string;
  message?: string;
}

/**
 * Extracts gRPC status code and message from an error thrown by a gRPC client
 * (e.g. when a microservice throws RpcException).
 */
function parseGrpcError(
  exception: unknown,
): { code: number; message: string } | null {
  if (!exception || typeof exception !== 'object') return null;

  const err = exception as GrpcErrorLike;

  // Standard grpc-js error: { code: number, details: string }
  if (typeof err.code === 'number') {
    return {
      code: err.code,
      message: err.details ?? err.message ?? 'Request failed',
    };
  }

  // Fallback: parse message like "5 NOT_FOUND: User not found"
  if (typeof err.message === 'string') {
    const match = err.message.match(/^(\d+)\s+\w+:\s*(.*)$/s);
    if (match) {
      return {
        code: parseInt(match[1], 10),
        message: match[2].trim() || err.message,
      };
    }
    return {
      code: 2, // UNKNOWN
      message: err.message,
    };
  }

  return null;
}

/**
 * Exception filter for the API Gateway (HTTP app).
 * Catches errors from gRPC client calls (firstValueFrom) and maps gRPC status
 * codes to HTTP status codes and a consistent JSON error response.
 */
@Catch()
export class GrpcToHttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GrpcToHttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // NestJS HTTP exceptions: pass through and send their response
    if (
      exception &&
      typeof exception === 'object' &&
      'getStatus' in exception &&
      typeof (exception as { getStatus: () => number }).getStatus === 'function'
    ) {
      const httpException = exception as {
        getStatus: () => number;
        getResponse: () => string | object;
      };
      const status = httpException.getStatus();
      const body =
        typeof httpException.getResponse === 'function'
          ? httpException.getResponse()
          : { message: 'Unknown error' };
      response.status(status).json(body);
      return;
    }

    const grpc = parseGrpcError(exception);
    if (grpc) {
      const httpStatus =
        GRPC_TO_HTTP[grpc.code] ?? HttpStatus.INTERNAL_SERVER_ERROR;
      this.logger.debug(
        `gRPC error code=${grpc.code} -> HTTP ${httpStatus}: ${grpc.message}`,
      );
      response.status(httpStatus).json({
        statusCode: httpStatus,
        message: grpc.message,
        error: HttpStatus[httpStatus] ?? 'Internal Server Error',
      });
      return;
    }

    // Unknown errors -> 500
    const message =
      exception instanceof Error ? exception.message : 'Internal server error';
    this.logger.error(
      'Unhandled exception',
      exception instanceof Error ? exception : new Error(String(exception)),
    );
    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message,
      error: 'Internal Server Error',
    });
  }
}
