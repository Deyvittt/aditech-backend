import { GetVersionesByTipoContratoIdUseCase } from "../../application/GetVersionesByTipoContratoIdUseCase";
import { Request, Response } from "express";

export class GetVersionesByTipoContratoIdController {
    constructor(private getVersionesByTipoContratoIdUseCase: GetVersionesByTipoContratoIdUseCase) {}

    async run(req: Request, res: Response){
        const tipoContratoId: string = req.params.tipoContratoId;

        try {
            const versiones = await this.getVersionesByTipoContratoIdUseCase.run(tipoContratoId);

            if(!versiones){
                res.status(404).json({
                    msg: 'No se encontraron versiones de contrato'
                });
                return;
            }

            res.status(200).json({
                msg: 'Versiones de contrato encontradas',
                versiones: versiones
            });
        } catch (error: any) {
            res.status(404).json({
                msg: 'Versiones de contrato no encontradas',
                error: error.message
            });
        }
    }
}