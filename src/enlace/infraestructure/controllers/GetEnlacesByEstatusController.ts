import { GetEnlacesByEstatusUseCase } from "../../application/GetEnlacesByEstatusUseCase";
import { Request, Response } from "express";

export class GetEnlacesByEstatusController {
    constructor(private getEnlacesByEstatusUseCase: GetEnlacesByEstatusUseCase) {}

    async run(req: Request, res: Response){
        const estatusId: string = req.params.estatusId;

        try {
            const enlaces = await this.getEnlacesByEstatusUseCase.run(parseInt(estatusId));

            if(!enlaces){
                res.status(404).json({
                    msg: 'No se encontraron enlaces'
                });
                return;
            }

            res.status(200).json({
                msg: 'Enlaces encontrados',
                enlaces: enlaces
            });
        } catch (error: any) {
            res.status(404).json({
                msg: 'Enlaces no encontrados',
                error: error.message
            });
        }
    }
}