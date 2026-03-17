import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
  NotFoundException,
} from '@nestjs/common'
import { Request, Response } from 'express'
import { DomainError } from '../../../domain/entities/domain-error'

type ErrorResponse = {
  statusCode: number
  message: string
  error: string
  timestamp: string
  path: string
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name)

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()

    const statusCode = this.resolveStatusCode(exception)
    const message = this.resolveMessage(exception)
    const error = this.resolveErrorLabel(exception, statusCode)

    const payload: ErrorResponse = {
      statusCode,
      message,
      error,
      timestamp: new Date().toISOString(),
      path: request.url,
    }

    const stack = exception instanceof Error ? exception.stack : undefined
    this.logger.error(`${request.method} ${request.url} -> ${statusCode} ${message}`, stack)

    response.status(statusCode).json(payload)
  }

  private resolveStatusCode(exception: unknown): number {
    if (exception instanceof DomainError) return HttpStatus.UNPROCESSABLE_ENTITY
    if (exception instanceof NotFoundException) return HttpStatus.NOT_FOUND
    if (exception instanceof HttpException) return exception.getStatus()
    return HttpStatus.INTERNAL_SERVER_ERROR
  }

  private resolveMessage(exception: unknown): string {
    if (exception instanceof DomainError) return exception.message
    if (exception instanceof HttpException) {
      const response = exception.getResponse()

      if (typeof response === 'string') return response
      if (typeof response === 'object' && response !== null) {
        const responseMessage = (response as { message?: string | string[] }).message
        if (Array.isArray(responseMessage)) return responseMessage.join(', ')
        if (responseMessage) return responseMessage
      }

      return exception.message
    }
    if (exception instanceof Error) return exception.message
    return 'Erro interno do servidor'
  }

  private resolveErrorLabel(exception: unknown, statusCode: number): string {
    if (exception instanceof DomainError) return DomainError.name
    if (exception instanceof HttpException) {
      const response = exception.getResponse()
      if (typeof response === 'object' && response !== null) {
        const responseError = (response as { error?: string }).error
        if (responseError) return responseError
      }
      return exception.name
    }
    if (statusCode === HttpStatus.INTERNAL_SERVER_ERROR) return 'InternalServerError'
    return 'Error'
  }
}
