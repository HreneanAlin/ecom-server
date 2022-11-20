import { SetMetadata } from '@nestjs/common';
import { PUBLIC_ROUTERS_KEY } from '../helpers/constants';

export const Public = () => SetMetadata(PUBLIC_ROUTERS_KEY, true);
