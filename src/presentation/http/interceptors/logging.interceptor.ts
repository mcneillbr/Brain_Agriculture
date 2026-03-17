import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP')

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const now = Date.now()
    const http = context.switchToHttp()
    const request = http.getRequest<{ method: string; originalUrl?: string; url: string }>()
    const response = http.getResponse<{ statusCode: number }>()
    const url = request.originalUrl ?? request.url

    this.logger.log(`${request.method} ${url} started`)

    return next.handle().pipe(
      tap(() => {
        const elapsedMs = Date.now() - now
        this.logger.log(`${request.method} ${url} ${response.statusCode} ${elapsedMs}ms`)
      }),
    )
  }
}
