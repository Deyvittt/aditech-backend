import jwt from 'jsonwebtoken';
import { ITokenService } from "../../application/services/ITokenService";
import { UsuarioDto } from "../../../usuario/domain/UsuarioDto";
import { Signale } from 'signale';
import 'dotenv/config'; 

const signale = new Signale({ scope: 'TokenService' });

export class TokenService implements ITokenService {
    private SECRET_JWT: string;

    constructor() {
        this.SECRET_JWT = process.env.SECRET_JWT ?? 'tu-secreto-por-defecto-inseguro';
        
        console.log(`[TokenService] Constructor: Usando SECRET_JWT = ${this.SECRET_JWT}`); 

        if (!process.env.SECRET_JWT || this.SECRET_JWT === 'tu-secreto-por-defecto-inseguro') {
            signale.warn('¡ALERTA! SECRET_JWT no encontrada en .env o es la por defecto. Usando clave insegura.');
        }
    }

    async generateToken(data: UsuarioDto): Promise<string> {
        try {
            const payload = {
                idUsuario: data.idUsuario, nombre: data.nombre, apellidoP: data.apellidoP,
                apellidoM: data.apellidoM, correo: data.correo, telefono: data.telefono,
                cargoAdministrativo: data.cargoAdministrativo, departamento: data.departamento,
                username: data.username, createdBy: data.createdBy, updatedBy: data.updatedBy,
                rol: data.rol
            };
            const token: string = jwt.sign(payload, this.SECRET_JWT, { expiresIn: '12h' }); 
            if (!token) {
                signale.error('jwt.sign no generó un token.');
                throw new Error('Token no generado');
            }
            return token;
        } catch (error: any) {
            signale.error('Error al generar token:', error);
            throw error;
        }
    }

    async verifyToken(token: string): Promise<UsuarioDto | null> {
        console.log(`[TokenService] verifyToken: Recibido token = ${token}`);
        
        try {
            const decoded = jwt.verify(token, this.SECRET_JWT) as any; 

            console.log('[TokenService] verifyToken: Decodificado exitosamente =', decoded);

            return new UsuarioDto(
                decoded.idUsuario, decoded.nombre, decoded.apellidoP, decoded.apellidoM,
                decoded.correo, decoded.telefono, decoded.cargoAdministrativo, decoded.departamento,
                decoded.username, decoded.createdBy, decoded.updatedBy, decoded.rol
            );
        } catch (error: any) {
            console.error('[TokenService] verifyToken: ¡ERROR AL VERIFICAR!', error); 
            signale.warn('Token inválido o expirado:', error.message);
            return null;
        }
    }
}