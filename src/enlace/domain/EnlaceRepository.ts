import { Enlace } from "./Enlace";
import { EnlaceCompletoDto } from "./EnlaceCompletoDto";

export interface EnlaceRepository {
    addEnlace(enlace: Enlace): Promise<Enlace | null>;
    getEnlaces(): Promise<Enlace[] | null>;
    getEnlaceById(id: string): Promise<Enlace | null>;
    updateEnlace(id: string, enlace: any): Promise<Enlace | null>;
    deleteEnlace(id: string): Promise<boolean>;
    
    getEnlacesByEstatus(estatus: number): Promise<Enlace[] | null>;
    getEnlaceCompletoById(id: number): Promise<EnlaceCompletoDto | null>;
    getAllEnlaceDetallado(): Promise<any[] | null>;
    getEnlaceByDireccion(direccionId: number): Promise<any | null>;
}