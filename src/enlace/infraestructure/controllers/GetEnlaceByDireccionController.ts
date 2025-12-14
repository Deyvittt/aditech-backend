import { Request, Response } from "express";
import { GetEnlaceByDireccionUseCase } from "../../application/GetEnlaceByDireccionUseCase";

export class GetEnlaceByDireccionController {
    constructor(readonly getEnlaceByDireccionUseCase: GetEnlaceByDireccionUseCase) {}

    async run(req: Request, res: Response) {
        try {
            const direccionId = parseInt(req.params.id, 10);
            const enlace = await this.getEnlaceByDireccionUseCase.execute(direccionId);

            if (enlace) {
                return res.status(200).json({ enlace });
            }
            res.status(404).json({ message: `No se encontró un enlace para la dirección con ID ${direccionId}.` });
        } catch (error) {
            console.error("Error en GetEnlaceByDireccionController", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }
}