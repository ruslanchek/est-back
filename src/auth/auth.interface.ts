export interface IJwtPayload {
  id: number;
  email: string;
}

export interface ITokenPayload {
  expiresIn: number;
  accessToken: string;
}