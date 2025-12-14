import { Cargo } from "../../domain/Cargo"
import { CargoRepository } from "../../domain/CargoRepository";
import { query } from "../../../database/MysqlAdapter";
import { Signale } from "signale";

const signale = new Signale({scope: 'MysqlCargoRepository'});

export class MysqlCargoRepository implements CargoRepository {
    
    async getAll(): Promise<Cargo[] | null> {
        // Usamos un SELECT directo, es más simple para este caso.
        const sql = "SELECT idCargo, nombreCargo FROM cargo_enlace ORDER BY nombreCargo ASC";
        try {
            const [result]: any = await query(sql, []);
            return result as Cargo[]; // Retornamos el resultado directamente
        } catch (error: any) {
            signale.error("Error en getAll Cargos:", error);
            return null;
        }
    }

    async getCargoById(cargoId: string): Promise<Cargo | null> {
        try {
            const queryStr: string = 'CALL getCargoById(?)';
            const values: any[] = [cargoId]; // <- Corregido: Pasar el ID a la consulta
            const [result]: any = await query(queryStr, values);

            if (result[0].length === 0) { // <- Corregido: typo 'lenght' a 'length'
                return null;
            }

            const cargoSql = result[0][0];
            return new Cargo(
                cargoSql.idCargo,
                cargoSql.nombreCargo
            );
        } catch (error: any) {
            signale.error(error);
            throw error;
        }
    }
}