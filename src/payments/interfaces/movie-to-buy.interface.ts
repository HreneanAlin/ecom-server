import { Movie } from 'src/movies/entities/movie.entity';

export interface MovieToBuy {
  price: string;
  quantity: number;
  movie: Movie;
}
