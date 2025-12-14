import { Direccion } from "../domain/Direccion";
import { DireccionRepository } from "../domain/DireccionRepository";

export class GetDireccionesByDependenciaUseCase {
    constructor(private direccionRepository: DireccionRepository) {}

    async run(dependenciaId: number): Promise<Direccion[] | null> {
        return await this.direccionRepository.getDireccionesByDependencia(dependenciaId);
    }
}