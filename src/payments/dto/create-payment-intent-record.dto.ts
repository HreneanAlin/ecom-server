import { MovieDto } from './movie.dto';

export class CreatePaymentIntentRecordDto {
  stripeId: string;
  movies: MovieDto[];
  status: string;
}
