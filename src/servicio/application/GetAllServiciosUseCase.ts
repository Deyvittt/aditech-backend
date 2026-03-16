import { ServicioRepository } from "../domain/ServicioRepository";
import { Servicio } from "../domain/Servicio";

export class GetAllServiciosUseCase {
    constructor(readonly servicioRepository: ServicioRepository) {}

    async execute(user: any, estatus: number | null): Promise<Servicio[] | null> {
        try {
            return await this.servicioRepository.getServicios(user, estatus);
        } catch (error) {
            console.error("Error en GetAllServiciosUseCase", error);
            return null;
        }
    }
}