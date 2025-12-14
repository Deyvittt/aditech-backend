import { GetAllTipoInstalacionUseCase } from "../../application/GetAllTipoInstalacionUseCase";
import { Request, Response } from "express";

export class GetAllTipoInstalacionController {
    constructor(private getAllTipoInstalacionUseCase: GetAllTipoInstalacionUseCase) {}

    async run(req: Request, res: Response){
        try {
            const tipoInstalacion = await this.getAllTipoInstalacionUseCase.run();

            if(!tipoInstalacion){
                res.status(404).json({
                    msg: 'No se encontraron tipo de instalaciones'
                });
                return;
            }

            res.status(200).json({
                msg: 'Tipos de instalación encontrados',
                tipoInstalacion: tipoInstalacion
            });
        } catch (error: any) {
            res.status(404).json({
                msg: 'Tipos de instalación no encontrados',
                error: error.message
            });
        }
    }
}