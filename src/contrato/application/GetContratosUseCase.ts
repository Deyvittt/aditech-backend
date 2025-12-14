import { Contrato } from "../domain/entities/Contrato";
import { ContratoRepository } from "../domain/repositories/ContratoRepository";

export class GetContratosUseCase{
    constructor(private contratoRepository: ContratoRepository) {}

    async run(user:any): Promise<Contrato[]|null> {
        return this.contratoRepository.getContratos(user);
    }
}