import { query } from "../../../database/MysqlAdapter";
import { Servicio } from "../../domain/Servicio";
import { ServicioRepository } from "../../domain/ServicioRepository";
import { Signale } from "signale";

const signale = new Signale({ scope: 'MysqlServicioRepository' });

//Helper para limpiar undefined
const clean = (val: any) => (val === undefined ? null : val);

export class MysqlServicioRepository implements ServicioRepository {

    //Auxiliares
    async getServicioParaFormulario(id: string): Promise<Servicio | null> {
        const sql = "CALL getServicioParaFormulario(?)";
        try {
            const [result]: any = await query(sql, [id]);
            if (!result || !result[0] || result[0].length === 0) return null;
            return result[0][0] as Servicio;
        } catch (error) { return null; }
    }

    private async generarNuevoFolio(idParaFolio: number): Promise<string> {
        const prefijos: { [key: number]: string } = { 1: 'AS', 2: 'AD', 3: 'MA', 4: 'SI', 5: 'SD', 6: 'MP', 7: 'SP' };
        const prefijo = prefijos[idParaFolio] || 'GE';
        const sql = `SELECT MAX(CAST(SUBSTRING_INDEX(folio, '-', -1) AS UNSIGNED)) as max_num FROM enlace_servicio WHERE folio LIKE ?`;
        try {
            const [result]: any = await query(sql, [`${prefijo}-%`]);
            const ultimoNumero = result[0].max_num || 0;
            return `${prefijo}-${String(ultimoNumero + 1).padStart(3, '0')}`;
        } catch (error) { return `${prefijo}-${Date.now().toString().slice(-5)}`; }
    }

    //ADD SERVICIO
    async addServicio(servicio: any): Promise<Servicio | null> {
        const tipoServicioId = servicio.tipoServicioId || servicio.id_tipo_servicio;
        const nuevoFolio = await this.generarNuevoFolio(tipoServicioId);

        const sql = "CALL addServicio(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        const params = [
            clean(nuevoFolio),                                                              // p_folio
            clean(servicio.nombreSolicitante || servicio.nombre_solicitante || servicio.solicitante), // p_nombreSolicitante
            clean(servicio.nombreReceptor    || servicio.nombre_receptor    || servicio.receptor),    // p_nombreReceptor
            clean(servicio.fechaInicio       || servicio.fecha_inicio),                     // p_fechaInicio
            clean(servicio.fechaTermino      || servicio.fecha_termino),                    // p_fechaTermino
            clean(servicio.horaInicio        || servicio.hora_inicio),                      // p_horaInicio
            clean(servicio.horaTermino       || servicio.hora_termino),                     // p_horaTermino
            clean(servicio.descripcionFalla  || servicio.descripcion_falla),                // p_descripcionFalla
            clean(servicio.descripcionActividad || servicio.descripcion_actividad),         // p_descripcionActividad
            clean(servicio.nivel),                                                          // p_nivel
            clean(servicio.fotos),                                                          // p_fotos (TEXT: "foto1.jpg,foto2.jpg")
            clean(servicio.observaciones),                                                  // p_observaciones
            clean(servicio.tipoEnvioId || servicio.tipo_envio || servicio.tipoEnvio),       // p_tipoEnvio
            clean(servicio.estatus || 1),                                                   // p_estatus
            clean(tipoServicioId),                                                          // p_tipoServicioId
            clean(servicio.contratoId        || servicio.id_contrato),                      // p_contratoId
            clean(servicio.tipoActividadId   || servicio.id_tipo_actividad),                // p_tipoActividadId
            clean(servicio.estadoServicioId  || servicio.id_estado_servicio),               // p_estadoServicioId
            clean(servicio.direccionId       || servicio.id_direccion),                     // p_direccionId
            clean(servicio.cargoId           || servicio.id_cargo),                         // p_cargoId
            clean(servicio.createdBy),                                                      // p_createdBy
        ];

