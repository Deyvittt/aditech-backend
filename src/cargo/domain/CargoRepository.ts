import { Cargo } from "./Cargo";

export interface CargoRepository {
    getAll(): Promise<Cargo[] | null>;
    getCargoById(cargoId: string): Promise<Cargo | null>;
}