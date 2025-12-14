import { DireccionRepository } from "../domain/DireccionRepository";
import { Direccion } from "../domain/Direccion";
import { query } from "../../database/MysqlAdapter";
import { Signale } from "signale";

const signale = new Signale({scope: 'MysqlDireccionRepository'});

export class MysqlDireccionRepository implements DireccionRepository {
    async getDirecciones(): Promise<Direccion[] | null> {
        try {
            const queryStr: string = 'CALL getDirecciones()';
            const [result]: any = await query(queryStr, []);

            if(result[0].length === 0){
                return null;
            }

            const direcciones: Direccion[] = result[0].map((direccion: any) => new Direccion(
                direccion.idDireccion,
                direccion.nombre,
                direccion.dependencia_id,
                direccion.idPadre_id
            ));

            return direcciones;
        } catch (error: any) {
            signale.error(error);
            throw error;
        }
    }

    async getDireccionesByDependencia(dependenciaId: number): Promise<Direccion[] | null> {
        try {
            const queryStr: string = 'CALL getDireccionesByDependenciaId(?)';
            const values: any[] = [dependenciaId];
            const [result]: any = await query(queryStr, values);

            if(result[0].length === 0){
                return null;
            }

            const direcciones: Direccion[] = result[0].map((direccion: any) => new Direccion(
                direccion.idDireccion,
                direccion.nombre,
                direccion.dependencia_id,
                direccion.idPadre_id
            ));

            return direcciones;
        } catch (error: any) {
            signale.error(error);
            throw error;
        }
    }

    async getDireccionById(direccionId: string): Promise<Direccion | null> {
        try{
            const queryStr: string = 'CALL getDireccionById(?)';
            const values: any = [direccionId];

            const [result]: any = await query(queryStr, values);

            if(result[0].length === 0){
                return null;
            }

            const direccionSql = result[0][0];

            const direccion: Direccion = new Direccion(
                direccionSql.idDireccion,
                direccionSql.nombre,
                direccionSql.dependencia_id,
                direccionSql.idPadre_id
            )

            return direccion;

        } catch(error: any){
            signale.error(error);
            throw error;
        }
    }
}