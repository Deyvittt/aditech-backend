export class Enlace {
    constructor(
        public nombre: string,
        public apellidoP: string,
        public apellidoM: string,
        public correo: string,
        public telefono: string,
        public estatus: number,
        public adscripcionId: number | null,
        public cargoId: number,
        public userId: number | null,
        public tipoPersonaId: number,
        public direccionId: number,
        public dependenciaId: number, 

        public id?: number 
    ) {}

    setId(id: number) {
        this.id = id;
    }
}