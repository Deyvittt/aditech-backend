import { Dependencia } from "../domain/Dependencia";
import { DependenciaRepository } from "../domain/DependenciaRepository";
import { query } from "../../database/MysqlAdapter";
import { Signale } from "signale";

const signale = new Signale({scope: 'MysqlDependenciaRepository'});

export class MysqlDependenciaRepository implements DependenciaRepository {
    
    async getDependencias(): Promise<Dependencia[] | null> {
        const sql = "CALL getDependencias()"; 
        try {
            const [result]: any = await query(sql, []);
            
            if (!result || !result[0]) {
                return [];
            }
            
            return result[0] as Dependencia[];

        } catch (error: any) {
            signale.error("Error en getDependencias:", error);
            return null;
        }
    }

    async getDependenciaByDireccionId(direccionId: string): Promise<Dependencia|null>{
        try{
            const queryStr: string = "CALL getDependenciaByDireccionId(?)";
            const values = [direccionId]

            const [result]: any = await query(queryStr, values);

            if(result[0].length === 0){
                return null;
            }

            const dependenciaSql = result[0][0];

            const dependencia: Dependencia = new Dependencia(
                dependenciaSql.idDependencia,
                dependenciaSql.nombreDependencia,
                dependenciaSql.nombreCorto,
                dependenciaSql.ubicacionDependencia,
                dependenciaSql.codigoPostal,
                dependenciaSql.colonia,
                dependenciaSql.conmutador,
                dependenciaSql.correo,
                dependenciaSql.domicilio,
                dependenciaSql.fax,
                dependenciaSql.idDependenciatxt,
                dependenciaSql.idMunicipio,
                dependenciaSql.idSector,
                dependenciaSql.telefonoDirecto,
                dependenciaSql.tipoOrgano,
                dependenciaSql.web
            );

            return dependencia;

        }catch(error: any){
            signale.error(error);
            throw error;
        }
    }
}