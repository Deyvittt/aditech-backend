import { TokenService } from '../shared/infraestructure/services/TokenService';
import { Request, Response, NextFunction } from 'express';
import { Signale } from 'signale';
import 'dotenv/config';
import jwt from 'jsonwebtoken'; 

const signale = new Signale({ scope: 'AuthMiddleware' });
const tokenService = new TokenService(); 

export async function verifyToken(req: Request, res: Response, next: NextFunction): Promise<void> { // <-- Hacemos la función async
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        signale.warn(`Acceso denegado. Header Authorization ausente o malformado en ${req.originalUrl}`);
        res.status(401).json({ msg: 'Token no proporcionado o malformado' });
        return;
    }
    const token = authHeader.split(' ')[1]; 

    try {
        const decoded = await tokenService.verifyToken(token);

        console.log('Resultado de tokenService.verifyToken:', decoded); 

        if (decoded === null || decoded === undefined) {
            res.status(403).json({ msg: 'Token inválido o expirado' });
            return;
        }

        (req as any).user = decoded; 
        signale.info(`Token válido para usuario: ${decoded.username} (${decoded.rol}) en ${req.originalUrl}`);
        next();

    } catch (error: any) {
        signale.error('Error inesperado en verifyToken middleware:', error);
         if (error instanceof jwt.TokenExpiredError) {
            res.status(401).json({message: 'Token expirado.'});
             return;
         }
         if (error instanceof jwt.JsonWebTokenError) {
            res.status(401).json({ message: `Token inválido: ${error.message}` });
              return;
         }
        res.status(500).json({ msg: 'Error interno al verificar el token' });
    }
}

export const authorizeRoles = (...allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = (req as any).user;

        if (!user || !user.rol) { 
            signale.warn(`Intento de acceso sin rol definido después de verificar token en ${req.originalUrl}. User: ${JSON.stringify(user)}`);
            return res.status(403).json({ message: 'Acceso prohibido. Rol de usuario no encontrado.' });
        }

        if (!allowedRoles.includes(user.rol)) {
            signale.warn(`Acceso prohibido para rol '${user.rol}' en ruta ${req.originalUrl}`);
            return res.status(403).json({ message: 'Acceso prohibido. No tienes los permisos necesarios.' });
        }
        
        next();
    };
};

export const isSuperusuario = authorizeRoles('Superusuario');
export const canWrite = authorizeRoles('Superusuario', 'Normal');
export const canRead = authorizeRoles('Superusuario', 'Normal', 'Lector');