import {
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
  NotFoundException,
} from '@nestjs/common'
import { DomainError } from '../../../../src/domain/entities/domain-error'
import { GlobalExceptionFilter } from '../../../../src/presentation/http/filters/global-exception.filter'

type MockResponse = {
  status: jest.Mock
  json: jest.Mock
}

function createMockHost(path = '/api/test', method = 'GET') {
  const response: MockResponse = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  }

  const host = {
    switchToHttp: () => ({
      getResponse: () => response,
      getRequest: () => ({ url: path, method }),
    }),
  } as unknown as ArgumentsHost

  return { host, response }
}

describe('GlobalExceptionFilter', () => {
  const loggerSpy = jest.spyOn(Logger.prototype, 'error').mockImplementation(() => undefined)

  afterEach(() => {
    jest.clearAllMocks()
  })

  afterAll(() => {
    loggerSpy.mockRestore()
  })

  it('maps DomainError to 422', () => {
    const filter = new GlobalExceptionFilter()
    const { host, response } = createMockHost('/api/harvests', 'POST')

    filter.catch(new DomainError('Regra de domínio inválida'), host)

    expect(response.status).toHaveBeenCalledWith(HttpStatus.UNPROCESSABLE_ENTITY)
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        message: 'Regra de domínio inválida',
        error: 'DomainError',
        path: '/api/harvests',
      }),
    )
  })

  it('maps NotFoundException to 404', () => {
    const filter = new GlobalExceptionFilter()
    const { host, response } = createMockHost('/api/producers/1', 'GET')

    filter.catch(new NotFoundException('Não encontrado'), host)

    expect(response.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND)
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: HttpStatus.NOT_FOUND }),
    )
  })

  it('maps unknown errors to 500', () => {
    const filter = new GlobalExceptionFilter()
    const { host, response } = createMockHost('/api/dashboard', 'GET')

    filter.catch(new Error('Unexpected'), host)

    expect(response.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR)
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Unexpected',
      }),
    )
  })

  it('uses HttpException status code when provided', () => {
    const filter = new GlobalExceptionFilter()
    const { host, response } = createMockHost('/api/producers', 'POST')

    filter.catch(new HttpException('bad request', HttpStatus.BAD_REQUEST), host)

    expect(response.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST)
  })
})
