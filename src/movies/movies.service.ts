import { Injectable } from '@nestjs/common';
import { CreateMovieInput } from './dto/create-movie.input';
import { UpdateMovieInput } from './dto/update-movie.input';
import { InjectModel } from '@nestjs/mongoose';
import { Movie, MovieDocument } from './entities/movie.entity';
import { Model } from 'mongoose';
import { CheckoutSession } from 'src/payments/entities/checkoutSession.entity';
import { stripe } from '../stripe';
@Injectable()
export class MoviesService {
  constructor(
    @InjectModel(Movie.name) private movieModel: Model<MovieDocument>,
  ) {}
  async create(createMovieInput: CreateMovieInput): Promise<Movie> {
    const product = await stripe.products.create({
      name: createMovieInput.title,
      description: createMovieInput.description,
    });
    const stripePrice = await stripe.prices.create({
      product: product.id,
      unit_amount: createMovieInput.price * 100,
      currency: 'usd',
    });
    console.log(product.id);
    const createdMovie = await this.movieModel.create({
      ...createMovieInput,
      stripePriceId: stripePrice.id,
      stripeProductId: product.id,
    });
    return createdMovie.save();
  }

  findAll(): Promise<Movie[]> {
    return this.movieModel.find().exec();
  }

  async findOne(id: string): Promise<Movie> {
    const res = await this.movieModel
      .findById(id)
      .populate({ path: 'checkoutSessions' })
      .exec();

    return res;
  }

  async update(id: string, updateMovieInput: UpdateMovieInput): Promise<Movie> {
    if (
      updateMovieInput.price ||
      updateMovieInput.title ||
      updateMovieInput.description
    ) {
      const movieToUpdate = await this.findOne(id);
      const movieProduct = await stripe.products.retrieve(
        movieToUpdate.stripeProductId,
      );
      if (updateMovieInput.title) {
        await stripe.products.update(movieToUpdate.stripeProductId, {
          name: movieToUpdate.title,
        });
      }
      if (updateMovieInput.description) {
        await stripe.products.update(movieToUpdate.stripeProductId, {
          description: movieToUpdate.description,
        });
      }
      if (updateMovieInput.price) {
        await stripe.prices.update(movieToUpdate.stripePriceId, {
          active: false,
        });
        const newPrice = await stripe.prices.create({
          product: movieProduct.id,
          unit_amount: updateMovieInput.price * 100,
          currency: 'usd',
        });

        await this.movieModel
          .findByIdAndUpdate(id, {
            ...updateMovieInput,
            stripePriceId: newPrice.id,
          })
          .exec();
        return this.findOne(id);
      }
    }
    await this.movieModel.findByIdAndUpdate(id, updateMovieInput).exec();
    return this.findOne(id);
  }

  async remove(id: string): Promise<Movie> {
    const movie = await this.findOne(id);
    await this.movieModel.deleteOne({ _id: id }).exec();
    return movie;
  }

  async addCheckoutToMovie(movieId: string, checkoutSession: CheckoutSession) {
    await this.movieModel
      .findByIdAndUpdate(movieId, {
        $addToSet: { checkoutSessions: [checkoutSession._id] },
      })
      .exec();
  }
}
