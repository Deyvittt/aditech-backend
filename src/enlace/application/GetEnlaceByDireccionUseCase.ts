import { EnlaceRepository } from "../domain/EnlaceRepository";

export class GetEnlaceByDireccionUseCase {
    constructor(readonly enlaceRepository: EnlaceRepository) {}

    async execute(direccionId: number): Promise<any | null> {
        try {
            return await this.enlaceRepository.getEnlaceByDireccion(direccionId);
        } catch (error) {
            console.error("Error en GetEnlaceByDireccionUseCase", error);
            return null;
        }
    }
}