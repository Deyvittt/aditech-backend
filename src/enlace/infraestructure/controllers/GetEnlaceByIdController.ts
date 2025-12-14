import { GetEnlaceByIdUseCase } from "../../application/GetEnlaceByIdUseCase";
import { Request, Response } from "express";

export class GetEnlaceByIdController {
    constructor(private getEnlaceByIdUseCase: GetEnlaceByIdUseCase) {}

    async run(req: Request, res: Response){
        const enlaceId: string = req.params.enlaceId;

        try {
            const enlace = await this.getEnlaceByIdUseCase.run(enlaceId);

            if(!enlace){
                res.status(404).json({
                    msg: 'Enlace no encontrado'
                });
                return;
            }

            res.status(200).json({
                msg: 'Enlace encontrado',
                enlace: enlace
            });
        } catch (error: any) {
            res.status(404).json({
                msg: 'Enlace no encontrado',
                error: error.message
            });
        }
    }
}