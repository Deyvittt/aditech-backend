import { GetAllTipoContratoUseCase } from "../../application/GetAllTipoContratoUseCase";
import { Request, Response } from "express";

export class GetAllTipoContratoController {
    constructor(private getAllTipoContratoUseCase: GetAllTipoContratoUseCase) {}

    async run(req: Request, res: Response){
        try {
            const tipoContrato = await this.getAllTipoContratoUseCase.run();

            if(!tipoContrato){
                res.status(404).json({
                    msg: 'No se encontraron tipo de contratos'
                });
                return;
            }

            res.status(200).json({
                msg: 'Tipos de contrato encontrados',
                tipoContrato: tipoContrato
            });
        } catch (error: any) {
            res.status(404).json({
                msg: 'Tipos de contrato no encontrados',
                error: error.message
            });
        }
    }
}