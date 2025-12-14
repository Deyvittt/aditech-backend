import { GetDireccionesUseCase } from "../../application/GetDireccionesUseCase";
import { Request, Response } from "express";

export class GetDireccionesController {
    constructor(private getDireccionesUseCase: GetDireccionesUseCase) {}

    async run(req: Request, res: Response){
        try {
            const direcciones = await this.getDireccionesUseCase.run();

            if(!direcciones){
                res.status(404).json({
                    msg: 'No se encontraron direcciones'
                });
                return;
            }

            res.status(200).json({
                msg: 'Direcciones encontradas',
                direcciones: direcciones
            });
        } catch (error: any) {
            res.status(404).json({
                msg: 'Direcciones no encontradas',
                error: error.message
            });
        }
    }
}