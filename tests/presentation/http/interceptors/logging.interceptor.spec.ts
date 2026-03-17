import { CallHandler, ExecutionContext, Logger } from '@nestjs/common'
import { of } from 'rxjs'
import { LoggingInterceptor } from '../../../../src/presentation/http/interceptors/logging.interceptor'

describe('LoggingInterceptor', () => {
  it('logs request start and finish', (done) => {
    const interceptor = new LoggingInterceptor()
    const logSpy = jest.spyOn(Logger.prototype, 'log').mockImplementation(() => undefined)

    const request = { method: 'GET', url: '/producers' }
    const response = { statusCode: 200 }

    const context = {
      switchToHttp: () => ({
        getRequest: () => request,
        getResponse: () => response,
      }),
    } as unknown as ExecutionContext

    const next = {
      handle: () => of('ok'),
    } as CallHandler

    interceptor.intercept(context, next).subscribe({
      complete: () => {
        expect(logSpy).toHaveBeenCalledTimes(2)
        expect(logSpy.mock.calls[0][0]).toContain('GET /producers started')
        expect(logSpy.mock.calls[1][0]).toContain('GET /producers 200')
        logSpy.mockRestore()
        done()
      },
    })
  })
})
