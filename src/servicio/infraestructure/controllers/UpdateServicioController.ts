import { Request, Response } from "express";
import { UpdateServicioUseCase } from "../../application/UpdateServicioUseCase";

export class UpdateServicioController {
    constructor(readonly updateServicioUseCase: UpdateServicioUseCase) {}

    async run(req: Request, res: Response) {
        try {
            const servicioActualizado = await this.updateServicioUseCase.execute(req.params.id, req.body);
            if (servicioActualizado) {
                return res.status(200).json({ servicio: servicioActualizado });
            }
            res.status(404).json({ message: `No se encontró o no se pudo actualizar el servicio con ID ${req.params.id}.` });
        } catch (error) {
            console.error("Error en UpdateServicioController", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }
}