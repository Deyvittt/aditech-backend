import { Servicio } from "./Servicio";

export interface ServicioRepository {
    
    getStats(user:any): Promise<any>;

    getServicios(user: any, filtroEstado?: number | null): Promise<Servicio[] | null>;
    
    getServicioById(id: number): Promise<Servicio | null>;
    addServicio(servicio: any): Promise<Servicio | null>;
    updateServicio(servicioId: string, updateData: any): Promise<Servicio | null>;
    deleteServicio(id: string): Promise<boolean>;
    
    getServiciosByEstatus(estatus: number): Promise<Servicio[] | null>;
    getServicioParaFormulario(id: string): Promise<Servicio | null>;
    
    getAllTipoServicio(): Promise<any[] | null>;
    getAllTipoActividad(): Promise<any[] | null>;
    getAllEstadoServicio(): Promise<any[] | null>;
    getAllUbicaciones(): Promise<any[] | null>;
    getAllTiposEnvio(): Promise<any[] | null>;
}