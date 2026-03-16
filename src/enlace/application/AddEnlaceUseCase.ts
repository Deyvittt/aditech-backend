import { Enlace } from "../domain/Enlace";
import { EnlaceRepository } from "../domain/EnlaceRepository";

export class AddEnlaceUseCase {
    constructor(readonly enlaceRepository: EnlaceRepository) {}

    async execute(enlace: Enlace): Promise<Enlace | null> {
        return await this.enlaceRepository.addEnlace(enlace);
    }
}