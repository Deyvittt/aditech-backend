import { GetContratosUseCase } from "../../application/GetContratosUseCase";
import { Request, Response } from "express";

export class GetContratosController {
    constructor(private getContratosUseCase: GetContratosUseCase) {}

    async run(req: Request, res: Response){
        try {

            const user = (req as any).user;


            const contratos = await this.getContratosUseCase.run(user);

            res.header('Cache-Control', 'Private, no-cache, no-store, must-revalidate', )

            if(!contratos){
                return res.status(200).json({ msg: 'Sin contratos', contratos: [] });
            }

            res.status(200).json({
                msg: 'Contratos encontrados',
                contratos: contratos
            });
        } catch (error: any) {
            res.status(500).json({ msg: 'Error interno', error: error.message });
        }
    }
}