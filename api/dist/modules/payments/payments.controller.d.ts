import { PaymentsService } from "./payments.service";
export declare class PaymentsController {
    private readonly payments;
    constructor(payments: PaymentsService);
    list(): Promise<Record<string, unknown>[]>;
}
