import { Request, Response } from "express";
import { GetAllUsuariosUseCase } from "../../application/GetAllUsuariosUseCase";

export class GetAllUsuariosController {
   constructor(private readonly getAllUsuariosUseCase: GetAllUsuariosUseCase) {}

    async run(req: Request, res: Response) {
        try {
            const usuarios = await this.getAllUsuariosUseCase.execute();
            res.status(200).json(usuarios); 
        } catch (error) {
            console.error("Error en GetAllUsuariosController:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }
}