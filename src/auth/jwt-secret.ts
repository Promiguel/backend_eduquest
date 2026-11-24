import { ConfigService } from '@nestjs/config';

export function getJwtSecret(configService: ConfigService): string {
  const secret = configService.getOrThrow<string>('JWT_SECRET').trim();
  if (secret.length < 64) {
    throw new Error('JWT_SECRET debe tener al menos 64 caracteres');
  }
  return secret;
}
