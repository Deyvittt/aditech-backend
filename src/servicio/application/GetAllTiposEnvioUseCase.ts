import { ServicioRepository } from "../domain/ServicioRepository";

export class GetAllTiposEnvioUseCase {
    constructor(readonly servicioRepository: ServicioRepository) {}

    async execute(): Promise<any[] | null> {
        try {
            // Asumiremos que crearemos una función en el repositorio para esto
            return await this.servicioRepository.getAllTiposEnvio();
        } catch (error) {
            console.error("Error en GetAllTiposEnvioUseCase", error);
            return null;
        }
    }
}