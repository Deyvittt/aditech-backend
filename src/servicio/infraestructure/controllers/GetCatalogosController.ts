import { Request, Response } from "express";
import { GetAllUbicacionesUseCase } from "../../application/GetAllUbicacionesUseCase";
import { GetAllTiposEnvioUseCase } from "../../application/GetAllTiposEnvioUseCase";

export class GetCatalogosController {
    constructor(
        readonly getAllUbicacionesUseCase: GetAllUbicacionesUseCase,
        readonly getAllTiposEnvioUseCase: GetAllTiposEnvioUseCase
    ) {}

    async getUbicaciones(req: Request, res: Response) {
        try {
            const ubicaciones = await this.getAllUbicacionesUseCase.execute();
            if (ubicaciones) {
                return res.status(200).json({ ubicaciones });
            }
            res.status(404).json({ message: "No se encontraron ubicaciones." });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    async getTiposEnvio(req: Request, res: Response) {
        try {
            const tiposEnvio = await this.getAllTiposEnvioUseCase.execute();
            if (tiposEnvio) {
                return res.status(200).json({ tiposEnvio });
            }
            res.status(404).json({ message: "No se encontraron tipos de envío." });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }
}