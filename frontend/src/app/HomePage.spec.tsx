import Home from './page'

const mockRedirect = jest.fn(() => {
  throw new Error('redirect-called')
})

jest.mock('next/navigation', () => ({
  redirect: (path: string) => mockRedirect(),
}))

describe('Home page redirect', () => {
  it('redireciona para /dashboard', () => {
    expect(() => Home()).toThrow('redirect-called')
    expect(mockRedirect).toHaveBeenCalledWith('/dashboard')
  })
})
