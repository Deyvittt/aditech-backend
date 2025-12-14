import { DeleteEnlaceUseCase } from "../../application/DeleteEnlaceUseCase";
import { Request, Response } from "express";

export class DeleteEnlaceController {
    constructor(private useCase: DeleteEnlaceUseCase) {}

    async run(req: Request, res: Response) {
        const enlaceId: string = req.params.enlaceId;

        try {
            const deleted = await this.useCase.run(enlaceId);

            if (!deleted) {
                res.status(404).json({
                    message: 'Enlace no encontrado'
                });
                return;
            }
            
            res.status(200).json({
                message: 'Enlace eliminado correctamente'
            });
        } catch (error: any) {
            res.status(400).json({
                message: 'Error al eliminar enlace',
                error: error.message
            });
        }
    }
}