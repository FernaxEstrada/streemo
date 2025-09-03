function getEnvVar(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`la variable de entorno ${key} no está definida`);
  }
  return value;
}

export const env = {
  JWT_SECRET: getEnvVar("JWT_SECRET"),
  DB_USER: getEnvVar("DB_USER"),
  DB_PASSWORD: getEnvVar("DB_PASSWORD"),
  DB_HOST: getEnvVar("DB_HOST"),
  DB_PORT: Number(getEnvVar("DB_PORT")),
  DB_NAME: getEnvVar("DB_NAME"),
};
