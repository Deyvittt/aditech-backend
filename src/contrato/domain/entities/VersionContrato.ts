export class VersionContrato{
    constructor(
        readonly id: string,
        readonly descripcion: string,
        readonly estatus: number,
        readonly tipoContratoId: number
    ){}
}