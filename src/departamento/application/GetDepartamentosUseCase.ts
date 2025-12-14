import { Departamento } from "../domain/Departamento";
import { DepartamentoRepository } from "../domain/DepartamentoRepository";

export class GetDepartamentosUseCase {
    constructor(private departamentoRepository: DepartamentoRepository) {}

    async run(): Promise<Departamento[] | null> {
        return await this.departamentoRepository.getDepartamentos();
    }
}