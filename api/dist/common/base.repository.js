"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRepository = void 0;
const common_1 = require("@nestjs/common");
class BaseRepository {
    delegate;
    options;
    constructor(delegate, options = {}) {
        this.delegate = delegate;
        this.options = options;
    }
    async findMany(args) {
        return this.delegate.findMany(args);
    }
    async findById(id, args) {
        const idField = this.options.idField ?? "id";
        const item = (await this.delegate.findUnique({
            where: { [idField]: id },
            ...(args ?? {}),
        }));
        if (!item) {
            throw new common_1.NotFoundException("Record not found");
        }
        return item;
    }
    async create(data) {
        try {
            return (await this.delegate.create({ data }));
        }
        catch (error) {
            this.rethrowPrismaError(error);
        }
    }
    async update(id, data) {
        const idField = this.options.idField ?? "id";
        try {
            return (await this.delegate.update({
                where: { [idField]: id },
                data,
            }));
        }
        catch (error) {
            this.rethrowPrismaError(error);
        }
    }
    async delete(id) {
        const idField = this.options.idField ?? "id";
        try {
            return (await this.delegate.delete({ where: { [idField]: id } }));
        }
        catch (error) {
            this.rethrowPrismaError(error);
        }
    }
    rethrowPrismaError(error) {
        const code = error?.code;
        if (code === "P2002") {
            throw new common_1.ConflictException("Record already exists");
        }
        if (code === "P2025") {
            throw new common_1.NotFoundException("Record not found");
        }
        throw new common_1.InternalServerErrorException("Database operation failed");
    }
}
exports.BaseRepository = BaseRepository;
//# sourceMappingURL=base.repository.js.map