        try {
            const [result]: any = await query(sql, params);
            if (result && result[0] && result[0].length > 0) {
                const s = result[0][0];
                return {
                    id: s.id,
                    folio: s.folio,
                    nombreSolicitante: s.nombre_solicitante,
                    nombreReceptor: s.nombre_receptor,
                    departamentoId: s.id_departamento
                } as unknown as Servicio;
            }
            return null;
        } catch (error) {
            signale.error("Error en addServicio:", error);
            throw error;
        }
    }

    //LISTA PRINCIPAL (GET SERVICIOS)
    async getServicios(user: any, filtroEstado?: number | null): Promise<Servicio[] | null> {
        let baseSql = `
            SELECT
                s.id, s.folio, s.fecha_inicio, s.estatus, s.id_departamento,
                s.id_estado_servicio,
                s.id_tipo_servicio,
                s.id_direccion,
                COALESCE(CONCAT(u_rec.nombre, ' ', u_rec.apellidoP), s.nombre_receptor) as nombreReceptor,
                COALESCE(CONCAT(u_sol.nombre, ' ', u_sol.apellidoP), s.nombre_solicitante) as nombreSolicitante,
                ubic.nombre as nombreDireccion,
                es.nombre as nombreEstado,
                cts.nombre as nombreTipoServicio
            FROM
                enlace_servicio s
                LEFT JOIN usuario u_rec ON s.id_receptor = u_rec.idUsuario
                LEFT JOIN usuario u_sol ON s.id_solicitante = u_sol.idUsuario
                LEFT JOIN catalago_ubicacion ubic ON s.id_direccion = ubic.id
                LEFT JOIN estados_servicio es ON s.id_estado_servicio = es.id
                LEFT JOIN catalagoservicio cts ON s.id_tipo_servicio = cts.idServicio
        `;

        const condiciones: string[] = [];
        const params: any[] = [];

        condiciones.push("s.estatus = 1");

        const ID_DEPARTAMENTO_GLOBAL = 489;
        const esLectorGlobal = user.rol === 'Lector';
        const esDios = user.rol === 'Superusuario' && user.departamento === ID_DEPARTAMENTO_GLOBAL;

        if (!esLectorGlobal && !esDios) {
            condiciones.push("s.id_departamento = ?");
            params.push(user.departamento);
        }
        if (filtroEstado !== null && filtroEstado !== undefined) {
            condiciones.push("s.id_estado_servicio = ?");
            params.push(filtroEstado);
        }

        const finalSql = `${baseSql} WHERE ${condiciones.join(" AND ")} ORDER BY s.id DESC`;

        try {
            const [result]: any = await query(finalSql, params);
            return result.map((row: any) => ({
                id: row.id,
                folio: row.folio,
                nombreSolicitante: row.nombreSolicitante,
                nombreReceptor: row.nombreReceptor,
                fechaInicio: row.fecha_inicio,
                direccion: row.nombreDireccion || "Sin Dirección",
                estatus: row.estatus,
                estadoServicioId: row.id_estado_servicio,
                estadoServicio: row.nombreEstado,
                tipoServicioId: row.id_tipo_servicio,
                tipoServicio: row.nombreTipoServicio,
                departamentoId: row.id_departamento
            })) as unknown as Servicio[];
        } catch (error) {
            signale.error("Error en getServicios:", error);
            return null;
        }
    }

    //DETALLE / PDF
    async getServicioById(id: number): Promise<Servicio | null> {
        const sql = `
            SELECT
                s.*,
                COALESCE(CONCAT(u_rec.nombre, ' ', u_rec.apellidoP), s.nombre_receptor) as nombreReceptorReal,
                COALESCE(CONCAT(u_sol.nombre, ' ', u_sol.apellidoP), s.nombre_solicitante) as nombreSolicitanteReal,
                cts.nombre      as nombreTipoServicio,
                ubic.nombre     as nombreUbicacion,
                te.nombre       as nombreTipoEnvio,
                es.nombre       as nombreEstadoServicio,
                sta.nombre      as nombreTipoActividad,
                ce_enl.nombreCargo as nombreCargo,
                dep.nombreCorto as nombreDependencia
            FROM
                enlace_servicio s
                LEFT JOIN usuario u_rec                  ON s.id_receptor        = u_rec.idUsuario
                LEFT JOIN usuario u_sol                  ON s.id_solicitante     = u_sol.idUsuario
                LEFT JOIN catalagoservicio cts           ON s.id_tipo_servicio   = cts.idServicio
                LEFT JOIN catalago_ubicacion ubic        ON s.id_direccion       = ubic.id
                LEFT JOIN catalago_tipo_envio te         ON s.tipo_envio         = te.id
                LEFT JOIN estados_servicio es            ON s.id_estado_servicio = es.id
                LEFT JOIN servicio_tipos_actividad sta   ON s.id_tipo_actividad  = sta.id
                LEFT JOIN enlace_contrato ec             ON s.id_contrato        = ec.idContrato
                LEFT JOIN enlace_persona ep              ON ec.persona_id        = ep.idPersona
                LEFT JOIN cargo_enlace ce_enl            ON ep.cargo_id          = ce_enl.idCargo
                LEFT JOIN catalagodependencia_enlace dep ON ep.dependencia_id    = dep.idDependencia
            WHERE s.id = ?
        `;

        try {
            const [result]: any = await query(sql, [id]);
            if (result && result[0]) {
                const s = result[0];
                return {
                    id: s.id,
                    folio: s.folio,
                    nombreSolicitante: s.nombreSolicitanteReal || "",
                    nombreReceptor:    s.nombreReceptorReal    || "",
                    fechaInicio:       s.fecha_inicio,
                    fechaTermino:      s.fecha_termino,
                    horaInicio:        s.hora_inicio,
                    horaTermino:       s.hora_termino,
                    descripcionFalla:    s.descripcion_falla    || "",
                    descripcionActividad: s.descripcion_actividad || "",
                    nivel:             s.nombreUbicacion        || "",
                    fotos:             s.fotos,
                    observaciones:     s.observaciones          || "",
                    tipoEnvioId:       s.tipo_envio,
                    tipoEnvio:         s.nombreTipoEnvio        || "",
                    estatus:           s.estatus,
                    tipoServicioId:    s.id_tipo_servicio,
                    tipoServicio:      s.nombreTipoServicio     || "",
                    contratoId:        s.id_contrato,
                    tipoActividadId:   s.id_tipo_actividad,
                    tipoActividad:     s.nombreTipoActividad    || "",
                    estadoServicioId:  s.id_estado_servicio,
                    estadoServicio:    s.nombreEstadoServicio   || "",
                    direccionId:       s.id_direccion,
                    direccion:         s.nombreUbicacion        || "",
                    cargoId:           s.id_cargo,
                    cargo:             s.nombreCargo            || "",
                    dependencia:       s.nombreDependencia      || "",
                    createdBy:         s.createdBy,
                    departamentoId:    s.id_departamento
                } as unknown as Servicio;
            }
            return null;
        } catch (error) {
            signale.error("Error en getServicioById:", error);
            return null;
        }
    }

    //UPDATE SERVICIO
    async updateServicio(servicioId: string, updateData: any): Promise<Servicio | null> {

        const sql = "CALL updateServicio(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        const params = [
            clean(servicioId),                      // _id
            clean(updateData.nombreSolicitante),    // _nombre_solicitante
            clean(updateData.nombreReceptor),       // _nombre_receptor
            clean(updateData.fechaInicio),          // _fecha_inicio
            clean(updateData.fechaTermino),         // _fecha_termino
            clean(updateData.horaInicio),           // _hora_inicio
            clean(updateData.horaTermino),          // _hora_termino
            clean(updateData.descripcionFalla),     // _descripcion_falla
            clean(updateData.descripcionActividad), // _descripcion_actividad
            clean(updateData.nivel),                // _nivel
            clean(updateData.fotos),                // _fotos (TEXT)
            clean(updateData.observaciones),        // _observaciones
            clean(updateData.tipoEnvioId),          // _tipo_envio
            clean(updateData.estatus),              // _estatus
            clean(updateData.tipoServicioId),       // _id_tipo_servicio
            clean(updateData.tipoActividadId),      // _id_tipo_actividad
            clean(updateData.estadoServicioId),     // _id_estado_servicio
            clean(updateData.direccionId),          // _id_direccion
            clean(updateData.cargoId),              // _id_cargo
        ];

        try {
            const [result]: any = await query(sql, params);
            if (result && result.affectedRows > 0) return { id: servicioId, ...updateData } as Servicio;
            return null;
        } catch (error) {
            signale.error("Error en updateServicio:", error);
            return null;
        }
    }

    //DELETE SERVICIO (borrado lógico)
    async deleteServicio(id: string): Promise<boolean> {
        const sql = "UPDATE enlace_servicio SET estatus = 3 WHERE id = ?";
        try {
            const [result]: any = await query(sql, [id]);
            return result.affectedRows > 0;
        } catch (error) {
            signale.error("Error en deleteServicio:", error);
            return false;
        }
    }

    //STATS Y CATÁLOGOS
    async getStats(user: any): Promise<any> {
        const sql = "CALL getDashboardStats(?, ?)";
        try {
            const [results]: any = await query(sql, [user.departamento, user.rol]);
            const kpis      = (results && results[0] && results[0][0]) ? results[0][0] : { hoy: 0, ayer: 0, mes: 0, totalHistorico: 0 };
            const porEstatus = (results && results[1]) ? results[1] : [];
            const porPersona = (results && results[2]) ? results[2] : [];

            return {
                tarjetas: { hoy: kpis.hoy, ayer: kpis.ayer, mes: kpis.mes, total: kpis.totalHistorico },
                graficaEstatus:  porEstatus.map((item: any) => ({ name: item.nombreEstatus,  value: item.cantidad })),
                graficaPersonal: porPersona.map((item: any) => ({ name: item.nombrePersonal, servicios: item.cantidadServicios }))
            };
        } catch (error) {
            return { tarjetas: { hoy: 0, ayer: 0, mes: 0, total: 0 }, graficaEstatus: [], graficaPersonal: [] };
        }
    }

    async getAllTipoServicio():  Promise<any[] | null> { return (await query("SELECT idServicio as id, nombre FROM catalagoservicio WHERE estatus = 1",          []) as any)[0]; }
    async getAllTipoActividad(): Promise<any[] | null> { return (await query("SELECT id, nombre FROM servicio_tipos_actividad WHERE estatus = 1",                 []) as any)[0]; }
    async getAllEstadoServicio():Promise<any[] | null> { return (await query("SELECT id, nombre FROM estados_servicio WHERE estatus = 1",                         []) as any)[0]; }
    async getAllUbicaciones():   Promise<any[] | null> { return (await query("SELECT id, nombre FROM catalago_ubicacion",                                         []) as any)[0]; }
    async getAllTiposEnvio():    Promise<any[] | null> { return (await query("SELECT id, nombre FROM catalago_tipo_envio",                                        []) as any)[0]; }

    getServiciosByEstatus(estatus: number): Promise<Servicio[] | null> { throw new Error("Method not implemented."); }
}