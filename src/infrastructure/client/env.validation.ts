type EnvironmentSource = Record<string, unknown>

export interface EnvironmentVariables {
  PORT: number
  NODE_ENV: 'development' | 'test' | 'production'
  DB_HOST: string
  DB_PORT: number
  DB_USER: string
  DB_PASS: string
  DB_NAME: string
  DB_SSL: boolean
}

function readString(source: EnvironmentSource, key: keyof EnvironmentVariables): string {
  const value = source[key]

  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`Variavel de ambiente obrigatoria ausente ou vazia: ${key}`)
  }

  return value.trim()
}

function readNumber(source: EnvironmentSource, key: keyof EnvironmentVariables): number {
  const rawValue = readString(source, key)
  const value = Number(rawValue)

  if (!Number.isFinite(value)) {
    throw new Error(`Variavel de ambiente invalida: ${key} deve ser numerica`)
  }

  return value
}

function readBoolean(source: EnvironmentSource, key: keyof EnvironmentVariables): boolean {
  const rawValue = readString(source, key).toLowerCase()

  if (rawValue !== 'true' && rawValue !== 'false') {
    throw new Error(`Variavel de ambiente invalida: ${key} deve ser true ou false`)
  }

  return rawValue === 'true'
}

export function validateEnvironmentVariables(source: EnvironmentSource): EnvironmentVariables {
  const nodeEnv = readString(source, 'NODE_ENV')

  if (!['development', 'test', 'production'].includes(nodeEnv)) {
    throw new Error('Variavel de ambiente invalida: NODE_ENV deve ser development, test ou production')
  }

  const env: EnvironmentVariables = {
    PORT: readNumber(source, 'PORT'),
    NODE_ENV: nodeEnv as EnvironmentVariables['NODE_ENV'],
    DB_HOST: readString(source, 'DB_HOST'),
    DB_PORT: readNumber(source, 'DB_PORT'),
    DB_USER: readString(source, 'DB_USER'),
    DB_PASS: readString(source, 'DB_PASS'),
    DB_NAME: readString(source, 'DB_NAME'),
    DB_SSL: readBoolean(source, 'DB_SSL'),
  }

  if (env.PORT <= 0) {
    throw new Error('Variavel de ambiente invalida: PORT deve ser maior que zero')
  }

  if (env.DB_PORT <= 0) {
    throw new Error('Variavel de ambiente invalida: DB_PORT deve ser maior que zero')
  }

  return env
}