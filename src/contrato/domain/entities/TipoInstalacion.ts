import { IctiTipos } from "../../../shared/domain/interfaces/IctiTipos";

export class TipoInstalacion implements IctiTipos {
    constructor(
        readonly id: number,
        readonly nombre: string,
        readonly estatus: string
    ) {}
}