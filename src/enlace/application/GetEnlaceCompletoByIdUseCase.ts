import { EnlaceCompletoDto } from "../domain/EnlaceCompletoDto";
import { EnlaceRepository } from "../domain/EnlaceRepository";

export class GetEnlaceCompletoByIdUseCase {
    constructor(private enlaceRepository: EnlaceRepository) {}

    async execute(enlaceId: number): Promise<EnlaceCompletoDto | null> {
        return this.enlaceRepository.getEnlaceCompletoById(enlaceId);
    }
}