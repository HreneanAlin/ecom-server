import { IJwtRefreshDto } from './jwt-refresh-payload.interface';

export interface IUserRefreshDTO extends IJwtRefreshDto {
  refreshToken: string;
}
