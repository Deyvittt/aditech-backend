export class Enlace {
    constructor(
        public nombre: string,
        public apellidoP: string,
        public apellidoM: string,
        public correo: string,
        public telefono: string,
        public estatus: number,
        public adscripcionId: number | null, // Puede ser null
        public cargoId: number,
        public userId: number | null,
        public tipoPersonaId: number,
        public direccionId: number,
        
        // --- ¡ESTE ES EL QUE FALTABA! ---
        public dependenciaId: number, 
        // ---------------------------------

        public id?: number // El ID es opcional porque al crear no existe aún
    ) {}

    setId(id: number) {
        this.id = id;
    }
}