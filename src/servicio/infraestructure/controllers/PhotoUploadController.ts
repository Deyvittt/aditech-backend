import { Request, Response } from "express";
import multer, { FileFilterCallback } from "multer";
import path from "path";
import fs from "fs";

// Definimos el tipo para el callback del fileFilter
type Cb = FileFilterCallback;

const storage = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb) => {
        const uploadPath = path.join(process.cwd(), 'uploads', 'servicios');
        console.log(`[ESPÍA 1] Intentando crear o usar la carpeta: ${uploadPath}`);
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req: Request, file: Express.Multer.File, cb) => {
        const timestamp = Date.now();
        const ext = path.extname(file.originalname);
        const name = path.basename(file.originalname, ext);
        cb(null, `${timestamp}-${name}${ext}`);
    }
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: Cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Solo se permiten archivos de imagen'));
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    }
});

export class PhotoUploadController {
    public uploadMiddleware = upload.array('fotos', 8);

    async uploadPhotos(req: Request, res: Response): Promise<void> {
        console.log('[ESPÍA 2] ¡Multer terminó! El archivo se guardó. Procesando la respuesta.');
        try {
            const files = req.files as Express.Multer.File[];
            if (!files || files.length === 0) {
                res.status(400).json({ message: 'No se subieron archivos' });
                return;
            }

            const filenames = files.map(file => file.filename);
            res.status(200).json({
                message: `${files.length} foto(s) subida(s) exitosamente`,
                filenames: filenames
            });
        } catch (error: any) {
            console.error('Error al subir fotos:', error);
            res.status(500).json({ message: 'Error al subir las fotos', error: error.message });
        }
    }
}

export const photoUploadController = new PhotoUploadController();