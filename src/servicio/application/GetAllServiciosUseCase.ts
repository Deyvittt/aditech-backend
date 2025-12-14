import { ServicioRepository } from "../domain/ServicioRepository";
import { Servicio } from "../domain/Servicio";

export class GetAllServiciosUseCase {
    constructor(readonly servicioRepository: ServicioRepository) {}

    // Debe aceptar user y estatus
    async execute(user: any, estatus: number | null): Promise<Servicio[] | null> {
        try {
            // Y pasarlos al repositorio
            return await this.servicioRepository.getServicios(user, estatus);
        } catch (error) {
            console.error("Error en GetAllServiciosUseCase", error);
            return null;
        }
    }
}