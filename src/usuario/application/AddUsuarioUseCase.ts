import { Usuario } from "../domain/Usuario";
import { UsuarioRepository } from "../domain/UsuarioRepository";
import { IEncryptService } from "./services/IEncryptService";

export class AddUsuarioUseCase {
    constructor(
        private usuarioRepository: UsuarioRepository,
        private encryptService: IEncryptService
    ) {}

    async run(usuario: Usuario): Promise<Usuario|null> {
        const password = usuario.getPassword();

        if (!password) {
            throw new Error('Password is required');
        }

        const hashedPassword = await this.encryptService.encrypt(password);

        usuario.setPassword(hashedPassword);

        return await this.usuarioRepository.addUsuario(usuario);
    }
}