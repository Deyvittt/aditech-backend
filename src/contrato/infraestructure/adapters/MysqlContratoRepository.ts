import { ContratoRepository } from "../../domain/repositories/ContratoRepository";
import { Contrato } from "../../domain/entities/Contrato";
import { TipoContrato } from "../../domain/entities/TipoContrato";
import { TipoInstalacion } from "../../domain/entities/TipoInstalacion";
import { VersionContrato } from "../../domain/entities/VersionContrato";
import { ContratoDto } from "../../domain/entities/ContratoDto";
import { query } from "../../../database/MysqlAdapter";
import { Signale } from "signale";

const signale = new Signale({scope: 'MysqlContratoRepository'});

// Función helper para limpiar undefined y que la BD reciba NULL
const clean = (val: any) => (val !== undefined ? val : null);

export class MysqlContratoRepository implements ContratoRepository {
    
    // =================================================================
    // 1. ADD CONTRATO (Ahora con 10 parámetros para incluir Depto)
    // =================================================================
    async addContrato(contrato: Contrato): Promise<Contrato | null> {
        try {
            // Son 10 signos de interrogación exactos
            const queryStr: string = 'CALL addContrato(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
            const values: any[] = [
                contrato.enlaceId, 
                contrato.estatus, 
                contrato.descripcion, 
                contrato.fechaContrato, 
                contrato.userId, 
                contrato.versionContratoId, 
                contrato.ubicacion, 
                contrato.tipoContratoId,
                new Date(),
                (contrato as any).departamentoId // El dato #10
            ];

            // console.log("Intentando crear contrato con valores:", values); // Debug opcional
    
            const [result]: any = await query(queryStr, values);

            if (!result || !result[0] || result[0].length === 0) {
                return null;
            }

            const contratoSql = result[0][0];
    
            return new Contrato(
                contratoSql.persona_id, 
                contratoSql.estatus, 
                contratoSql.descripcion, 
                contratoSql.fechaContrato, 
                contratoSql.createdBy, 
                contratoSql.id_versionContrato, 
                contratoSql.ubicacion, 
                contratoSql.id_tipoContrato, 
                contratoSql.idContrato
            );
    
        } catch (error: any) {
            console.error("ERROR SQL EN ADDCONTRATO:", error);
            signale.error(error);
            throw error;
        }
    }
    
    // =================================================================
    // 2. GET ALL DETALLADO (La Joya de la Corona - Tabla Principal)
    // =================================================================
    async getAllContratoDetallado(user?: any): Promise<any[] | null> {
        try {
            // Usamos SQL Puro para controlar el ALIAS y el FILTRO
            let sql = `
                SELECT 
                    c.idContrato,
                    c.idContrato AS id,  -- ¡CRUCIAL! Esto arregla el error 'undefined' en el link
                    ep.nombre AS nombreEnlace,
                    ep.apellidoP AS apellidoPEnlace,
                    ep.apellidoM AS apellidoMEnlace,
                    c.persona_id AS enlaceId,
                    c.estatus,
                    c.descripcion,
                    c.fechaContrato,
                    vc.descripcion AS versionContrato,
                    ti.nombre AS ubicacion,
                    tc.nombre AS tipoContrato
                FROM 
                    enlace_contrato c
                    LEFT JOIN enlace_persona ep ON c.persona_id = ep.idPersona
                    LEFT JOIN version_contrato vc ON c.id_versionContrato = vc.id_version
                    LEFT JOIN tipo_instalacion ti ON c.ubicacion = ti.id_tipoInstalacion
                    LEFT JOIN catalago_tipocontrato tc ON c.id_tipoContrato = tc.idTipoContrato
            `;

            const condiciones: string[] = [];
            const params: any[] = [];

            // --- 🛡️ FILTRO DE SEGURIDAD 🛡️ ---
            if (user) {
                const ID_DEPARTAMENTO_GLOBAL = 489; // Sistemas
                const esDios = user.rol === 'Superusuario' && user.departamento === ID_DEPARTAMENTO_GLOBAL;
                const esLector = user.rol === 'Lector';
                const esSistemas = user.departamento === ID_DEPARTAMENTO_GLOBAL;

                // Si NO es Dios, NO es Lector y NO es Sistemas -> Filtra por su depto (Rómulo)
                if(!esDios && !esLector && !esSistemas){
                    console.log(`[getContratos] Filtrando por depto ${user.departamento}`);
                    condiciones.push("c.id_departamento = ?");
                    params.push(user.departamento);
                } else {
                    console.log(`[getContratos] Acceso Total (Sistemas/Lector/Dios)`);
                }
            }

            if(condiciones.length > 0){
                sql += " WHERE " + condiciones.join(" AND ");
            }

            sql += " ORDER BY c.idContrato DESC";

            const [result]: any = await query(sql, params);

            if(!result || result.length === 0) return null;

            const contratoDtos: ContratoDto[] = result.map((contrato: any) => {
                return new ContratoDto(
                    contrato.id, // Ahora sí existe gracias al alias
                    contrato.nombreEnlace,
                    contrato.apellidoPEnlace,
                    contrato.apellidoMEnlace,
                    contrato.enlaceId,
                    contrato.estatus,
                    contrato.descripcion,
                    contrato.fechaContrato,
                    contrato.versionContrato,
                    contrato.ubicacion,
                    contrato.tipoContrato
                ); 
            });

            return contratoDtos;

        } catch (error: any) {
            signale.error(error);
            throw error;
        }
    }

