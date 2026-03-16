import { GetAllContratoDetalladoUseCase } from "../../application/GetAllContratoDetalladoUseCase";
import { Request, Response } from "express";

export class GetAllContratoDetalladoController {
    constructor(private getAllContratoDetalladoUseCase: GetAllContratoDetalladoUseCase) {}

    async run(req: Request, res: Response) {
        try {
            const user = (req as any).user;

            const contratos = await this.getAllContratoDetalladoUseCase.run(user);

            res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');

            if (!contratos) {
                return res.status(200).json({
                    msg: 'No se encontraron contratos',
                    contratos: [] 
                });
            }

            res.status(200).json({
                msg: 'Contratos encontrados',
                contratos: contratos
            });

        } catch (error: any) {
            console.error(error);
            res.status(500).json({
                msg: 'Contratos no encontrados',
                error: error.message
            });
        }
    }
}