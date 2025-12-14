import { ContratoRepository } from "../domain/repositories/ContratoRepository";
import { Contrato } from "../domain/entities/Contrato";

export class UpdateContratoUseCase {
    constructor(private repository: ContratoRepository) {}

    async run(contratoId: string, updateData: any): Promise<Contrato | null> {
        return await this.repository.updateContrato(contratoId, updateData);
    }
}