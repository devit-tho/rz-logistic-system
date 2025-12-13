import { Driver, UserWithoutPassword } from '@monorepo/entities';

declare module 'express' {
  export interface Request {
    user: UserWithoutPassword;
    token: string;
    driver: Driver;
  }
}
