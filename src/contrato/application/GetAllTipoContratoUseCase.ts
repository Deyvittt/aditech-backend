import { IctiTipos } from "../../shared/domain/interfaces/IctiTipos";
import { ContratoRepository } from "../domain/repositories/ContratoRepository";

export class GetAllTipoContratoUseCase {
    constructor(private tipoContratoRepository: ContratoRepository) {}

    async run(): Promise<IctiTipos[]|null> {
        return this.tipoContratoRepository.getAllTipoContrato();
    }
}