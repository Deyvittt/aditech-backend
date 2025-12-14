export class ContratoDto {
    constructor(
        readonly id: string,
        readonly nombreEnlace: string,
        readonly apellidoPEnlace: string,
        readonly apellidoMEnlace: string,
        readonly enlaceId: string,
        readonly estatus: number,
        readonly descripcion: string,
        readonly fechaContrato: Date,
        readonly versionContrato: string,
        //ubicacion o tambien llamado tipo de instalacion
        readonly ubicacion: string,
        readonly tipoContrato: string,
    ) {}
}