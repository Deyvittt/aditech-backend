import { Enlace } from "../domain/Enlace";
import { EnlaceRepository } from "../domain/EnlaceRepository";

export class AddEnlaceUseCase {
    constructor(readonly enlaceRepository: EnlaceRepository) {}

    async execute(enlace: Enlace): Promise<Enlace | null> {
        // Simplemente pasa el objeto (con sus 12 propiedades) al repositorio
        return await this.enlaceRepository.addEnlace(enlace);
    }
}