export class Contrato {
    constructor(
        readonly enlaceId: string,
        readonly estatus: number,
        readonly descripcion: string,
        readonly fechaContrato: Date,
        readonly userId: number,
        readonly versionContratoId: number,
        //hace referencia al tipo de instalacion (tabla de tipos de instalacion)
        readonly ubicacion: number,
        readonly tipoContratoId: number,
        readonly id?: string,
    ) {}
}