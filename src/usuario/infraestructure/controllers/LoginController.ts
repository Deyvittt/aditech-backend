import { ValidateLoginUseCase } from "../../application/ValidateLoginUseCase";
import { Request, Response } from "express";
import { ITokenService } from "../../../shared/application/services/ITokenService";

export class LoginController {
    constructor(
        private validateLoginUseCase: ValidateLoginUseCase,
        private tokenService: ITokenService
    ) {}

    async run(req: Request, res: Response): Promise<void> {
        const { username, password } = req.body as { username: string, password: string };

        try {
            const validUser = await this.validateLoginUseCase.run(username, password);

            if (!validUser) {
                res.status(401).json({
                    msg: 'Usuario o contraseña incorrectos'
                });
                return;
            }

            const token = await this.tokenService.generateToken(validUser);

            res.cookie('token', token, {
                httpOnly: false,
                secure: process.env.NODE_ENV === 'production',
                path: '/',
                sameSite: 'lax',
                maxAge: 43200000, // 12 horas
            });

            res.status(200).json({
                msg: 'Inicio de sesión correcto',
                token,
                user: {
                    idUsuario: validUser.idUsuario,
                    nombre: validUser.nombre,
                    username: validUser.username,
                    rol: validUser.rol
                }
            });
        } catch (error: any) {
            res.status(400).json({
                msg: 'Error al iniciar sesión',
                error: error.message
            });
        }
    }
}