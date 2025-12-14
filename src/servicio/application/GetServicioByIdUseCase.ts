import { ServicioRepository } from "../domain/ServicioRepository";
import { Servicio } from "../domain/Servicio";

export class GetServicioByIdUseCase {
    constructor(readonly servicioRepository: ServicioRepository) {}

    async execute(id: number): Promise<Servicio | null> {
        try {
            const servicio = await this.servicioRepository.getServicioById(id);
            return servicio;
        } catch (error) {
            console.error("Error en GetServicioByIdUseCase", error);
            return null;
        }
    }
}