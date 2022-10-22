import { Injectable } from '@nestjs/common';
import { CreateMovieInput } from './dto/create-movie.input';
import { UpdateMovieInput } from './dto/update-movie.input';
import { InjectModel } from '@nestjs/mongoose';
import { Movie, MovieDocument } from './entities/movie.entity';
import { Model } from 'mongoose';

@Injectable()
export class MoviesService {
  constructor(
    @InjectModel(Movie.name) private movieModel: Model<MovieDocument>,
  ) {}
  async create(createMovieInput: CreateMovieInput): Promise<Movie> {
    const createdMovie = await this.movieModel.create(createMovieInput);
    return createdMovie.save();
  }

  findAll(): Promise<Movie[]> {
    return this.movieModel.find().exec();
  }

  findOne(id: string): Promise<Movie> {
    return this.movieModel.findById(id).exec();
  }

  async update(id: string, updateMovieInput: UpdateMovieInput): Promise<Movie> {
    await this.movieModel.findByIdAndUpdate(id, updateMovieInput);
    return this.findOne(id);
  }

  async remove(id: string): Promise<Movie> {
    const movie = await this.findOne(id);
    await this.movieModel.deleteOne({ _id: id });
    return movie;
  }
}
