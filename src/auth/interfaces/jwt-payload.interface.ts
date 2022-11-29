export interface IJwtPayload {
  sub: string;
  email: string;
  exp: number;
  iat: number;
}
