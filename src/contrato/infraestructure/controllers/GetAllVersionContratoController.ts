import { GetAllVersionContratoUseCase } from "../../application/GetAllVersionContratoUseCase";
import { Request, Response } from "express";

export class GetAllVersionContratoController {
    constructor(private getAllVersionContratoUseCase: GetAllVersionContratoUseCase) {}

    async run(req: Request, res: Response){
        try {
            const versionContrato = await this.getAllVersionContratoUseCase.run();

            if(!versionContrato){
                res.status(404).json({
                    msg: 'No se encontraron versiones de contrato'
                });
                return;
            }

            res.status(200).json({
                msg: 'Versiones de contrato encontradas',
                versionContrato: versionContrato
            });
        } catch (error: any) {
            res.status(404).json({
                msg: 'Versiones de contrato no encontradas',
                error: error.message
            });
        }
    }
}