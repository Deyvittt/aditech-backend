import { Servicio } from "../domain/Servicio";
import { ServicioRepository } from "../domain/ServicioRepository";

export class AddServicioUseCase {
    constructor(readonly servicioRepository: ServicioRepository) {}

    async execute(servicio: any): Promise<Servicio | null> {
        // DEBUG: Para que veas que aquí SÍ llega el departamentoId
        console.log("--> AddServicioUseCase recibiendo:", servicio);

        try {
            const nuevoServicio = await this.servicioRepository.addServicio(servicio);
            
            return nuevoServicio;

        } catch (error) {
            console.error("Error en AddServicioUseCase:", error);
            return null;
        }
    }
}