import { GetUser } from '@/decorators';
import { UseAdmin } from '@/guards/admin.guard';
import { ZodValidationPipe } from '@/pipes/zod-validation.pipe';
import { UserWithoutPassword } from '@monorepo/entities';
import {
  changePasswordSchema,
  ChangePasswordSchema,
  changeUserEmailSchema,
  ChangeUserEmailSchema,
  createUserSchema,
  CreateUserSchema,
  resetPasswordSchema,
  ResetPasswordSchema,
  updateUserSchema,
  UpdateUserSchema,
  UserSearchSchema,
  userSearchSchema,
} from '@monorepo/schemas';
import { Body, Controller, Get, Patch, Post, Query } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('search')
  @UseAdmin()
  async search(
    @Query(new ZodValidationPipe(userSearchSchema)) query: UserSearchSchema,
  ) {
    return this.userService.search(query);
  }

  // @Get('all')
  // @UseAdmin()
  // async getAll() {
  //   return this.userService.getAll();
  // }

  @Post('create')
  @UseAdmin()
  async create(
    @Body(new ZodValidationPipe(createUserSchema)) data: CreateUserSchema,
  ) {
    return this.userService.create(data);
  }

  @Patch('update')
  async update(
    @GetUser() user: UserWithoutPassword,
    @Body(new ZodValidationPipe(updateUserSchema)) data: UpdateUserSchema,
  ) {
    return this.userService.update(user, data);
  }

  @Patch('change-user-email')
  @UseAdmin()
  async changeUserEmail(
    @GetUser() user: UserWithoutPassword,
    @Body(new ZodValidationPipe(changeUserEmailSchema))
    data: ChangeUserEmailSchema,
  ) {
    return this.userService.changeUserEmail(user, data);
  }

  @Patch('change-password')
  async changePassword(
    @GetUser() user: UserWithoutPassword,
    @Body(new ZodValidationPipe(changePasswordSchema))
    data: ChangePasswordSchema,
  ) {
    return this.userService.changePassword(user, data);
  }

  @Patch('reset-password')
  async resetPassword(
    @GetUser() user: UserWithoutPassword,
    @Body(new ZodValidationPipe(resetPasswordSchema)) data: ResetPasswordSchema,
  ) {
    return this.userService.resetPassword(user, data);
  }
}
