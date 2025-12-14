import { Contrato } from "../domain/entities/Contrato";
import { ContratoRepository } from "../domain/repositories/ContratoRepository";

export class GetContratosByEnlaceUseCase {
    constructor(private contratoRepository: ContratoRepository) {}

    async run (enlaceId:string): Promise<Contrato[]|null> {
        return this.contratoRepository.getContratosByEnlace(enlaceId);
    }
}