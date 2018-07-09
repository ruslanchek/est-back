export interface IJwtPayload {
  id: number;
}

export interface ITokenPayload {
  expiresIn: number;
  accessToken: string;
}
