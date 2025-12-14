import { Request, Response } from "express";
import { GetAllServiciosUseCase } from "../../application/GetAllServiciosUseCase";

export class GetAllServiciosController {
    constructor(readonly getAllServiciosUseCase: GetAllServiciosUseCase) {}

    async run(req: Request, res: Response) {
        try {
            const user = (req as any).user;
            const estatus = req.query.estatus ? parseInt(req.query.estatus as string) : null;
            
            const servicios = await this.getAllServiciosUseCase.execute(user, estatus);

            // --- ANTI-CACHÉ ---
            res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
            res.header('Expires', '-1');
            res.header('Pragma', 'no-cache');
            // ------------------

            return res.status(200).json({ 
                servicios: servicios || [] 
            });

        } catch (error) {
            console.error("Error en GetAllServiciosController", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }
}