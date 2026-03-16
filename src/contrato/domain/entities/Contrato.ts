export class Contrato {
    constructor(
        readonly enlaceId: string,
        readonly estatus: number,
        readonly descripcion: string,
        readonly fechaContrato: Date,
        readonly userId: number,
        readonly versionContratoId: number,
        readonly ubicacion: number,
        readonly tipoContratoId: number,
        readonly id?: string,
    ) {}
}