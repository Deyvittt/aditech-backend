import { UsuarioRepository } from "../domain/UsuarioRepository";

export class GetAllUsuariosUseCase {
    constructor(private readonly usuarioRepository: UsuarioRepository) {}

    async execute() {
        return await this.usuarioRepository.getAllUsuarios();
    }
}