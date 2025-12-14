import { GetAllEnlaceDetalladoUseCase } from "../../application/GetAllEnlaceDetalladoUseCase";
import { Request, Response } from "express";

export class GetAllEnlaceDetalladoController {
    constructor(private getAllEnlaceDetalladoUseCase: GetAllEnlaceDetalladoUseCase) {}

    async run(req: Request, res: Response){
        try {
            const enlaces = await this.getAllEnlaceDetalladoUseCase.run();

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