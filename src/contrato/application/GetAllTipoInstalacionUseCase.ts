import { IctiTipos } from "../../shared/domain/interfaces/IctiTipos";
import { ContratoRepository } from "../domain/repositories/ContratoRepository";

export class GetAllTipoInstalacionUseCase {
    constructor(private tipoInstalacionRepository: ContratoRepository) {}

    async run(): Promise<IctiTipos[]|null> {
        return this.tipoInstalacionRepository.getAllTipoInstalacion();
    }
}