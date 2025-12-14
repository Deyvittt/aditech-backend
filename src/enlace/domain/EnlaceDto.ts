export class EnlaceDto{
    constructor(
        readonly id: string,
        readonly nombre: string,
        readonly apellidoP: string,
        readonly apellidoM: string,
        readonly correo: string,
        readonly telefono: string,
        readonly estatus: string,
        readonly dependencia: string,
        readonly cargo: string,
        readonly direccion: string,
        //adscripcion o departamento
        readonly adscripcion: string,
    ){}
}