export interface Servicio {
    id: number;
    folio: string;
    nombreSolicitante: string;
    nombreReceptor: string;
    fechaInicio: Date;
    fechaTermino: Date;
    horaInicio: string;
    horaTermino: string;
    descripcionFalla: string;
    descripcionActividad: string;
    nivel: string;
    fotos: number | string;
    observaciones: string;
    tipoEnvio: string;
    estatus: number;
    
    // Propiedades que vienen de las tablas relacionadas (JOINs)
    tipoServicio: string;
    codigoServicio?: string;
    contratoId: number;
    tipoActividad: string;
    estadoServicio: string;
    direccion: string;
    dependencia: string;
    cargo: string;
    
    // IDs para los formularios
    dependenciaId?: number;
    direccionId?: number;
    cargoId?: number;
    
    // Campos de auditoría
    createdBy?: number;
    updatedBy?: number;
    createdAt?: Date;
    updatedAt?: Date;
}