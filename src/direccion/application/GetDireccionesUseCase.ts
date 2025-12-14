import { Direccion } from "../domain/Direccion";
import { DireccionRepository } from "../domain/DireccionRepository";

export class GetDireccionesUseCase {
    constructor(private direccionRepository: DireccionRepository) {}

    async run(): Promise<Direccion[] | null> {
        return await this.direccionRepository.getDirecciones();
    }
}