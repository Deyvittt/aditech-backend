// Nuevo archivo: src/servicio/application/GetServicioParaFormularioUseCase.ts

import { ServicioRepository } from "../domain/ServicioRepository";
import { Servicio } from "../domain/Servicio";

export class GetServicioParaFormularioUseCase {
    constructor(private readonly servicioRepository: ServicioRepository) {}

    async execute(id: string): Promise<Servicio | null> {
        // Llama a la función del repositorio que SÍ tiene todos los IDs
        return await this.servicioRepository.getServicioParaFormulario(id);
    }
}