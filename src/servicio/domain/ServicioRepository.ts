import { Servicio } from "./Servicio";

export interface ServicioRepository {
    
    // --- Métodos Principales ---
    getStats(user:any): Promise<any>;

    // Este fue el cambio clave: aceptar 'user' y 'filtroEstado'
    getServicios(user: any, filtroEstado?: number | null): Promise<Servicio[] | null>;
    
    getServicioById(id: number): Promise<Servicio | null>;
    addServicio(servicio: any): Promise<Servicio | null>;
    updateServicio(servicioId: string, updateData: any): Promise<Servicio | null>;
    deleteServicio(id: string): Promise<boolean>;
    
    // --- Métodos Auxiliares / Legacy ---
    getServiciosByEstatus(estatus: number): Promise<Servicio[] | null>;
    getServicioParaFormulario(id: string): Promise<Servicio | null>;
    
    // --- Catálogos ---
    getAllTipoServicio(): Promise<any[] | null>;
    getAllTipoActividad(): Promise<any[] | null>;
    getAllEstadoServicio(): Promise<any[] | null>;
    getAllUbicaciones(): Promise<any[] | null>;
    getAllTiposEnvio(): Promise<any[] | null>;
}