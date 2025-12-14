import { EnlaceRepository } from "../domain/EnlaceRepository";
import { EnlaceDto } from "../domain/EnlaceDto";

export class GetAllEnlaceDetalladoUseCase {
    constructor(
        readonly enlaceRepository: EnlaceRepository,
    ) {}

    async run(): Promise<EnlaceDto[] | null> {
        return await this.enlaceRepository.getAllEnlaceDetallado();
    }
}