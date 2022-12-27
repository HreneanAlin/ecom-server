import { Injectable } from '@nestjs/common';
import { CreateMovieInput } from './inputs/create-movie.input';
import { UpdateMovieInput } from './inputs/update-movie.input';
import { InjectModel } from '@nestjs/mongoose';
import { Movie, MovieDocument } from './entities/movie.entity';
import { Model } from 'mongoose';
import { CheckoutSession } from 'src/payments/entities/checkout-session.entity';
import { StripeService } from 'src/stripe/stripe.service';
@Injectable()
export class MoviesService {
  constructor(
    @InjectModel(Movie.name) private movieModel: Model<MovieDocument>,
    private readonly stripeService: StripeService,
  ) {}
  async create(createMovieInput: CreateMovieInput): Promise<Movie> {
    const product = await this.stripeService.createProductForMovie(
      createMovieInput.title,
      createMovieInput.description,
    );
    const stripePrice = await this.stripeService.createPrice(
      product.id,
      createMovieInput.price,
    );
    return this.movieModel.create({
      ...createMovieInput,
      stripePriceId: stripePrice.id,
      stripeProductId: product.id,
    });
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
      const movieProduct = await this.stripeService.findProduct(
        movieToUpdate.stripeProductId,
      );
      if (updateMovieInput.title) {
        await this.stripeService.updateProduct(movieToUpdate.stripeProductId, {
          name: movieToUpdate.title,
        });
      }
      if (updateMovieInput.description) {
        await this.stripeService.updateProduct(movieToUpdate.stripeProductId, {
          description: movieToUpdate.description,
        });
      }
      if (updateMovieInput.price) {
        await this.stripeService.updatePrice(movieToUpdate.stripePriceId, {
          active: false,
        });
        const newPrice = await this.stripeService.createPrice(
          movieProduct.id,
          updateMovieInput.price,
        );

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
