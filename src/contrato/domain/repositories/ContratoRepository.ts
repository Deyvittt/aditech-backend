import { Contrato } from "../entities/Contrato";
import { IctiTipos } from "../../../shared/domain/interfaces/IctiTipos";
import { ContratoDto } from "../entities/ContratoDto";
import { VersionContrato } from "../entities/VersionContrato";

export interface ContratoRepository {
    addContrato(contrato:Contrato):Promise<Contrato|null>;

    getContratosByEnlace(enlaceId:string):Promise<Contrato[]|null>;

    getContratos(user:any):Promise<Contrato[]|null>;

    getAllContratoDetallado(user:any):Promise<ContratoDto[]|null>;

    getContratoDetalladoById(contratoId:number):Promise<ContratoDto|null>;
    
    getAllContratoDetalladoByEnlace(enlaceId:string):Promise<ContratoDto[]|null>;

    getAllTipoInstalacion():Promise<IctiTipos[]|null>;

    getAllTipoContrato():Promise<IctiTipos[]|null>;

    getAllVersionContrato():Promise<VersionContrato[]|null>;

    getVersionesByTipoContratoId(tipoContratoId:string):Promise<VersionContrato[]|null>;

    updateContrato(contratoId:string, updateData:any):Promise<Contrato|null>;

    deleteContrato(contratoId:string):Promise<boolean>;
}