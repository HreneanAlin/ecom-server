import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, MaxLength, MinLength, Matches } from 'class-validator';
import { IsEmailUnique } from 'src/auth/decorators/is-email-unique.decorator';

@InputType()
export class CreateUser {
  @MinLength(2)
  @MaxLength(10)
  @Field()
  firstName: string;

  @MinLength(2)
  @MaxLength(10)
  @Field()
  lastName: string;

  @IsEmail()
  @IsEmailUnique()
  @Field()
  email: string;

  @MinLength(8)
  @MaxLength(50)
  @Matches(/(?=.*?[A-Z])/, {
    message: 'Password must contain at least one upper case letter',
  })
  @Matches(/(?=.*?[a-z])/, {
    message: 'Password must contain at least one lower case letter',
  })
  @Matches(/(?=.*?[0-9])/, {
    message: 'Password must contain at least one number',
  })
  @Matches(/(?=.*?[#?!@$%^&*-])/, {
    message: 'Password must contain at least one special character',
  })
  @Field()
  password: string;
}
