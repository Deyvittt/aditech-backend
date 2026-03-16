import { PDFDocument, StandardFonts, rgb, PDFFont, PageSizes, PDFPage } from 'pdf-lib';
import * as fs from 'fs';
import * as path from 'path';

// HELPERS GENERALES
const safeText = (text: any, fallback = '') => String(text || fallback).trim();

const dateStr = (d: any) => {
    if (!d) return 'N/A';
    const date = new Date(d);
    return isNaN(date.getTime()) ? safeText(d) : date.toLocaleDateString('es-MX', { timeZone: 'UTC' });
};

// PALETA DE COLORES
const C = {
    red:      rgb(0.502, 0.094, 0.141),
    white:    rgb(1, 1, 1),
    black:    rgb(0, 0, 0),
    grayBg:   rgb(0.91, 0.91, 0.91),
    grayText: rgb(0.35, 0.35, 0.35),
    border:   rgb(0.55, 0.55, 0.55),
    lightBg:  rgb(0.97, 0.97, 0.97),  
};

type Fonts = { reg: PDFFont; bold: PDFFont; italic: PDFFont };

// PRIMITIVOS DE DIBUJO
function rect(
    page: PDFPage,
    x: number, y: number, w: number, h: number,
    fill = C.white, border = C.border, bw = 0.5
) {
    page.drawRectangle({ x, y, width: w, height: h, color: fill, borderColor: border, borderWidth: bw });
}

function labelRow(
    page: PDFPage,
    x: number, y: number, w: number, h: number,
    label: string, value: string,
    fonts: Fonts, labelW = 100
) {
    rect(page, x,          y, labelW,     h, C.grayBg);
    rect(page, x + labelW, y, w - labelW, h, C.lightBg);

    page.drawText(label, {
        x: x + 6, y: y + h / 2 - 4,
        font: fonts.bold, size: 9, color: C.black
    });
    const maxChars = Math.floor((w - labelW - 12) / 5.5);
    page.drawText(safeText(value).substring(0, maxChars), {
        x: x + labelW + 6, y: y + h / 2 - 4,
        font: fonts.reg, size: 9, color: C.grayText
    });
}

function sectionHeader(
    page: PDFPage,
    x: number, y: number, w: number, h: number,
    text: string, fonts: Fonts, size = 9
) {
    rect(page, x, y, w, h, C.grayBg);
    page.drawText(text, {
        x: x + 8, y: y + h / 2 - 4,
        font: fonts.bold, size, color: C.black
    });
}

function multiline(
    page: PDFPage,
    text: string,
    x: number, y: number, maxW: number,
    font: PDFFont, size = 9, lineH = 13
): number {
    if (!text.trim()) return y;
    const words = text.split(' ');
    let line = '';
    let curY = y;
    for (const word of words) {
        const test = line ? `${line} ${word}` : word;
        if (font.widthOfTextAtSize(test, size) > maxW && line) {
            page.drawText(line, { x, y: curY, font, size, color: C.black });
            line = word;
            curY -= lineH;
        } else {
            line = test;
        }
    }
    if (line) page.drawText(line, { x, y: curY, font, size, color: C.black });
    return curY;
}

function checkbox(
    page: PDFPage,
    x: number, y: number,
    label: string, checked: boolean,
    fonts: Fonts, size = 8.5
) {
    rect(page, x, y - 10, 11, 11, checked ? C.black : C.white, C.black, 1);
    if (checked) page.drawText('X', { x: x + 1.5, y: y - 8, font: fonts.bold, size: 8.5, color: C.white });
    page.drawText(label, { x: x + 15, y: y - 8, font: fonts.reg, size, color: C.black });
}

function textAreaHeight(text: string, maxW: number, font: PDFFont, size = 9, lineH = 13): number {
    if (!text.trim()) return 30;
    const words = text.split(' ');
    let line = '';
    let lines = 1;
    for (const word of words) {
        const test = line ? `${line} ${word}` : word;
        if (font.widthOfTextAtSize(test, size) > maxW && line) { lines++; line = word; }
        else { line = test; }
    }
    return Math.max(30, lines * lineH + 10);
}

