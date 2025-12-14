// En: src/dependencia/infrastructure/controllers/GetDependenciasController.ts

import { GetDependenciasUseCase } from "../../application/GetDependenciasUseCase";
import { Request, Response } from "express";

export class GetDependenciasController {
    constructor(readonly getDependenciasUseCase: GetDependenciasUseCase) {}

    async run(req: Request, res: Response){
        try {
            const dependencias = await this.getDependenciasUseCase.execute();

            if(dependencias && dependencias.length > 0){
                return res.status(200).json({ dependencias });
            }
            
            res.status(404).json({ message: 'No se encontraron dependencias' });

        } catch (error: any) {
            console.error("Error en GetDependenciasController:", error);
            res.status(500).json({
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }
}