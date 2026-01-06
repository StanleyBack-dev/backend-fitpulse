import { CookieOptions } from 'express';

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

export const REFRESH_TOKEN_COOKIE_NAME = 'refreshToken';

export const REFRESH_TOKEN_COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: IS_PRODUCTION,
  sameSite: IS_PRODUCTION ? 'none' : 'lax',
  path: '/',
  maxAge: 30 * 24 * 60 * 60 * 1000,
};