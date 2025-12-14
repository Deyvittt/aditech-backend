import { ContratoRepository } from "../domain/repositories/ContratoRepository";

export class DeleteContratoUseCase {
    constructor(private repository: ContratoRepository) {}

    async run(contratoId: string): Promise<boolean> {
        return await this.repository.deleteContrato(contratoId);
    }
}