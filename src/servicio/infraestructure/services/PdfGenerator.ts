import { PDFDocument, StandardFonts, rgb, PDFFont, PageSizes, PDFPage } from 'pdf-lib';
import * as fs from 'fs';
import * as path from 'path';

// Helper para texto seguro
const safeText = (text: any, fallback = '') => String(text || fallback).trim();

const COLORS = {
    headerBg: rgb(0.502, 0.094, 0.141),
    sectionBg: rgb(0.941, 0.941, 0.941),
    darkText: rgb(0, 0, 0),
    lightText: rgb(0.3, 0.3, 0.3),
    border: rgb(0.4, 0.4, 0.4),
};

// --- Helpers de Dibujo ---
function drawFilledBox(page: PDFPage, x: number, y: number, w: number, h: number, color: any, borderColor: any = COLORS.border) {
    // Eliminé el parámetro extra para evitar errores, usa el default
    page.drawRectangle({ x, y, width: w, height: h, color, borderColor, borderWidth: 0.5 });
}

function drawCheckbox(page: PDFPage, x: number, y: number, label: string, checked: boolean, font: PDFFont, bold: PDFFont) {
    page.drawRectangle({ x, y: y - 10, width: 12, height: 12, borderColor: COLORS.darkText, borderWidth: 1, color: rgb(1, 1, 1) });
    if (checked) page.drawText('X', { x: x + 2.5, y: y - 8, font: bold, size: 10, color: COLORS.darkText });
    page.drawText(label, { x: x + 18, y: y - 8, font, size: 8.5, color: COLORS.darkText });
}

function drawMultilineText(page: PDFPage, text: string, x: number, y: number, maxWidth: number, font: PDFFont) {
    const words = text.split(' ');
    let currentLine = '';
    let currentY = y;
    
    for (const word of words) {
        const testLine = currentLine + (currentLine ? ' ' : '') + word;
        const width = font.widthOfTextAtSize(testLine, 9);
        if (width > maxWidth && currentLine !== '') {
            page.drawText(currentLine, { x, y: currentY, font, size: 9, color: COLORS.darkText });
            currentLine = word;
            currentY -= 12;
        } else {
            currentLine = testLine;
        }
    }
    page.drawText(currentLine, { x, y: currentY, font, size: 9, color: COLORS.darkText });
}

