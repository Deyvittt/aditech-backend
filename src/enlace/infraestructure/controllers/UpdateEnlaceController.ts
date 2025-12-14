import { UpdateEnlaceUseCase } from "../../application/UpdateEnlaceUseCase";
import { Request, Response } from "express";

export class UpdateEnlaceController {
    constructor(private updateEnlaceUseCase: UpdateEnlaceUseCase) {}

    async run(req: Request, res: Response){
        const enlaceId: string = req.params.enlaceId;
        const updateData: any = req.body;

        try {
            const enlace = await this.updateEnlaceUseCase.run(enlaceId, updateData);

            if(!enlace || enlace === null){
                res.status(404).json({
                    msg: 'Enlace no actualizado o no encontrado'
                });
                return;
            }

            res.status(200).json({
                msg: 'Enlace actualizado',
                enlace: enlace
            });
        } catch (error: any) {
            res.status(404).json({
                msg: 'Enlace no actualizado',
                error: error.message
            });
        }
    }
}