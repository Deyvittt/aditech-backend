import { Request, Response } from "express";
import { GetAllTipoActividadUseCase } from "../../application/GetAllTipoActividadUseCase";

export class GetAllTipoActividadController {
    constructor(readonly getAllTipoActividadUseCase: GetAllTipoActividadUseCase) {}

    async run(req: Request, res: Response) {
        try {
            const tipos = await this.getAllTipoActividadUseCase.execute();
            if (tipos) {
                return res.status(200).json({ tipos });
            }
            res.status(404).json({ message: "No se encontraron tipos de actividad." });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }
}