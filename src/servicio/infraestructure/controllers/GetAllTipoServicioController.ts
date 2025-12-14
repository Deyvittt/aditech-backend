import { Request, Response } from "express";
import { GetAllTipoServicioUseCase } from "../../application/GetAllTipoServicioUseCase";

export class GetAllTipoServicioController {
    constructor(readonly getAllTipoServicioUseCase: GetAllTipoServicioUseCase) {}

    async run(req: Request, res: Response) {
        try {
            const tipos = await this.getAllTipoServicioUseCase.execute();
            if (tipos) {
                return res.status(200).json({ tipos });
            }
            res.status(404).json({ message: "No se encontraron tipos de servicio." });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }
}