import { Request, Response } from "express";
import { GetServicioParaFormularioUseCase } from "../../application/GetServicioParaFormularioUseCase"; 

export class GetServicioParaFormularioController {
    
    constructor(
        private readonly getServicioParaFormularioUseCase: GetServicioParaFormularioUseCase
    ) {}

    async run(req: Request, res: Response) {
        try {
            const { id } = req.params;
            
            const servicio = await this.getServicioParaFormularioUseCase.execute(id); 

            if (servicio) {
                return res.status(200).json(servicio); 
            }
            res.status(404).json({ message: `No se encontró el servicio con ID ${id}.` });
        } catch (error) {
            console.error("Error en GetServicioParaFormularioController", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }
}