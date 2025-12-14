import { Request, Response } from 'express';
import { GetServicioByIdUseCase } from '../../application/GetServicioByIdUseCase';
// Importamos la función exportada del archivo generator
import { generateServicePDF } from '../services/PdfGenerator'; 

export class GetPdfController {
    constructor(
        readonly getServicioByIdUseCase: GetServicioByIdUseCase
    ) {}

    async run(req: Request, res: Response) {
        try {
            const servicioId = parseInt(req.params.id);

            if (isNaN(servicioId)) {
                return res.status(400).json({ error: "ID de servicio inválido" });
            }

            const servicio = await this.getServicioByIdUseCase.execute(servicioId);

            if (!servicio){
                return res.status(404).json({ error: "Servicio no encontrado" });
            }

            // 1. Generamos el array de bytes
            const pdfBytes = await generateServicePDF(servicio);

            // 2. ¡OJO! Lo convertimos a Buffer. ESTO ARREGLA EL ARCHIVO ROTO.
            const pdfBuffer = Buffer.from(pdfBytes);

            res.setHeader("Content-Type", "application/pdf");
            res.setHeader("Content-Length", pdfBuffer.length);
            res.setHeader(
                "Content-Disposition",
                `attachment; filename=reporte_servicio_${servicio.folio}.pdf`
            );
            
            // 3. Enviamos el Buffer
            res.send(pdfBuffer);

        } catch (error) {
            console.error("Error en GetPdfController:", error);
            if(!res.headersSent) {
                res.status(500).json({ error: "Error interno al generar el PDF" });
            }
        }
    }
}