    // =================================================================
    // 3. GET CONTRATOS (Lista simple - También la blindamos)
    // =================================================================
    async getContratos(user: any): Promise<Contrato[] | null> {
        // Cambiamos CALL por SQL directo para aplicar filtros también aquí
        let sql = `
            SELECT * FROM enlace_contrato c
        `;
        
        const condiciones: string[] = [];
        const params: any[] = [];

        if (user) {
            const ID_DEPARTAMENTO_GLOBAL = 489;
            const esDios = user.rol === 'Superusuario' && user.departamento === ID_DEPARTAMENTO_GLOBAL;
            const esLector = user.rol === 'Lector';
            const esSistemas = user.departamento === ID_DEPARTAMENTO_GLOBAL;

            if(!esDios && !esLector && !esSistemas){
                condiciones.push("c.id_departamento = ?");
                params.push(user.departamento);
            }
        }

        if(condiciones.length > 0){
            sql += " WHERE " + condiciones.join(" AND ");
        }
        
        sql += " ORDER BY c.idContrato DESC";

        try {
            const [result]: any = await query(sql, params);

            if (!result || result.length === 0){
                return null;
            }

            const contratos: Contrato[] = result.map((contrato: any) => new Contrato(
                contrato.persona_id, 
                contrato.estatus, 
                contrato.descripcion, 
                contrato.fechaContrato, 
                contrato.createdBy, // Ojo: en BD es createdBy, en Entidad puede ser id_user o userId
                contrato.id_versionContrato, 
                contrato.ubicacion, 
                contrato.id_tipoContrato, 
                contrato.idContrato
            ));

            return contratos;

        } catch (error: any) {
            signale.error(error);
            throw error;
        }
    }

    // =================================================================
    // 4. OTROS MÉTODOS (Estos se quedan igual o con pequeños ajustes)
    // =================================================================

    // By Enlace (Filtra por persona, no necesariamente por depto, lo dejamos así)
    async getContratosByEnlace(enlaceId: string): Promise<Contrato[] | null> {
        try {
            const queryStr: string = 'CALL getContratosByPersonaId(?)';
            const values: any[] = [enlaceId];
            const [result]: any = await query(queryStr, values);
            if (result[0].length === 0) return null;
            
            return result[0].map((contrato: any) => new Contrato(
                contrato.persona_id, contrato.estatus, contrato.descripcion, contrato.fechaContrato, 
                contrato.id_user, contrato.id_versionContrato, contrato.ubicacion, contrato.id_tipoContrato, contrato.idContrato
            ));
        } catch (error: any) {
            signale.error(error); throw error;
        }
    }

