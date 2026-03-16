import { GetCargosUseCase } from "../../application/GetCargosUseCase";
import { Request, Response } from "express";

export class GetCargosController {
    constructor(readonly getCargosUseCase: GetCargosUseCase) {}

    async run(req: Request, res: Response) {
        try {
            const cargos = await this.getCargosUseCase.execute();

            if (cargos) {
                return res.status(200).json({ cargos });
            }

            res.status(404).json({ message: 'No se encontraron cargos' });

        } catch (error: any) {
            console.error("Error en GetCargosController:", error);
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    }
}