import { Enlace } from "../domain/Enlace";
import { EnlaceRepository } from "../domain/EnlaceRepository";

export class GetEnlacesUseCase {
    constructor(private repository: EnlaceRepository) {}

    async run(): Promise<Enlace[] | null> {
        return await this.repository.getEnlaces();
    }
}