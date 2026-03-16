import { ServicioRepository } from "../domain/ServicioRepository";

export class GetAllTiposEnvioUseCase {
    constructor(readonly servicioRepository: ServicioRepository) {}

    async execute(): Promise<any[] | null> {
        try {
            return await this.servicioRepository.getAllTiposEnvio();
        } catch (error) {
            console.error("Error en GetAllTiposEnvioUseCase", error);
            return null;
        }
    }
}