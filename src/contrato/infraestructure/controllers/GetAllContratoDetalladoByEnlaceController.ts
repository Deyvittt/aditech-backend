import { GetAllContratoDetalladoByEnlaceUseCase } from "../../application/GetAllContratoDetalladoByEnlaceUseCase";
import { Request, Response } from "express";

export class GetAllContratoDetalladoByEnlaceController {
    constructor(private getAllContratoDetalladoByEnlaceUseCase: GetAllContratoDetalladoByEnlaceUseCase) {}

    async run(req: Request, res: Response){
        try {
            const enlaceId: string = req.params.enlaceId;
            const allContratoDetallado = await this.getAllContratoDetalladoByEnlaceUseCase.run(enlaceId);

            if(!allContratoDetallado){
                res.status(404).json({
                    msg: 'No se encontraron contratos'
                });
                return;
            }

            res.status(200).json({
                msg: 'Contratos encontrados',
                contrato: allContratoDetallado
            });
        } catch (error: any) {
            res.status(404).json({
                msg: 'Contratos no encontrados',
                error: error.message
            });
        }
    }
}