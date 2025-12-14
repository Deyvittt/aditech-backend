import { ServicioRepository } from "../domain/ServicioRepository";

export class GetAllEstadoServicioUseCase {
    constructor(readonly servicioRepository: ServicioRepository) {}

    async execute(): Promise<any[] | null> {
        try {
            const estados = await this.servicioRepository.getAllEstadoServicio();
            return estados;
        } catch (error) {
            console.error("Error en GetAllEstadoServicioUseCase", error);
            return null;
        }
    }
}