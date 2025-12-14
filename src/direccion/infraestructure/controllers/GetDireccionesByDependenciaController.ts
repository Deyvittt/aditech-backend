import { GetDireccionesByDependenciaUseCase } from "../../application/GetDireccionesByDependenciaUseCase";
import { Request, Response } from "express";

export class GetDireccionesByDependenciaController {
    constructor(private getDireccionesByDependenciaUseCase: GetDireccionesByDependenciaUseCase) {}

    async run(req: Request, res: Response){
        try {
            const dependenciaId: number = Number(req.params.dependenciaId);

            const direcciones = await this.getDireccionesByDependenciaUseCase.run(dependenciaId);

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