// --- CLASE GENERADORA ---
export class PdfGenerator {
    public static async generate(s: any): Promise<Uint8Array> {
        console.log("📄 Creando PDF para:", s.folio);
        
        const doc = await PDFDocument.create();
        const page = doc.addPage(PageSizes.Letter);
        const { width, height } = page.getSize();
        const margin = 45;
        const contentW = width - 2 * margin;

        const font = await doc.embedFont(StandardFonts.Helvetica);
        const bold = await doc.embedFont(StandardFonts.HelveticaBold);
        const italic = await doc.embedFont(StandardFonts.HelveticaOblique);

        let y = height - 30;

        // 1. LOGOS (Intento seguro)
        try {
            const logoAdt = path.resolve(process.cwd(), 'assets', 'logo_adt.png');
            const logoGob = path.resolve(process.cwd(), 'assets', 'logo_gob.png');
            
            if (fs.existsSync(logoAdt)) {
                const img = await doc.embedPng(fs.readFileSync(logoAdt));
                page.drawImage(img, { x: margin, y: y - 35, width: 110, height: 35 });
            }
            if (fs.existsSync(logoGob)) {
                const img = await doc.embedPng(fs.readFileSync(logoGob));
                page.drawImage(img, { x: width - margin - 110, y: y - 35, width: 110, height: 35 });
            }
        } catch (e) { console.log("Logos no cargados, continuando..."); }

        y -= 45;

        // ENCABEZADO
        drawFilledBox(page, margin, y - 25, contentW, 25, COLORS.headerBg, COLORS.headerBg);
        page.drawText('DIRECCIÓN DE INFRAESTRUCTURA TECNOLÓGICA Y TELECOMUNICACIONES', { x: margin + 8, y: y - 10, font: bold, size: 7.5, color: rgb(1,1,1) });
        page.drawText('HUMANISMO QUE TRANSFORMA', { x: width - margin - 145, y: y - 22, font: italic, size: 8.5, color: rgb(1,1,1) });

        y -= 35;
        const title = 'REPORTE DE SERVICIO';
        page.drawText(title, { x: (width - bold.widthOfTextAtSize(title, 18)) / 2, y, font: bold, size: 18, color: COLORS.headerBg });

        y -= 35;
        // Folio
        drawFilledBox(page, width - margin - 130, y - 28, 130, 28, COLORS.sectionBg);
        page.drawText(`FOLIO: ${safeText(s.folio)}`, { x: width - margin - 118, y: y - 18, font: bold, size: 12, color: COLORS.headerBg });

        y -= 40;
        // Info General
        drawFilledBox(page, margin, y - 75, contentW, 75, rgb(1,1,1));
        const lblX = margin + 12, valX = margin + 110;
        
        page.drawText('DEPENDENCIA:', { x: lblX, y: y - 18, font: bold, size: 9.5 });
        page.drawText(safeText(s.dependencia || 'Universidad Politécnica de Chiapas'), { x: valX, y: y - 18, font, size: 9.5, color: COLORS.lightText });
        
        page.drawText('SOLICITANTE:', { x: lblX, y: y - 40, font: bold, size: 9.5 });
        page.drawText(safeText(s.nombreSolicitante), { x: valX, y: y - 40, font, size: 9.5, color: COLORS.lightText });
        
        page.drawText('CARGO:', { x: lblX, y: y - 62, font: bold, size: 9.5 });
        page.drawText(safeText(s.cargo || 'Jefe de Departamento'), { x: valX, y: y - 62, font, size: 9.5, color: COLORS.lightText });

        y -= 87;
        // Tabla Fechas
        drawFilledBox(page, margin, y - 18, contentW, 18, COLORS.sectionBg);
        const colW = contentW / 4;
        ['INICIO', 'TÉRMINO', 'ENVÍO', 'UBICACIÓN'].forEach((h, i) => {
            page.drawText(h, { x: margin + i * colW + 15, y: y - 12, font: bold, size: 9 });
        });

        drawFilledBox(page, margin, y - 50, contentW, 32, rgb(1,1,1));
        const dateStr = (d: any) => d ? new Date(d).toLocaleDateString('es-MX') : 'N/A';
        
        // Datos Tabla
        let dy = y - 30;
        // Col 1
        page.drawText('FECHA: ' + dateStr(s.fechaInicio), { x: margin + 5, y: dy, font, size: 8 });
        page.drawText('HORA: ' + safeText(s.horaInicio), { x: margin + 5, y: dy - 10, font, size: 8 });
        // Col 2
        page.drawText('FECHA: ' + dateStr(s.fechaTermino), { x: margin + colW + 5, y: dy, font, size: 8 });
        page.drawText('HORA: ' + safeText(s.horaTermino), { x: margin + colW + 5, y: dy - 10, font, size: 8 });
        // Col 3 (Envio)
        page.drawText(safeText(s.tipoEnvio || s.tipoEnvioNombre), { x: margin + colW * 2 + 5, y: dy - 5, font, size: 8 });
        // Col 4 (Dirección) - Aquí usamos el nombre si existe
        page.drawText(safeText(s.direccion || s.direccionNombre), { x: margin + colW * 3 + 5, y: dy - 5, font, size: 8 });

        y -= 68;
        // Checkboxes Servicios
        drawFilledBox(page, margin, y - 48, contentW, 48, COLORS.sectionBg);
        page.drawText('TIPO DE SERVICIO', { x: margin + 8, y: y - 12, font: bold, size: 10 });
        
        y -= 24;
        let cx = margin + 12;
        // Buscamos coincidencia en el nombre (Flexible)
        const currentService = safeText(s.tipoServicio || s.tipoServicioNombre).toUpperCase();
        
        ['ASESORIA', 'AUDITORIA', 'MANTENIMIENTO FÍSICO', 'INFRAESTRUCTURA', 
         'SERVICIOS DIGITALES', 'MANTENIMIENTO DE PANELES', 'SUPERVISIÓN A INFRAESTRUCTURA'].forEach((srv, i) => {
            if (i === 4) { y -= 20; cx = margin + 12; }
            
            // Lógica de match flexible (elimina acentos para comparar)
            const cleanSrv = srv.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            const cleanCur = currentService.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            const checked = cleanCur.includes(cleanSrv) || cleanSrv.includes(cleanCur);
            
            drawCheckbox(page, cx, y, srv, checked, font, bold);
            cx += contentW / 4;
        });

        y -= 32;
        // Descripciones
        const drawSection = (title: string, content: string) => {
            drawFilledBox(page, margin, y - 18, contentW, 18, COLORS.sectionBg);
            page.drawText(title, { x: margin + 8, y: y - 12, font: bold, size: 9.5 });
            drawFilledBox(page, margin, y - 60, contentW, 42, rgb(1,1,1));
            drawMultilineText(page, safeText(content), margin + 5, y - 30, contentW - 10, font);
            y -= 68;
        };

        drawSection('DESCRIPCIÓN DE LA FALLA Y/O PROBLEMA', s.descripcionFalla);
        drawSection('DESCRIPCIÓN DE LA ACTIVIDAD REALIZADA', s.descripcionActividad);

        y -= 15;
        // Estado
        drawFilledBox(page, margin, y - 20, contentW, 20, COLORS.sectionBg);
        page.drawText('ESTADO DEL SERVICIO:', { x: margin + 12, y: y - 10, font: bold, size: 9.5 });
        const st = safeText(s.estadoServicio).toUpperCase();
        drawCheckbox(page, margin + 150, y - 2, 'CONCLUIDO', st.includes('CONCLUIDO'), font, bold);
        drawCheckbox(page, margin + 260, y - 2, 'EN SEGUIMIENTO', st.includes('SEGUIMIENTO'), font, bold);

        // Fotos
        page.drawText('FOTOS:', { x: width - margin - 120, y: y - 10, font: bold, size: 9.5 });
        const hasPhotos = s.fotos && s.fotos.length > 2;
        drawCheckbox(page, width - margin - 75, y - 2, 'SI', !!hasPhotos, font, bold);
        drawCheckbox(page, width - margin - 35, y - 2, 'NO', !hasPhotos, font, bold);

        y -= 28;
        // Observaciones
        drawSection('OBSERVACIONES', s.observaciones);

        // Firmas
        const fy = 90;
        page.drawLine({ start: { x: margin + 15, y: fy }, end: { x: margin + 215, y: fy }, thickness: 1 });
        page.drawText('RESPONSABLE DEL SERVICIO', { x: margin + 35, y: fy - 15, font: bold, size: 8 });
        // Nombre Receptor Real
        page.drawText(safeText(s.nombreReceptor), { x: margin + 50, y: fy - 28, font, size: 8, color: COLORS.lightText });

        const fx = width - margin - 215;
        page.drawLine({ start: { x: fx, y: fy }, end: { x: fx + 200, y: fy }, thickness: 1 });
        page.drawText('RECEPTOR DE LA DEPENDENCIA', { x: fx + 20, y: fy - 15, font: bold, size: 8 });
        // Nombre Solicitante Real
        page.drawText(safeText(s.nombreSolicitante), { x: fx + 35, y: fy - 28, font, size: 8, color: COLORS.lightText });

        // Sello
        const sx = (width - 110) / 2;
        page.drawText('SELLO', { x: sx + 42, y: fy + 8, font: bold, size: 9.5 });
        drawFilledBox(page, sx, fy - 42, 110, 48, rgb(1,1,1), COLORS.border); // <--- AQUI ESTABA EL ERROR DEL 1.5 (QUITADO)

        return await doc.save();
    }
}

// Exportación correcta
export const generateServicePDF = async (servicio: any) => {
    return await PdfGenerator.generate(servicio);
};