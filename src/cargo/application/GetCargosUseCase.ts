import { Cargo } from "../domain/Cargo";
import { CargoRepository } from "../domain/CargoRepository";

export class GetCargosUseCase {
    constructor(readonly cargoRepository: CargoRepository) {}

    async execute(): Promise<Cargo[] | null> {
        try {
            return await this.cargoRepository.getAll();
        } catch (error) {
            console.error("Error en GetCargosUseCase", error);
            return null;
        }
    }
}