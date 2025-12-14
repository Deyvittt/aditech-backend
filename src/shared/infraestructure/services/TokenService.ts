// En src/shared/infraestructure/services/TokenService.ts

import jwt from 'jsonwebtoken';
import { ITokenService } from "../../application/services/ITokenService";
import { UsuarioDto } from "../../../usuario/domain/UsuarioDto";
import { Signale } from 'signale';
import 'dotenv/config'; // Asegúrate que dotenv se cargue

const signale = new Signale({ scope: 'TokenService' });

export class TokenService implements ITokenService {
    private SECRET_JWT: string;

    constructor() {
        // Leemos la clave secreta desde .env o usamos un default (NO SEGURO para producción)
        this.SECRET_JWT = process.env.SECRET_JWT ?? 'tu-secreto-por-defecto-inseguro';
        
        // ===== LOG CLAVE #1: Ver qué clave secreta se está usando =====
        console.log(`[TokenService] Constructor: Usando SECRET_JWT = ${this.SECRET_JWT}`); 
        // =============================================================

        if (!process.env.SECRET_JWT || this.SECRET_JWT === 'tu-secreto-por-defecto-inseguro') {
            signale.warn('¡ALERTA! SECRET_JWT no encontrada en .env o es la por defecto. Usando clave insegura.');
        }
    }

    // generateToken se queda igual, ya sabemos que funciona
    async generateToken(data: UsuarioDto): Promise<string> {
        try {
            const payload = {
                idUsuario: data.idUsuario, nombre: data.nombre, apellidoP: data.apellidoP,
                apellidoM: data.apellidoM, correo: data.correo, telefono: data.telefono,
                cargoAdministrativo: data.cargoAdministrativo, departamento: data.departamento,
                username: data.username, createdBy: data.createdBy, updatedBy: data.updatedBy,
                rol: data.rol // ¡Importante incluir el rol!
            };
            // Usamos la clave leída en el constructor
            const token: string = jwt.sign(payload, this.SECRET_JWT, { expiresIn: '12h' }); 
            if (!token) {
                signale.error('jwt.sign no generó un token.');
                throw new Error('Token no generado');
            }
            // signale.success(`Token generado para ${data.username}`); // Log opcional
            return token;
        } catch (error: any) {
            signale.error('Error al generar token:', error);
            throw error;
        }
    }

    async verifyToken(token: string): Promise<UsuarioDto | null> {
        // ===== LOG CLAVE #2: Ver el token que llega =====
        console.log(`[TokenService] verifyToken: Recibido token = ${token}`);
        // ===============================================
        try {
            // Usamos la clave leída en el constructor para verificar
            const decoded = jwt.verify(token, this.SECRET_JWT) as any; 

            // ===== LOG CLAVE #3: Ver el resultado de jwt.verify =====
            console.log('[TokenService] verifyToken: Decodificado exitosamente =', decoded);
            // ========================================================

            // Reconstruimos el DTO si la verificación fue exitosa
            return new UsuarioDto(
                decoded.idUsuario, decoded.nombre, decoded.apellidoP, decoded.apellidoM,
                decoded.correo, decoded.telefono, decoded.cargoAdministrativo, decoded.departamento,
                decoded.username, decoded.createdBy, decoded.updatedBy, decoded.rol // Asegúrate que el rol esté aquí
            );
        } catch (error: any) {
            // ===== LOG CLAVE #4: Ver el error EXACTO de jwt.verify =====
            console.error('[TokenService] verifyToken: ¡ERROR AL VERIFICAR!', error); 
            // ============================================================
            signale.warn('Token inválido o expirado:', error.message);
            return null; // Devolvemos null si hay error
        }
    }
}