import { Request, Response } from "express";
import { DeleteServicioUseCase } from "../../application/DeleteServicioUseCase";

export class DeleteServicioController {
    constructor(private readonly deleteServicioUseCase: DeleteServicioUseCase) {}

    async run(req: Request, res: Response) {
        const { id } = req.params;
        try {
            const success = await this.deleteServicioUseCase.run(id);
            
            if (success) {
                return res.status(200).json({ message: "Servicio eliminado correctamente (Lógico)" });
            } else {
                return res.status(404).json({ 
                    message: "No se encontró el servicio o no se pudo eliminar" 
                });
            }
        } catch (error) {
            console.error("Error en DeleteServicioController:", error);
            return res.status(500).json({ 
                error: "Error interno del servidor al eliminar servicio" 
            });
        }
    }
}