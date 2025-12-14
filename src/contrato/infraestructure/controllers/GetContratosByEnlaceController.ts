import { GetContratosByEnlaceUseCase } from "../../application/GetContratosByEnlaceUseCase";
import { Request, Response } from "express";

export class GetContratosByEnlaceController {
    constructor(private getContratosByEnlaceUseCase: GetContratosByEnlaceUseCase) {}

    async run(req: Request, res: Response){
        const enlaceId: string = req.params.enlaceId;

        try {
            const contrato = await this.getContratosByEnlaceUseCase.run(enlaceId);

            if(!contrato){
                res.status(404).json({
                    msg: 'Contratos no encontrados'
                });
                return;
            }

            res.status(200).json({
                msg: 'Contratos encontrados',
                contratos: contrato
            });
        } catch (error: any) {
            res.status(404).json({
                msg: 'Contratos no encontrados',
                error: error.message
            });
        }
    }
}