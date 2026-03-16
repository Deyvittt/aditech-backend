import { Request, Response } from "express";
import multer, { FileFilterCallback } from "multer";
import path from "path";
import fs from "fs";

type Cb = FileFilterCallback;

const storage = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb) => {
        const uploadPath = path.join(process.cwd(), 'uploads', 'servicios');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req: Request, file: Express.Multer.File, cb) => {
        const timestamp = Date.now();
        const ext = path.extname(file.originalname);
        const name = path.basename(file.originalname, ext)
            .replace(/\s+/g, '_');
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
    limits: { fileSize: 5 * 1024 * 1024 } //5MB por foto
});

export class PhotoUploadController {

    //Middleware que acepta hasta 8 fotos
    public uploadMiddleware = upload.array('fotos', 8);

    // POST /api/fotos/upload
    // Recibe las fotos, las guarda en disco y devuelve los nombres
    async uploadPhotos(req: Request, res: Response): Promise<void> {
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
            res.status(500).json({ 
                message: 'Error al subir las fotos', 
                error: error.message 
            });
        }
    }

    // DELETE /api/fotos/:filename
    async deletePhoto(req: Request, res: Response): Promise<void> {
        try {
            const { filename } = req.params;

            const safeFilename = path.basename(filename);
            const filePath = path.join(process.cwd(), 'uploads', 'servicios', safeFilename);

            if (!fs.existsSync(filePath)) {
                res.status(404).json({ message: 'Foto no encontrada' });
                return;
            }

            fs.unlinkSync(filePath);
            res.status(200).json({ message: 'Foto eliminada correctamente' });
        } catch (error: any) {
            res.status(500).json({ 
                message: 'Error al eliminar la foto', 
                error: error.message 
            });
        }
    }
}

export const photoUploadController = new PhotoUploadController();