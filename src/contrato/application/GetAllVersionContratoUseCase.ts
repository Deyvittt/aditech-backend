import { VersionContrato } from "../domain/entities/VersionContrato";
import { ContratoRepository } from "../domain/repositories/ContratoRepository";

export class GetAllVersionContratoUseCase {
    constructor(private versionContratoRepository: ContratoRepository) {}

    async run(): Promise<VersionContrato[]|null> {
        return this.versionContratoRepository.getAllVersionContrato();
    }
}