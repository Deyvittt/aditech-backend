import { ServicioRepository } from "../domain/ServicioRepository";
import { Servicio } from "../domain/Servicio";

export class UpdateServicioUseCase {
    constructor(readonly servicioRepository: ServicioRepository) {}

    async execute(id: string, data: Partial<Servicio>): Promise<Servicio | null> {
        try {
            const servicioActualizado = await this.servicioRepository.updateServicio(id, data);
            return servicioActualizado;
        } catch (error) {
            console.error("Error en UpdateServicioUseCase", error);
            return null;
        }
    }
}