import { IctiTipos } from "../../../shared/domain/interfaces/IctiTipos";

export class TipoContrato implements IctiTipos {
    constructor(
        readonly id: number,
        readonly nombre: string,
        readonly estatus: string
    ) {}
}