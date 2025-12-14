import { Usuario } from "./Usuario";

export interface UsuarioRepository {
    addUsuario(Usuario: Usuario): Promise<Usuario|null>;
    getUsuarioByUsername(username: string): Promise<Usuario | null>;
    getAllUsuarios(): Promise<any[]>;
    updateUsuario(id: string, data: any):Promise<boolean>;
    deleteUsuario(id: string): Promise<boolean>;
}