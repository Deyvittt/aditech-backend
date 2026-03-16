import { UpdateContratoUseCase } from "../../application/UpdateContratoUseCase";
import { Request, Response } from "express";

export class UpdateContratoController {
    constructor(private updateContratoUseCase: UpdateContratoUseCase) {}

    async run(req: Request, res: Response){
        const contratoId: string = req.params.id; 

        const updateData: any = req.body;

        try {
            const contrato = await this.updateContratoUseCase.run(contratoId, updateData);

            if(!contrato || contrato === null){
                res.status(404).json({
                    msg: 'Contrato no actualizado o no encontrado'
                });
                return;
            }

            res.status(200).json({
                msg: 'Contrato actualizado',
                contrato: contrato
            });
        } catch (error: any) {
            res.status(500).json({
                msg: 'Error interno al actualizar el contrato',
                error: error.message
            });
        }
    }
}