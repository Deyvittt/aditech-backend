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

            // 2. PREPARAMOS LOS DATOS A GUARDAR
            // Mezclamos lo que viene del formulario con los datos automáticos del usuario
            const dataToSave = {
                ...req.body,
                
                // Inyectamos el ID del creador
                createdBy: user.idUsuario || user.id, 
                
                // Inyectamos el Departamento (ESTO ES LA CLAVE PARA QUE RÓMULO VEA LO SUYO)
                departamentoId: user.departamento 
            };
            
            console.log("--> AddServicioController - Usuario detectado:", user.username);
            console.log("--> AddServicioController - Departamento a guardar:", dataToSave.departamentoId);
            console.log("--> AddServicioController - Payload completo:", dataToSave);

            // 3. PASAMOS EL PAQUETE COMPLETO AL CASO DE USO
            // (Asegúrate de que en el Caso de Uso llames a 'addServicio' del repo)
            // (Nota: En tu código anterior del useCase llamabas a 'execute', aquí asumimos que es igual)
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