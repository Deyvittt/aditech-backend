export class UsuarioDto {
    constructor(
        public readonly idUsuario: number,
        public readonly nombre: string,
        public readonly apellidoP: string,
        public readonly apellidoM: string,
        public readonly correo: string,
        public readonly telefono: string,
        public readonly cargoAdministrativo: number,
        public readonly departamento: number,
        public readonly username: string,
        public readonly createdBy: string | null,
        public readonly updatedBy: string | null,
        public readonly rol: string
    ) {}
}