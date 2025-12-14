import { EnlaceDto } from "./EnlaceDto";

// Define la subclase
export class EnlaceCompletoDto extends EnlaceDto {
    constructor(
        readonly dependenciaId: string,
        readonly cargoId: string,
        readonly direccionId: string,
        //o tambien llamado departamento
        readonly adscripcionId: string,
        readonly tipoPersonaId: string,
        readonly userId: string,
        id: string,
        nombre: string,
        apellidoP: string,
        apellidoM: string,
        correo: string,
        telefono: string,
        estatus: string,
        dependencia: string,
        cargo: string,
        direccion: string,
        adscripcion: string,
    ) {
        super(id, nombre, apellidoP, apellidoM, correo, telefono, estatus, dependencia, cargo, direccion, adscripcion);
    }
}