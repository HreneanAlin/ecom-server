import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';
import { UsersService } from 'src/auth/users.service';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsEmailUniqueValidatorConstraint
  implements ValidatorConstraintInterface
{
  constructor(private readonly userService: UsersService) {}
  async validate(
    email: string,
    validationArguments?: ValidationArguments,
  ): Promise<boolean> {
    console.log('hey');
    const user = await this.userService.findOneByEmail(email);

    return !user;
  }
  defaultMessage?(validationArguments?: ValidationArguments): string {
    return 'Email already taken';
  }
}

export const IsEmailUnique = (validationOptions?: ValidationOptions) => {
  return (object: any, propertyName: string) => {
    registerDecorator({
      name: 'IsUnique',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsEmailUniqueValidatorConstraint,
    });
  };
};
