import { GetAllContratoDetalladoUseCase } from "../../application/GetAllContratoDetalladoUseCase";
import { Request, Response } from "express";

export class GetAllContratoDetalladoController {
    constructor(private getAllContratoDetalladoUseCase: GetAllContratoDetalladoUseCase) {}

    async run(req: Request, res: Response) {
        try {
            // 1. OBTENEMOS AL USUARIO (Igual que hicimos en Servicios)
            const user = (req as any).user;

            // 2. SE LO PASAMOS AL CASO DE USO (Aquí estaba el error)
            const contratos = await this.getAllContratoDetalladoUseCase.run(user);

            // 3. Anti-Caché (Para que si cambias de usuario se actualice en chinga)
            res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');

            if (!contratos) {
                // Mandamos array vacío en vez de error 404 para que la tabla se vea limpia
                return res.status(200).json({
                    msg: 'No se encontraron contratos',
                    contratos: [] 
                });
            }

            res.status(200).json({
                msg: 'Contratos encontrados',
                contratos: contratos
            });

        } catch (error: any) {
            console.error(error);
            res.status(500).json({
                msg: 'Contratos no encontrados',
                error: error.message
            });
        }
    }
}