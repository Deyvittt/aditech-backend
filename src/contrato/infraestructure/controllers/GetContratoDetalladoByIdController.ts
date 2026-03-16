import { Request, Response } from "express";
import { GetContratoDetalladoByIdUseCase } from "../../application/GetContratoDetalladoByIdUseCase"; 

export class GetContratoByIdController {
    constructor(readonly useCase: GetContratoDetalladoByIdUseCase) {}

    async run(req: Request, res: Response) {
        try {
            const contratoId = parseInt(req.params.id, 10);
            
            const contrato = await this.useCase.run(contratoId);

            if (contrato) {
                return res.status(200).json({ contrato });
            }
            res.status(404).json({ message: `No se encontró el contrato con ID ${contratoId}.` });
        } catch (error) {
            console.error("Error en GetContratoByIdController", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }
}