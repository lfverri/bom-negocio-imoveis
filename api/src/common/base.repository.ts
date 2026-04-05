import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";

type Delegate = {
  findMany(args?: Record<string, unknown>): Promise<unknown[]>;
  findUnique(args: Record<string, unknown>): Promise<unknown | null>;
  create(args: Record<string, unknown>): Promise<unknown>;
  update(args: Record<string, unknown>): Promise<unknown>;
  delete(args: Record<string, unknown>): Promise<unknown>;
};

type CrudOptions = {
  idField?: string;
};

export class BaseRepository<T extends object> {
  constructor(
    protected readonly delegate: Delegate,
    private readonly options: CrudOptions = {},
  ) {}

  async findMany(args?: Record<string, unknown>): Promise<T[]> {
    return this.delegate.findMany(args) as Promise<T[]>;
  }

  async findById(id: string, args?: Record<string, unknown>): Promise<T> {
    const idField = this.options.idField ?? "id";
    const item = (await this.delegate.findUnique({
      where: { [idField]: id },
      ...(args ?? {}),
    })) as T | null;

    if (!item) {
      throw new NotFoundException("Record not found");
    }

    return item;
  }

  async create(data: Record<string, unknown>): Promise<T> {
    try {
      return (await this.delegate.create({ data })) as T;
    } catch (error) {
      this.rethrowPrismaError(error);
    }
  }

  async update(id: string, data: Record<string, unknown>): Promise<T> {
    const idField = this.options.idField ?? "id";

    try {
      return (await this.delegate.update({
        where: { [idField]: id },
        data,
      })) as T;
    } catch (error) {
      this.rethrowPrismaError(error);
    }
  }

  async delete(id: string): Promise<T> {
    const idField = this.options.idField ?? "id";

    try {
      return (await this.delegate.delete({ where: { [idField]: id } })) as T;
    } catch (error) {
      this.rethrowPrismaError(error);
    }
  }

  protected rethrowPrismaError(error: unknown): never {
    const code = (error as { code?: string })?.code;

    if (code === "P2002") {
      throw new ConflictException("Record already exists");
    }

    if (code === "P2025") {
      throw new NotFoundException("Record not found");
    }

    throw new InternalServerErrorException("Database operation failed");
  }
}
