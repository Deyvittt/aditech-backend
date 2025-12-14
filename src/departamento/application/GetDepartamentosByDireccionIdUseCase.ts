import { Departamento } from "../domain/Departamento";
import { DepartamentoRepository } from "../domain/DepartamentoRepository";

export class GetDepartamentosByDireccionIdUseCase {
    constructor(private departamentoRepository: DepartamentoRepository) {}

    async run(direccionId: number): Promise<Departamento[] | null> {
        return await this.departamentoRepository.getDepartamentosByDireccionId(direccionId);
    }
}