    // Detallado By Enlace
    async getAllContratoDetalladoByEnlace(enlaceId: string): Promise<ContratoDto[] | null> {
        try {
            const queryStr: string = 'CALL getAllContratoDetalladoByPersonaId(?)';
            const values: any[] = [enlaceId];
            const [result]: any = await query(queryStr, values);
            if (result[0].length === 0) return null;
            return result[0].map((contrato: any) => new ContratoDto(
                contrato.id, contrato.nombreEnlace, contrato.apellidoPEnlace,
                contrato.apellidoMEnlace, contrato.enlaceId, contrato.estatus,
                contrato.descripcion, contrato.fechaContrato, contrato.versionContrato,
                contrato.ubicacion, contrato.tipoContrato
            ));
        } catch (error: any) {
            signale.error(error); throw error;
        }
    }

    // --- Query SQL Manual para GetById (Ya incluye 'as id', está perfecto) ---
    private readonly getContratoQuery = `
        SELECT 
            con.idContrato as id,
            ep.nombre as nombreEnlace,
            ep.apellidoP as apellidoPEnlace,
            ep.apellidoM as apellidoMEnlace,
            ep.idPersona as enlaceId,
            con.estatus,
            con.descripcion,
            con.fechaContrato,
            vc.descripcion as versionContrato,
            ti.nombre as ubicacionNombre, 
            tc.nombre as tipoContrato,
            con.id_tipoContrato,
            con.id_versionContrato,
            con.ubicacion as ubicacionId 
        FROM 
            enlace_contrato as con
            LEFT JOIN enlace_persona as ep ON con.persona_id = ep.idPersona
            LEFT JOIN catalago_tipocontrato as tc ON con.id_tipoContrato = tc.idTipoContrato
            LEFT JOIN tipo_instalacion as ti ON con.ubicacion = ti.id_tipoInstalacion
            LEFT JOIN version_contrato as vc ON con.id_versionContrato = vc.id_version
        WHERE 
            con.idContrato = ? AND (con.estatus = 1 OR con.estatus = 3);
    `;

    // --- Mapeador ---
    private mapSqlToContratoDto(contratoSql: any): ContratoDto {
        const contrato: ContratoDto = new ContratoDto(
            contratoSql.id, contratoSql.nombreEnlace, contratoSql.apellidoPEnlace,
            contratoSql.apellidoMEnlace, contratoSql.enlaceId, contratoSql.estatus,
            contratoSql.descripcion, contratoSql.fechaContrato, contratoSql.versionContrato,
            contratoSql.ubicacionNombre, contratoSql.tipoContrato
        );
        (contrato as any).id_tipoContrato = contratoSql.id_tipoContrato;
        (contrato as any).id_versionContrato = contratoSql.id_versionContrato;
        (contrato as any).ubicacion = contratoSql.ubicacionId; 
        return contrato;
    }

    async getContratoById(contratoId: number): Promise<ContratoDto | null> {
         try {
            signale.info(`Ejecutando getContratoById para ID: ${contratoId}`);
            const [result]: any = await query(this.getContratoQuery, [contratoId]);
            if (result.length === 0) {
                 signale.warn(`No se encontró contrato con ID: ${contratoId}`);
                 return null;
            }
            return this.mapSqlToContratoDto(result[0]);
         } catch (error: any) {
             signale.error(`Error en getContratoById (${contratoId}):`, error);
             throw error; 
         }
    }
    
