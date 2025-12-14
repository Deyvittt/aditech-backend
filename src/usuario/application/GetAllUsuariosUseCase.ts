import { UsuarioRepository } from "../domain/UsuarioRepository"; // O donde esté tu interfaz

export class GetAllUsuariosUseCase {
    constructor(private readonly usuarioRepository: UsuarioRepository) {}

    async execute() {
        return await this.usuarioRepository.getAllUsuarios();
    }
}