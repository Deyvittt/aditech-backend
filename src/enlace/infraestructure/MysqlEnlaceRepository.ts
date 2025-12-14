import { EnlaceRepository } from "../domain/EnlaceRepository";
import { Enlace } from "../domain/Enlace";
import { EnlaceDto } from "../domain/EnlaceDto";
import { query } from "../../database/MysqlAdapter";
import { Signale } from "signale";
import { EnlaceCompletoDto } from "../domain/EnlaceCompletoDto";

const signale = new Signale({scope: 'MysqlEnlaceRepository'});
const clean = (val: any) => (val !== undefined ? val : null);

export class MysqlEnlaceRepository implements EnlaceRepository {
    
    // --- 1. ADD ENLACE (Ya no marcará error en dependenciaId) ---
    async addEnlace(enlace: Enlace): Promise<Enlace | null> {
        try {
            const queryStr: string = 'CALL addEnlace(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
            const values: any[] = [
                enlace.nombre,
                enlace.apellidoP,
                enlace.apellidoM,
                enlace.correo,
                enlace.telefono,
                enlace.estatus || 1,
                enlace.adscripcionId,
                enlace.cargoId,
                enlace.userId,
                enlace.tipoPersonaId || 1,
                enlace.direccionId,
                enlace.dependenciaId // <--- Ahora sí existe en la clase Enlace
            ];

            const [result]: any = await query(queryStr, values);

            if (result && result[0] && result[0][0]) {
                const insertedData = result[0][0];
                enlace.setId(insertedData.idPersona); // Ajustado a tu tabla
                return enlace;
            } else if (result.affectedRows > 0) {
                enlace.setId(result.insertId);
                return enlace;
            }
            return null;
        } catch (error: any) {
            signale.error("Error addEnlace:", error);
            throw error;
        }
    }

    // --- 2. GET ENLACES (Mapeo actualizado con dependencia) ---
    async getEnlaces(): Promise<Enlace[] | null> {
        try {
            const queryStr: string = 'CALL getEnlaces()';
            const [result]: any = await query(queryStr, []);

            if(result[0].length === 0) return null;

            return result[0].map((enlace: any) => new Enlace(
                enlace.nombre,
                enlace.apellidoP,
                enlace.apellidoM,
                enlace.correo,
                enlace.telefono,
                enlace.estatus,
                enlace.adscripcion_id,
                enlace.cargo_id,
                enlace.auth_user_id, // Ojo con el nombre de columna de tu SP
                enlace.tipoPersona_id,
                enlace.direccion_id,
                enlace.dependencia_id, // <--- LEEMOS DEPENDENCIA
                enlace.idPersona
            ));
        } catch (error: any) {
            signale.error(error);
            throw error;
        }
    }

    // --- 3. GET BY ID (Mapeo actualizado) ---
    async getEnlaceById(id: string): Promise<Enlace | null> {
        try {
            const queryStr: string = 'CALL getEnlaceById(?)';
            const [result]: any = await query(queryStr, [id]);

            if(result[0].length === 0) return null;
            const enlaceSql = result[0][0];

            return new Enlace(
                enlaceSql.nombre,
                enlaceSql.apellidoP,
                enlaceSql.apellidoM,
                enlaceSql.correo,
                enlaceSql.telefono,
                enlaceSql.estatus,
                enlaceSql.adscripcion_id,
                enlaceSql.cargo_id,
                enlaceSql.auth_user_id,
                enlaceSql.tipoPersona_id,
                enlaceSql.direccion_id,
                enlaceSql.dependencia_id, // <--- LEEMOS DEPENDENCIA
                enlaceSql.idPersona
            );
        } catch (error: any) {
            signale.error(error);
            throw error;
        }
    }
 
    // --- 4. UPDATE (Aquí estaba el error de línea 254) ---
    async updateEnlace(enlaceId: string, updateData: any): Promise<Enlace | null> {
        try {
            const queryStr: string = "CALL updateEnlace(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";

            const values: any = [
                clean(enlaceId),
                new Date(),
                clean(updateData.userId),
                clean(updateData.nombre),
                clean(updateData.apellidoPaterno),
                clean(updateData.apellidoMaterno),
                clean(updateData.correo),
                clean(updateData.telefono),
                clean(updateData.estatus),
                clean(updateData.adscripcionId),
                clean(updateData.cargoId),
                clean(updateData.createdByUserid),
                clean(updateData.tipoPersonaId),
                clean(updateData.direccionId),
                clean(updateData.dependenciaId) // Ahora sí lo enviamos
            ];

            const [result]: any = await query(queryStr, values);

            if (!result || result.affectedRows === 0) {
                signale.warn(`Update no afectó filas: ${enlaceId}`);
            }
            
            // Retornamos el objeto actualizado (aquí fallaba antes)
            return new Enlace(
                updateData.nombre,
                updateData.apellidoPaterno,
                updateData.apellidoMaterno,
                updateData.correo,
                updateData.telefono,
                updateData.estatus,
                updateData.adscripcionId,
                updateData.cargoId,
                updateData.userId,
                updateData.tipoPersonaId,
                updateData.direccionId,
                updateData.dependenciaId || 0, // <--- NUEVO CAMPO
                Number(enlaceId)                // <--- CONVERTIDO A NÚMERO
            );

        } catch (error: any) {
            signale.error('Error updateEnlace:', error);
            throw error;
        }
    }

    // ... Resto de métodos igual (getEnlaceCompletoById, deleteEnlace, etc.)
    async getEnlaceCompletoById(enlaceId: number): Promise<EnlaceCompletoDto | null> {
        try {
            const queryStr: string = 'CALL getEnlaceCompletoById(?)';
            const [result]: any = await query(queryStr, [enlaceId]);
            if(!result[0] || result[0].length === 0) return null;
            const e = result[0][0];
            return new EnlaceCompletoDto(
                e.dependenciaId, e.cargoId, e.direccionId, e.adscripcionId, e.tipoPersonaId, e.userId,
                e.id, e.nombre, e.apellidoP, e.apellidoM, e.correo, e.telefono, e.estatus, 
                e.dependencia, e.cargo, e.direccion, e.adscripcion
            );
        } catch (error: any) { throw error; }
    }

    async getEnlacesByEstatus(estatus: number): Promise<Enlace[] | null> { return null; } 
    async deleteEnlace(id: string): Promise<boolean> {
        try {
            const [result]: any = await query('CALL deleteEnlace(?)', [id]);
            return result.affectedRows > 0;
        } catch (error: any) { throw error; }
    }
    async getAllEnlaceDetallado(): Promise<any[] | null> {
         try {
            const [result]: any = await query('CALL getAllEnlaceDetallado()', []);
            if(result[0].length === 0) return null;
            return result[0].map((enlace: any) => new EnlaceDto(
                enlace.id, enlace.nombre, enlace.apellidoP, enlace.apellidoM, enlace.correo,
                enlace.telefono, enlace.estatus, enlace.dependencia, enlace.cargo, enlace.direccion, enlace.adscripcion
            ));
        } catch (error: any) { throw error; }
    }
    async getEnlaceByDireccion(direccionId: number): Promise<any | null> { return null; }
}