import { ServicioRepository } from "../domain/ServicioRepository";

export class GetStatsUseCase {
    constructor(readonly servicioRepository: ServicioRepository) {}

    async execute(user: any): Promise<any> {
        return await this.servicioRepository.getStats(user);
    }
}