import { BadRequestException } from '@nestjs/common'
import { ParseUuidPipe } from '../../../../src/presentation/http/pipes/parse-uuid.pipe'

describe('ParseUuidPipe', () => {
  const pipe = new ParseUuidPipe()

  it('accepts a valid UUID v4', () => {
    const value = '550e8400-e29b-41d4-a716-446655440000'
    expect(pipe.transform(value)).toBe(value)
  })

  it('rejects an invalid UUID', () => {
    expect(() => pipe.transform('invalid-id')).toThrow(BadRequestException)
  })

  it('rejects UUID that is not version 4', () => {
    expect(() => pipe.transform('550e8400-e29b-11d4-a716-446655440000')).toThrow(
      BadRequestException,
    )
  })
})
