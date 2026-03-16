import { Request, Response } from "express";
import { AddServicioUseCase } from "../../application/AddServicioUseCase";

export class AddServicioController { 
    constructor(readonly addServicioUseCase: AddServicioUseCase) {}

    async run(req: Request, res: Response) {
        console.log("--> Datos recibidos en el controlador:", req.body);

        try {
            const user = (req as any).user; 

            if (!user) {
                return res.status(401).json({ message: "Usuario no identificado." });
            }

            const dataToSave = {
                ...req.body,
                
                
                createdBy: user.idUsuario || user.id, 
                
                departamentoId: user.departamento 
            };
            
            console.log("--> AddServicioController - Usuario detectado:", user.username);
            console.log("--> AddServicioController - Departamento a guardar:", dataToSave.departamentoId);
            console.log("--> AddServicioController - Payload completo:", dataToSave);

            const nuevoServicio = await this.addServicioUseCase.execute(dataToSave); 
            
            if (nuevoServicio) {
                return res.status(201).json({ servicio: nuevoServicio });
            }
            
            return res.status(400).json({ message: "No se pudo crear el servicio." });

        } catch (error) {
            console.error("Error en AddServicioController:", error);
            return res.status(500).json({ 
                message: "Error interno del servidor",
                error: (error instanceof Error) ? error.message : "Error desconocido"
            });
        }
    }
}