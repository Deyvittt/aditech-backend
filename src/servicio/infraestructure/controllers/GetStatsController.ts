import { Request, Response } from "express";
import { GetStatsUseCase } from "../../application/GetStatsUseCase";

export class GetStatsController {
    constructor(readonly getStatsUseCase: GetStatsUseCase) {}

    async run(req: Request, res: Response) {
        try {
            const user = (req as any).user;

            // --- AGREGAR ESTO: Matar el caché ---
            res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
            res.header('Expires', '-1');
            res.header('Pragma', 'no-cache');
            // ------------------------------------

            console.log("--> Solicitando Dashboard para:", user.username, "| Depto:", user.departamento);

            const stats = await this.getStatsUseCase.execute(user);

            // Debug en consola para ver qué estamos enviando
            console.log("--> Datos enviados al frontend:", JSON.stringify(stats, null, 2));

            if (stats) {
                return res.status(200).json(stats);
            }
            return res.status(404).json({ message: "No se pudieron cargar las estadísticas" });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Error interno" });
        }
    }
}