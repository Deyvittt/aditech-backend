import { Enlace } from "../domain/Enlace";
import { EnlaceRepository } from "../domain/EnlaceRepository";

export class GetEnlaceByIdUseCase {
    constructor(private repository: EnlaceRepository) {}

    async run(id: string): Promise<Enlace | null> {
        return await this.repository.getEnlaceById(id);
    }
}