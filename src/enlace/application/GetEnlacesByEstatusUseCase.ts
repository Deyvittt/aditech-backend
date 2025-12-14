import { Enlace } from "../domain/Enlace";
import { EnlaceRepository } from "../domain/EnlaceRepository";

export class GetEnlacesByEstatusUseCase {
    constructor(private repository: EnlaceRepository) {}

    async run(estatus: number): Promise<Enlace[] | null> {
        return await this.repository.getEnlacesByEstatus(estatus);
    }
}