import { ServicioRepository } from "../domain/ServicioRepository";

export class GetAllUbicacionesUseCase {
    constructor(readonly servicioRepository: ServicioRepository) {}

    async execute(): Promise<any[] | null> {
        try {
            return await this.servicioRepository.getAllUbicaciones();
        } catch (error) {
            console.error("Error en GetAllUbicacionesUseCase", error);
            return null;
        }
    }
}