import { VersionContrato } from "../domain/entities/VersionContrato";
import { ContratoRepository } from "../domain/repositories/ContratoRepository";

export class GetVersionesByTipoContratoIdUseCase {
    constructor(private contratoRepository: ContratoRepository) {}

    async run(tipoContratoId:string): Promise<VersionContrato[]|null> {
        return this.contratoRepository.getVersionesByTipoContratoId(tipoContratoId);
    }
}