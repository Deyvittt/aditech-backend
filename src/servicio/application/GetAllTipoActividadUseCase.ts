import { ServicioRepository } from "../domain/ServicioRepository";

export class GetAllTipoActividadUseCase {
    constructor(readonly servicioRepository: ServicioRepository) {}

    async execute(): Promise<any[] | null> {
        try {
            const tipos = await this.servicioRepository.getAllTipoActividad();
            return tipos;
        } catch (error) {
            console.error("Error en GetAllTipoActividadUseCase", error);
            return null;
        }
    }
}