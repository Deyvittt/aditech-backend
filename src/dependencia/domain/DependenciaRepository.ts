import { Dependencia } from "./Dependencia";

export interface DependenciaRepository {
    getDependencias(): Promise<Dependencia[] | null>;
    getDependenciaByDireccionId(direccionId: string): Promise<Dependencia | null>;
}