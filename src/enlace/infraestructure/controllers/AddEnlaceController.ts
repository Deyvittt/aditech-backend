import { Request, Response } from "express";
import { AddEnlaceUseCase } from "../../application/AddEnlaceUseCase";
import { Enlace } from "../../domain/Enlace";

export class AddEnlaceController {
    constructor(readonly addEnlaceUseCase: AddEnlaceUseCase) {}

    async run(req: Request, res: Response) {
        const data = req.body;

        try {
            // Creamos la instancia con los 12 argumentos obligatorios
            const enlace = new Enlace(
                data.nombre,
                data.apellidoP,
                data.apellidoM,
                data.correo,
                data.telefono,
                1, // Estatus default (Activo)
                data.adscripcion_id || null, // Puede ser null
                data.cargo_id,
                data.auth_user_id, // ID del usuario que crea
                1, // Tipo Persona default
                data.direccion_id,
                
                // --- ¡ESTE ES EL QUE FALTABA! ---
                data.dependencia_id 
                // --------------------------------
            );

            const createdEnlace = await this.addEnlaceUseCase.execute(enlace);

            if (createdEnlace) {
                return res.status(201).json({
                    status: "success",
                    data: createdEnlace,
                });
            } else {
                return res.status(500).json({
                    status: "error",
                    data: [],
                    message: "No se pudo crear el enlace en la base de datos.",
                });
            }
        } catch (error: any) {
            console.error("Error en AddEnlaceController:", error);
            return res.status(500).json({
                status: "error",
                message: "Ha ocurrido un error interno.",
                error: error.message,
            });
        }
    }
}