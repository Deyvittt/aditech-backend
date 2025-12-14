import { UsuarioDto } from "../../../usuario/domain/UsuarioDto";

export interface ITokenService {
    generateToken(data: UsuarioDto): Promise<string>;
    verifyToken(token: string): Promise<UsuarioDto | null>;
}