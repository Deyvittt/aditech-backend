import { Request, Response } from "express";
import { GetAllEstadoServicioUseCase } from "../../application/GetAllEstadoServicioUseCase";

export class GetAllEstadoServicioController {
    constructor(readonly getAllEstadoServicioUseCase: GetAllEstadoServicioUseCase) {}

    async run(req: Request, res: Response) {
        try {
            const estados = await this.getAllEstadoServicioUseCase.execute();
            if (estados) {
                return res.status(200).json({ estados });
            }
            res.status(404).json({ message: "No se encontraron estados de servicio." });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }
}   