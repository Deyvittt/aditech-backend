import { Direccion } from "./Direccion";

export interface DireccionRepository {
    getDirecciones(): Promise<Direccion[] | null>;
    getDireccionesByDependencia(dependenciaId: number): Promise<Direccion[] | null>;
    getDireccionById(direccionId: string): Promise<Direccion | null>;
}