// GENERADOR PRINCIPAL
export class PdfGenerator {
    public static async generate(s: any): Promise<Uint8Array> {
        console.log(`Generando PDF: ${s.folio}`);

        const doc  = await PDFDocument.create();
        const page = doc.addPage(PageSizes.Letter);
        const { width, height } = page.getSize();
        const M  = 28;
        const CW = width - 2 * M;

        const fonts: Fonts = {
            reg:    await doc.embedFont(StandardFonts.Helvetica),
            bold:   await doc.embedFont(StandardFonts.HelveticaBold),
            italic: await doc.embedFont(StandardFonts.HelveticaOblique),
        };

        let y = height - 28;

        // SECCIÓN 1 — LOGOS + ENCABEZADO
        const logoH = 42;

        try {
            const logoAdt = path.resolve(process.cwd(), 'assets', 'logo_adt.png');
            const logoGob = path.resolve(process.cwd(), 'assets', 'logo_gob.png');
            if (fs.existsSync(logoAdt)) {
                const img = await doc.embedPng(fs.readFileSync(logoAdt));
                page.drawImage(img, { x: M, y: y - logoH, width: 140, height: logoH });
            }
            if (fs.existsSync(logoGob)) {
                const img = await doc.embedPng(fs.readFileSync(logoGob));
                page.drawImage(img, { x: width - M - 115, y: y - logoH, width: 115, height: logoH });
            }
        } catch (_) {}

        //Título en rojo pegado a la derecha
        const line1 = 'DIRECCIÓN DE INFRAESTRUCTURA';
        const line2 = 'TECNOLÓGICA Y TELECOMUNICACIONES';
        const cx = width / 2;
        page.drawText(line1, { x: width - M - fonts.bold.widthOfTextAtSize(line1, 10), y: y - 14, font: fonts.bold, size: 10, color: C.red });
        page.drawText(line2, { x: width - M - fonts.bold.widthOfTextAtSize(line2, 9),  y: y - 27, font: fonts.bold, size: 9,  color: C.red });

        y -= logoH + 10;

        // SECCIÓN 2 — TÍTULO PRINCIPAL
        const titulo = 'REPORTE DE SERVICIO';
        page.drawText(titulo, {
            x: cx - fonts.bold.widthOfTextAtSize(titulo, 16) / 2,
            y, font: fonts.bold, size: 16, color: C.black
        });

        y -= 22;

        // SECCIÓN 3 — FILA REPORTE / FOLIO
        const folioH  = 22;
        const leftW   = CW * 0.55;
        const rightW  = CW * 0.45;

        rect(page, M,          y - folioH, leftW,  folioH, C.grayBg);
        rect(page, M + leftW,  y - folioH, rightW, folioH, C.grayBg);

        page.drawText('REPORTE DE SERVICIO', {
            x: M + 8, y: y - folioH / 2 - 4,
            font: fonts.bold, size: 9.5, color: C.black
        });

        //FOLIO
        const folioLabel = 'FOLIO: ';
        const folioNum   = safeText(s.folio);
        const folioLabelW = fonts.reg.widthOfTextAtSize(folioLabel, 11);
        const folioNumW   = fonts.bold.widthOfTextAtSize(folioNum, 11);
        const folioStartX = M + leftW + (rightW - folioLabelW - folioNumW) / 2;
        page.drawText(folioLabel, { x: folioStartX,              y: y - folioH / 2 - 4, font: fonts.reg,  size: 11, color: C.black });
        page.drawText(folioNum,   { x: folioStartX + folioLabelW, y: y - folioH / 2 - 4, font: fonts.bold, size: 11, color: C.black });

        y -= folioH + 3;

        // SECCIÓN 4 — TABLA DEPENDENCIA / SOLICITANTE / CARGO
        const rH  = 20;
        const lbW = 110;

        labelRow(page, M, y - rH,       CW, rH, 'DEPENDENCIA:', safeText(s.dependencia),                      fonts, lbW);
        labelRow(page, M, y - rH * 2,   CW, rH, 'SOLICITANTE:', safeText(s.nombreSolicitante),                 fonts, lbW);
        labelRow(page, M, y - rH * 3,   CW, rH, 'CARGO:',       safeText(s.cargo || s.cargoNombre || '—'),     fonts, lbW);

        y -= rH * 3 + 3;

        // SECCIÓN 5 — TABLA FECHAS (4 columnas)
        const dH  = 19;
        const cW4 = CW / 4;
        const headers4 = ['INICIO', 'TÉRMINO', 'ENVÍO', 'NIVEL'];

        //Encabezados
        headers4.forEach((h, i) => {
            rect(page, M + i * cW4, y - dH, cW4, dH, C.grayBg);
            const hw = fonts.bold.widthOfTextAtSize(h, 8.5);
            page.drawText(h, { x: M + i * cW4 + (cW4 - hw) / 2, y: y - dH / 2 - 4, font: fonts.bold, size: 8.5, color: C.black });
        });

        //Fila 1: fechas + envio (span 2 filas) + nivel (span 2 filas)
        rect(page, M,          y - dH * 2, cW4, dH, C.lightBg);
        rect(page, M + cW4,    y - dH * 2, cW4, dH, C.lightBg);
        rect(page, M + cW4*2,  y - dH * 3, cW4, dH * 2, C.lightBg);
        rect(page, M + cW4*3,  y - dH * 3, cW4, dH * 2, C.lightBg);

        page.drawText('FECHA: ' + dateStr(s.fechaInicio),  { x: M + 4,        y: y - dH * 2 + dH / 2 - 2, font: fonts.reg, size: 8, color: C.black });
        page.drawText('FECHA: ' + dateStr(s.fechaTermino), { x: M + cW4 + 4,  y: y - dH * 2 + dH / 2 - 2, font: fonts.reg, size: 8, color: C.black });

        //Fila 2: horas
        rect(page, M,       y - dH * 3, cW4, dH, C.lightBg);
        rect(page, M + cW4, y - dH * 3, cW4, dH, C.lightBg);

        page.drawText('HORA: ' + safeText(s.horaInicio),  { x: M + 4,       y: y - dH * 3 + dH / 2 - 2, font: fonts.reg, size: 8, color: C.black });
        page.drawText('HORA: ' + safeText(s.horaTermino), { x: M + cW4 + 4, y: y - dH * 3 + dH / 2 - 2, font: fonts.reg, size: 8, color: C.black });

        //Valores de celdas span
        const envioVal = safeText(s.tipoEnvio || s.tipoEnvioNombre || '—');
        const nivelVal = safeText(s.nivel || '');
        page.drawText(envioVal, { x: M + cW4*2 + 4, y: y - dH * 2 - dH / 2 - 2, font: fonts.reg, size: 8, color: C.black });
        page.drawText(nivelVal, { x: M + cW4*3 + 4, y: y - dH * 2 - dH / 2 - 2, font: fonts.reg, size: 8, color: C.black });

        y -= dH * 3 + 4;

        // SECCIÓN 6 — DIAGNÓSTICO (Tipo de Servicio checkboxes)
        sectionHeader(page, M, y - 18, CW, 18, 'DIAGNÓSTICO', fonts, 9.5);
        y -= 16;

        const servicios = ['ASESORÍA', 'AUDITORÍA', 'MANT. FÍSICO', 'INFRAESTRUCTURA', 'SERV. DIGITALES', 'MANT. PANELES', 'SUP. INFRAESTR.'];
        const serviciosMatch = ['ASESORIA', 'AUDITORIA', 'MANTENIMIENTO FISICO', 'INFRAESTRUCTURA', 'SERVICIOS DIGITALES', 'MANTENIMIENTO DE PANELES', 'SUPERVISION'];
        const currentSvc = safeText(s.tipoServicio || '').toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const cbW = CW / servicios.length;
        const cbH = 24;

        servicios.forEach((srv, i) => {
            const cleanMatch = serviciosMatch[i].normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            const isChecked  = currentSvc.includes(cleanMatch.substring(0, 6)) || cleanMatch.includes(currentSvc.substring(0, 6));
            rect(page, M + i * cbW, y - cbH, cbW, cbH, C.white);

            //Checkbox centrado arriba
            const boxX = M + i * cbW + cbW / 2 - 6;
            rect(page, boxX, y - 14, 12, 12, isChecked ? C.black : C.white, C.black, 1);
            if (isChecked) page.drawText('X', { x: boxX + 2, y: y - 12, font: fonts.bold, size: 9, color: C.white });

            //Label centrado abajo
            const lSize  = 6.5;
            const lWidth = fonts.reg.widthOfTextAtSize(srv, lSize);
            page.drawText(srv, {
                x: M + i * cbW + (cbW - lWidth) / 2,
                y: y - cbH + 4,
                font: fonts.reg, size: lSize, color: C.black
            });
        });

        y -= cbH + 3;

        // SECCIÓN 7 — DESCRIPCIÓN DE LA FALLA
        const fallaH = textAreaHeight(safeText(s.descripcionFalla), CW - 10, fonts.reg);

        sectionHeader(page, M, y - 18, CW, 18, 'DESCRIPCIÓN DE LA FALLA Y/O PROBLEMA', fonts);
        rect(page, M, y - 16 - fallaH, CW, fallaH, C.white);
        multiline(page, safeText(s.descripcionFalla, '—'), M + 6, y - 26, CW - 12, fonts.reg);

        y -= 18 + fallaH + 4;

        // SECCIÓN 8 — TIPO ACTIVIDAD + DESCRIPCIÓN ACTIVIDAD
        const actividades     = ['INSTALACIÓN', 'CONFIGURACIÓN'];
        const actividadesMatch = ['INSTALACION', 'CONFIGURACION'];
        const currentAct = safeText(s.tipoActividad || s.tipoActividadNombre || '').toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const actCbW = CW / actividades.length;
        const actCbH = 24;

        actividades.forEach((act, i) => {
            const cleanMatch = actividadesMatch[i].normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            const isChecked = currentAct.length >= 3 && (
                currentAct.includes(cleanMatch.substring(0, 5)) ||
                cleanMatch.includes(currentAct.substring(0, 5))
            );
            rect(page, M + i * actCbW, y - actCbH, actCbW, actCbH, C.white);

            const boxX = M + i * actCbW + actCbW / 2 - 6;
            rect(page, boxX, y - 14, 12, 12, isChecked ? C.black : C.white, C.black, 1);
            if (isChecked) page.drawText('X', { x: boxX + 2, y: y - 12, font: fonts.bold, size: 9, color: C.white });

            const lWidth = fonts.bold.widthOfTextAtSize(act, 8);
            page.drawText(act, {
                x: M + i * actCbW + (actCbW - lWidth) / 2,
                y: y - actCbH + 4,
                font: fonts.bold, size: 8, color: C.black
            });
        });

        y -= actCbH + 2;

        const actividadH = textAreaHeight(safeText(s.descripcionActividad), CW - 10, fonts.reg);

        sectionHeader(page, M, y - 18, CW, 18, 'DESCRIPCIÓN DE LA ACTIVIDAD REALIZADA', fonts);
        rect(page, M, y - 16 - actividadH, CW, actividadH, C.white);
        multiline(page, safeText(s.descripcionActividad, '—'), M + 6, y - 26, CW - 12, fonts.reg);

        y -= 18 + actividadH + 4;

        // SECCIÓN 9 — ESTADO DEL SERVICIO + FOTOS
        const estadoH = 28;
        const halfCW  = CW / 2;

        //Headers
        sectionHeader(page, M,          y - 18, halfCW, 18, 'ESTADO DEL SERVICIO', fonts);
        sectionHeader(page, M + halfCW, y - 18, halfCW, 18, 'FOTOS',               fonts);

        //Contenido estado
        rect(page, M,          y - 18 - estadoH, halfCW, estadoH, C.white);
        rect(page, M + halfCW, y - 18 - estadoH, halfCW, estadoH, C.white);

        const st = safeText(s.estadoServicio).toUpperCase();
        checkbox(page, M + 12,             y - 28, 'CONCLUIDO',      st.includes('CONCLUIDO'),   fonts);
        checkbox(page, M + halfCW / 2 + 5, y - 28, 'EN SEGUIMIENTO', st.includes('SEGUIMIENTO'), fonts);

        //Contenido fotos
        const fotosArr: string[] = s.fotos
            ? safeText(s.fotos).split(',').map((f: string) => f.trim()).filter(Boolean)
            : [];
        const hasPhotos = fotosArr.length > 0;
        checkbox(page, M + halfCW + 15,            y - 28, hasPhotos ? `SÍ (${fotosArr.length} foto${fotosArr.length > 1 ? 's' : ''})` : 'SÍ', hasPhotos,  fonts);
        checkbox(page, M + halfCW + halfCW / 2,    y - 28, 'NO',                                                                                 !hasPhotos, fonts);

        y -= 18 + estadoH + 4;

        // SECCIÓN 10 — OBSERVACIONES
        const obsText = safeText(s.observaciones, 'Sin observaciones.');
        const obsH    = textAreaHeight(obsText, CW - 10, fonts.reg);

        sectionHeader(page, M, y - 18, CW, 18, 'OBSERVACIONES', fonts);
        rect(page, M, y - 16 - obsH, CW, obsH, C.white);
        multiline(page, obsText, M + 6, y - 26, CW - 12, fonts.reg);

        y -= 18 + obsH + 10;

        // SECCIÓN 11 — FIRMAS
        const sigY = Math.max(y - 80, 110);
        const sigW = 175;
        const lineY = sigY + 28;

        //Responsable (izquierda)
        page.drawText(safeText(s.nombreReceptor), {
            x: M + 4, y: lineY + 16,
            font: fonts.bold, size: 10, color: C.black
        });
        page.drawLine({ start: { x: M, y: lineY }, end: { x: M + sigW, y: lineY }, thickness: 0.8, color: C.black });
        page.drawText('RESPONSABLE DEL SERVICIO', {
            x: M + sigW / 2 - fonts.bold.widthOfTextAtSize('RESPONSABLE DEL SERVICIO', 8) / 2,
            y: lineY - 13,
            font: fonts.bold, size: 8, color: C.black
        });
        page.drawText('(NOMBRE Y FIRMA)', {
            x: M + sigW / 2 - fonts.reg.widthOfTextAtSize('(NOMBRE Y FIRMA)', 7.5) / 2,
            y: lineY - 24,
            font: fonts.reg, size: 7.5, color: C.grayText
        });

        //Sello (centro)
        const selloX = (width - 120) / 2;
        page.drawText('SELLO', {
            x: selloX + 46, y: lineY + 8,
            font: fonts.bold, size: 9, color: C.black
        });
        rect(page, selloX, sigY - 28, 120, 60, C.white, C.border, 1);

        //Receptor (derecha)
        const recX = width - M - sigW;
        page.drawText(safeText(s.nombreSolicitante), {
            x: recX + 4, y: lineY + 16,
            font: fonts.bold, size: 10, color: C.black
        });
        page.drawLine({ start: { x: recX, y: lineY }, end: { x: recX + sigW, y: lineY }, thickness: 0.8, color: C.black });
        page.drawText('RECEPTOR DE LA DEPENDENCIA', {
            x: recX + sigW / 2 - fonts.bold.widthOfTextAtSize('RECEPTOR DE LA DEPENDENCIA', 8) / 2,
            y: lineY - 13,
            font: fonts.bold, size: 8, color: C.black
        });
        page.drawText('(NOMBRE Y FIRMA)', {
            x: recX + sigW / 2 - fonts.reg.widthOfTextAtSize('(NOMBRE Y FIRMA)', 7.5) / 2,
            y: lineY - 24,
            font: fonts.reg, size: 7.5, color: C.grayText
        });

        // SECCIÓN 12 — SEGUNDA PÁGINA CON FOTOS (si existen)
        if (hasPhotos) {
            const uploadsPath = path.join(process.cwd(), 'uploads', 'servicios');

            // Filtrar las que realmente existen en disco
            const fotosValidas = fotosArr.filter(f => {
                const fp = path.join(uploadsPath, f);
                return fs.existsSync(fp);
            });

            if (fotosValidas.length > 0) {
                const photoPage = doc.addPage(PageSizes.Letter);
                const { width: pw, height: ph } = photoPage.getSize();
                let py = ph - 35;

                //Header página de fotos
                rect(photoPage, M, py - 20, pw - 2 * M, 20, C.grayBg);
                photoPage.drawText(`EVIDENCIA FOTOGRÁFICA — FOLIO: ${safeText(s.folio)}`, {
                    x: M + 8, y: py - 13,
                    font: fonts.bold, size: 10, color: C.black
                });
                py -= 28;

                // Grid 2 columnas
                const gap   = 10;
                const imgW  = (pw - 2 * M - gap) / 2;
                const imgH  = imgW * 0.72; 
                let col     = 0;
                let rowTop  = py;
                let pageRef = photoPage;

                for (let i = 0; i < fotosValidas.length; i++) {
                    const filename = fotosValidas[i];
                    //Nueva página si no cabe
                    if (rowTop - imgH < 50) {
                        const np = doc.addPage(PageSizes.Letter);
                        pageRef = np;
                        rowTop  = ph - 40;
                        col     = 0;
                        //Redibujar header en nueva página
                        rect(pageRef, M, rowTop - 20, pw - 2 * M, 20, C.grayBg);
                        pageRef.drawText(`EVIDENCIA FOTOGRÁFICA — ${safeText(s.folio)} (cont.)`, {
                            x: M + 8, y: rowTop - 13,
                            font: fonts.bold, size: 10, color: C.black
                        });
                        rowTop -= 28;
                    }

                    const fxFinal = M + col * (imgW + gap);
                    const fyFinal = rowTop - imgH;

                    try {
                        const ext      = path.extname(filename).toLowerCase();
                        const imgBytes = fs.readFileSync(path.join(uploadsPath, filename));
                        const embedded = ext === '.png'
                            ? await doc.embedPng(imgBytes)
                            : await doc.embedJpg(imgBytes);

                        //Marco de la foto
                        rect(pageRef, fxFinal, fyFinal, imgW, imgH, C.white, C.border, 1);
                        pageRef.drawImage(embedded, {
                            x: fxFinal + 2, y: fyFinal + 2,
                            width: imgW - 4, height: imgH - 4
                        });
                    } catch (_) {
                        //Foto corrupta → placeholder
                        rect(pageRef, fxFinal, fyFinal, imgW, imgH, C.grayBg, C.border, 1);
                        pageRef.drawText('Foto no disponible', {
                            x: fxFinal + imgW / 2 - 42,
                            y: fyFinal + imgH / 2,
                            font: fonts.reg, size: 9, color: C.grayText
                        });
                    }

                    //Número de foto pequeño debajo
                    pageRef.drawText(`Foto ${i + 1}`, {
                        x: fxFinal + 3, y: fyFinal - 9,
                        font: fonts.reg, size: 7, color: C.grayText
                    });

                    col++;
                    if (col >= 2) { col = 0; rowTop -= imgH + 20; }
                }
            }
        }

        return await doc.save();
    }
}

export const generateServicePDF = async (servicio: any) => PdfGenerator.generate(servicio);