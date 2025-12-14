import { Request, Response } from "express";
import { GetEnlaceCompletoByIdUseCase } from "../../application/GetEnlaceCompletoByIdUseCase";

export class GetEnlaceCompletoByIdController {
    constructor(readonly useCase: GetEnlaceCompletoByIdUseCase) {}

    async run(req: Request, res: Response) {
        try {
            const enlaceId = parseInt(req.params.id, 10);
            const enlace = await this.useCase.execute(enlaceId);

            if (enlace) {
                return res.status(200).json({ enlace });
            }
            res.status(404).json({ message: `No se encontró el enlace completo con ID ${enlaceId}.` });
        } catch (error) {
            console.error("Error en GetEnlaceCompletoByIdController", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }
}