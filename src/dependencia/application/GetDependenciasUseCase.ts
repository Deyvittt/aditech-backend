import { Dependencia } from "../domain/Dependencia";
import { DependenciaRepository } from "../domain/DependenciaRepository";

export class GetDependenciasUseCase {
    constructor(readonly dependenciaRepository: DependenciaRepository) {}

    async execute(): Promise<Dependencia[] | null> {
        try {
            const dependencias = await this.dependenciaRepository.getDependencias();
            return dependencias;
        } catch (error) {
            console.error("Error en GetDependenciasUseCase", error);
            return null;
        }
    }
}