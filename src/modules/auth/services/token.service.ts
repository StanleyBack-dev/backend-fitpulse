import * as jwt from 'jsonwebtoken';
import { Secret, SignOptions } from 'jsonwebtoken';

export class TokenService {
  private readonly jwtSecret: Secret = process.env.JWT_SECRET!;
  private readonly jwtRefreshSecret: Secret = process.env.JWT_REFRESH_SECRET!;

  generateAccessToken(payload: Record<string, any>): string {
    const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

    const options: SignOptions = {
      expiresIn: expiresIn as unknown as SignOptions['expiresIn'],
    };

    return jwt.sign(payload, this.jwtSecret, options);
  }

  generateRefreshToken(payload: Record<string, any>): string {
    const expiresIn = process.env.JWT_REFRESH_EXPIRES_IN || '30d';

    const options: SignOptions = {
      expiresIn: expiresIn as unknown as SignOptions['expiresIn'],
    };

    return jwt.sign(payload, this.jwtRefreshSecret, options);
  }

  verifyRefreshToken(token: string): any {
    return jwt.verify(token, this.jwtRefreshSecret);
  }

  verifyAccessToken(token: string): any {
    return jwt.verify(token, this.jwtSecret);
  }
}