    async getContratoDetalladoById(contratoId: number): Promise<ContratoDto | null> {
        try {
            signale.info(`Ejecutando getContratoDetalladoById para ID: ${contratoId}`);
            const [result]: any = await query(this.getContratoQuery, [contratoId]); 
            if (result.length === 0) {
                 signale.warn(`No se encontró contrato con ID: ${contratoId}`);
                 return null;
            }
            return this.mapSqlToContratoDto(result[0]);
        } catch (error: any) { 
            signale.error(`Error en getContratoDetalladoById (${contratoId}):`, error); 
            throw error; 
        }
    }

    // --- CATÁLOGOS (Igual que antes) ---
    async getAllTipoInstalacion(): Promise<TipoInstalacion[] | null> {
        try {
            const queryStr: string = 'CALL getAllTipoInstalacion()';
            const [result]: any = await query(queryStr, []);
            if (result[0].length === 0) return null;
            return result[0].map((tipo: any) => new TipoInstalacion(tipo.id_tipoInstalacion, tipo.nombre, tipo.estatus));
        } catch (error: any) { signale.error(error); throw error; }
    }
    async getAllTipoContrato(): Promise<TipoContrato[] | null> {
        try {
            const queryStr: string = 'CALL getAllTipoContrato()';
            const [result]: any = await query(queryStr, []);
            if (result[0].length === 0) return null;
            return result[0].map((tipo: any) => new TipoContrato(tipo.idTipoContrato, tipo.nombre, tipo.estatus));
        } catch (error: any) { signale.error(error); throw error; }
    }
    async getAllVersionContrato(): Promise<VersionContrato[] | null> {
        try {
            const queryStr: string = 'CALL getAllVersionContrato()';
            const [result]: any = await query(queryStr, []);
            if (result[0].length === 0) return null;
            return result[0].map((version: any) => new VersionContrato(version.id_version, version.descripcion, version.estatus, version.id_tipoContrato));
        } catch (error: any) { signale.error(error); throw error; }
    }
    async getVersionesByTipoContratoId(tipoContratoId: string): Promise<VersionContrato[] | null> {
        try {
            const queryStr: string = 'CALL getVersionesByTipoContratoId(?)';
            const values: any[] = [tipoContratoId];
            const [result]: any = await query(queryStr, values);
            if (result[0].length === 0) return null;
            return result[0].map((version: any) => new VersionContrato(version.id_version, version.descripcion, version.estatus, version.id_tipoContrato));
        } catch (error: any) { signale.error(error); throw error; }
    }

    // --- UPDATE (Corregido orden y limpieza) ---
    async updateContrato(contratoId: string, updateData: any): Promise<Contrato | null> {
        try{
            const queryStr: string = 'CALL updateContrato(?, ?, ?, ?, ?, ?, ?, ?, ?)'; 
        
            const valuesCorregidos: any[] = [
                clean(contratoId),
                clean(updateData.estatus),
                clean(updateData.descripcion),
                clean(updateData.fechaContrato),
                clean(updateData.userId),
                clean(updateData.id_versionContrato),
                clean(updateData.ubicacion),
                clean(updateData.id_tipoContrato),
                new Date()
            ];
            
            signale.info("Llamando a updateContrato:", valuesCorregidos);

            const [result]: any = await query(queryStr, valuesCorregidos);

            if (!result || result.affectedRows === 0) {
                return null; 
            }
            
            return new Contrato(
                updateData.enlaceId, 
                updateData.estatus, 
                updateData.descripcion,
                new Date(updateData.fechaContrato), 
                updateData.userId, 
                updateData.id_versionContrato,
                updateData.ubicacion, 
                updateData.id_tipoContrato, 
                contratoId
            );

        } catch (error: any) {
            signale.error('Error en updateContrato Repository:', error); 
            throw error;
        }
    }

    // --- DELETE ---
    async deleteContrato(contratoId: string): Promise<boolean> {
        try {
            const queryStr: string = 'CALL deleteContrato(?)';
            const values: any[] = [contratoId];
            const [result]: any = await query(queryStr, values);
            return result.affectedRows > 0;
        } catch (error: any) {
            signale.error(error); throw error;
        }
    }
}