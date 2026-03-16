import { ServicioRepository } from "../domain/ServicioRepository";
import { Servicio } from "../domain/Servicio";

export class GetServicioParaFormularioUseCase {
    constructor(private readonly servicioRepository: ServicioRepository) {}

    async execute(id: string): Promise<Servicio | null> {
        return await this.servicioRepository.getServicioParaFormulario(id);
    }
}