import { MovieDto } from './movie.dto';

export class CreateCheckoutSessionDto {
  stripeSessionId: string;

  url: string;

  movies: MovieDto[];

  status: string;
}
