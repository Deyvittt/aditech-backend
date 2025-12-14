import { Request, Response } from "express";
import { GetServicioByIdUseCase } from "../../application/GetServicioByIdUseCase";

export class GetServicioByIdController {
    constructor(readonly getServicioByIdUseCase: GetServicioByIdUseCase) {}

    async run(req: Request, res: Response) {
        try {
            // CAMBIO: Convertimos el string a número con parseInt
            const id = parseInt(req.params.id);

            // Validación anti-tontos
            if (isNaN(id)) {
                return res.status(400).json({ error: "ID inválido" });
            }

            const servicio = await this.getServicioByIdUseCase.execute(id);

            if (servicio) {
                return res.status(200).json(servicio);
            }
            return res.status(404).json({ message: "Servicio no encontrado" });

        } catch (error) {
            console.error("Error en GetServicioByIdController:", error);
            return res.status(500).json({ error: "Error interno del servidor" });
        }
    }
}