import { Injectable } from "@nestjs/common";

export type User = { id: string; email: string; role: string };

@Injectable()
export class UsersRepository {
  private readonly users: User[] = [];

  findMany() {
    return this.users;
  }
}
