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
        readonly ubicacion: string,
        readonly tipoContrato: string,
    ) {}
}