import { JwtRefreshDto } from './jwt-refresh-payload.dto';

export class UserRefreshDTO extends JwtRefreshDto {
  refreshToken: string;
}
