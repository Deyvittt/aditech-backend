import { ServicioRepository } from "../domain/ServicioRepository";

export class GetAllTipoServicioUseCase {
    constructor(readonly servicioRepository: ServicioRepository) {}

    async execute(): Promise<any[] | null> {
        try {
            const tipos = await this.servicioRepository.getAllTipoServicio();
            return tipos;
        } catch (error) {
            console.error("Error en GetAllTipoServicioUseCase", error);
            return null;
        }
    }
}