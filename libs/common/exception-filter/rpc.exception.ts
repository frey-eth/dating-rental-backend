import { Catch, ArgumentsHost, Logger } from '@nestjs/common';
import { BaseRpcExceptionFilter, RpcException } from '@nestjs/microservices';

/**
 * Exception filter for gRPC microservice servers.
 * Ensures all exceptions (including unhandled ones) are serialized as gRPC status
 * so that API gateway and other clients receive a proper code + message.
 */
@Catch()
export class AllRpcExceptionsFilter extends BaseRpcExceptionFilter {
  private readonly logger = new Logger(AllRpcExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    if (!(exception instanceof RpcException)) {
      const message =
        exception instanceof Error
          ? exception.message
          : 'Internal server error';
      this.logger.error(
        'Unhandled exception in RPC handler',
        exception instanceof Error ? exception : new Error(String(exception)),
      );
      return super.catch(new RpcException({ code: 13, message }), host);
    }
    return super.catch(exception, host);
  }
}
