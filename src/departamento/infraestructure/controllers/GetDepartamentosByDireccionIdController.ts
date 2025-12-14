import { GetDepartamentosByDireccionIdUseCase } from "../../application/GetDepartamentosByDireccionIdUseCase";
import { Request, Response } from "express";

export class GetDepartamentosByDireccionIdController {
    constructor(private getDepartamentosByDireccionIdUseCase: GetDepartamentosByDireccionIdUseCase) {}

    async run(req: Request, res: Response){
        try {
            const direccionId = Number(req.params.direccionId);
            const departamentos = await this.getDepartamentosByDireccionIdUseCase.run(direccionId);

            if(!departamentos){
                res.status(404).json({
                    msg: 'No se encontraron departamentos'
                });
                return;
            }

            res.status(200).json({
                msg: 'Departamentos encontrados',
                departamentos: departamentos
            });
        } catch (error: any) {
            res.status(404).json({
                msg: 'Departamentos no encontrados',
                error: error.message
            });
        }
    }
}