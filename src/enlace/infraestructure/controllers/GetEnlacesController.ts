import { GetEnlacesUseCase } from "../../application/GetEnlacesUseCase";
import { Request, Response } from "express";

export class GetEnlacesController {
    constructor(private getEnlacesUseCase: GetEnlacesUseCase) {}

    async run(req: Request, res: Response){
        try {
            const enlaces = await this.getEnlacesUseCase.run();

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