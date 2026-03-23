import { PaymentsRepository } from "./payments.repository";
export declare class PaymentsService {
    private readonly repo;
    constructor(repo: PaymentsRepository);
    list(): never[];
}
