function getRequiredEnv(key: string): string {
  const value = process.env[key]
  if (!value) {
    throw new Error(`la variable de entorno ${key} no está definida`)
  }
  return value
}

// Usar getters para evitar evaluar en tiempo de build (Vercel "collecting page data")
export const env = {
  get JWT_SECRET() {
    return getRequiredEnv("JWT_SECRET")
  },
  get DB_USER() {
    return getRequiredEnv("DB_USER")
  },
  get DB_PASSWORD() {
    return getRequiredEnv("DB_PASSWORD")
  },
  get DB_HOST() {
    return getRequiredEnv("DB_HOST")
  },
  get DB_PORT() {
    return Number(getRequiredEnv("DB_PORT"))
  },
  get DB_NAME() {
    return getRequiredEnv("DB_NAME")
  },
}
