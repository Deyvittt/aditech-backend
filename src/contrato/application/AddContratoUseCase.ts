import { Contrato } from "../domain/entities/Contrato";
import { ContratoRepository } from "../domain/repositories/ContratoRepository";

export class AddContratoUseCase {
    constructor(private contratoRepository: ContratoRepository) {}

    async run(contrato:Contrato):Promise<Contrato|null> {
        return this.contratoRepository.addContrato(contrato);
    }
}