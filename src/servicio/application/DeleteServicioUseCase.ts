import { ServicioRepository } from "../domain/ServicioRepository";

export class DeleteServicioUseCase {
    constructor(private readonly servicioRepository: ServicioRepository) {}

    async run(id: string): Promise<boolean> {
        return await this.servicioRepository.deleteServicio(id);
    }
}