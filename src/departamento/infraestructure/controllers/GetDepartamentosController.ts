import { GetDepartamentosUseCase } from "../../application/GetDepartamentosUseCase";
import { Request, Response } from "express";

export class GetDepartamentosController {
    constructor(private getDepartamentosUseCase: GetDepartamentosUseCase) {}

    async run(req: Request, res: Response){
        try {
            const departamentos = await this.getDepartamentosUseCase.run();

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