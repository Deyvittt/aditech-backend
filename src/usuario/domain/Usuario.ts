import { UsuarioDto } from "./UsuarioDto"; // ← AGREGAR ESTA LÍNEA

export class Usuario {
    constructor(
        public readonly idUsuario: number,
        public readonly nombre: string,
        public readonly apellidoP: string,
        public readonly apellidoM: string,
        public readonly correo: string,
        public readonly telefono: string,
        public readonly cargoAdministrativo: number,
        public readonly departamento: number,
        private password: string,
        public readonly username: string,
        public readonly createdBy: string | null,
        public readonly updatedBy: string | null,
        public readonly rol: string
    ) {}

    public getPassword(): string {
        return this.password;
    }

    public setPassword(newPassword: string): void {
        this.password = newPassword;
    }

    public toDto(): UsuarioDto {
        return new UsuarioDto(
            this.idUsuario,
            this.nombre,
            this.apellidoP,
            this.apellidoM,
            this.correo,
            this.telefono,
            this.cargoAdministrativo,
            this.departamento,
            this.username,
            this.createdBy,
            this.updatedBy,
            this.rol
        );
    }
}