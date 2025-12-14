import { Usuario } from "../domain/Usuario";
import { UsuarioRepository } from "../domain/UsuarioRepository";
import { query } from "../../database/MysqlAdapter";

export class MysqlUsuarioRepository implements UsuarioRepository {
    constructor() {
    }
    
    async getUsuarioByUsername(username: string): Promise<Usuario | null> {
        try {
            const sql = `
                SELECT 
                    idUsuario, 
                    nombre, 
                    apellidoP, 
                    apellidoM, 
                    correo, 
                    telefono, 
                    cargoAdministrativo, 
                    departamento, 
                    password, 
                    username, 
                    createdBy, 
                    updatedBy,
                    rol
                FROM usuario 
                WHERE username = ?
            `;
            
            const [result] = await query(sql, [username]);
            const rows = result as any[];
            
            if (!rows || rows.length === 0) {
                return null;
            }

            const row = rows[0];
            
            return new Usuario(
                row.idUsuario,
                row.nombre,
                row.apellidoP,
                row.apellidoM,
                row.correo,
                row.telefono,
                row.cargoAdministrativo,
                row.departamento,
                row.password,
                row.username,
                row.createdBy,
                row.updatedBy,
                row.rol
            );
        } catch (error) {
            console.error('Error in getUsuarioByUsername:', error);
            throw error;
        }
    }

    async addUsuario(usuario: Usuario): Promise<Usuario | null> {
        try {
            
            const sql = "CALL addUsuario(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            
        
            const isSuperUser = (usuario.rol === 'Superusuario') ? 1 : 0;

            const params = [
                usuario.nombre,
                usuario.apellidoP,
                usuario.apellidoM,
                usuario.correo,
                usuario.telefono,
                usuario.cargoAdministrativo,
                usuario.departamento,
                usuario.username,
                isSuperUser,          
                usuario.getPassword(),
                usuario.rol 
            ];
            
            await query(sql, params);
            
            // Retornamos el usuario creado buscándolo por username para confirmar que se guardó
            return await this.getUsuarioByUsername(usuario.username);

        } catch (error) {
            console.error('Error in addUsuario Repository:', error);
            throw error;
        }
    }

    // Método para listar (ya estaba bien)
    async getAllUsuarios(): Promise<any[]> {
        const sql = "CALL getAllUsuariosDetallado()";
        try {
            const [result]: any = await query(sql, []);
            return result[0] || [];
        } catch (error) {
            console.error("Error en getAllUsuarios:", error);
            return [];
        }
    }

    // Método para actualizar (ya estaba bien)
    async updateUsuario(id: string, data: any): Promise<boolean> {
        const sql = "CALL updateUsuario(?, ?, ?, ?, ?, ?, ?, ?, ?)";
        const params = [
            id,
            data.nombre,
            data.apellidoP,
            data.apellidoM,
            data.correo,
            data.telefono,
            data.nombreUsuario,
            data.cargoId,        // Usamos el ID que viene del front
            data.departamentoId  // Usamos el ID que viene del front
        ];
        try{
            const [result]: any = await query(sql, params);
            return result.affectedRows > 0;
        } catch(error){
            console.error("Error en updateUsuario:", error);
            return false;
        }
    }

    // Método para eliminar (ya estaba bien)
    async deleteUsuario(id: string): Promise<boolean> {
        const sql = "CALL deleteUsuario(?)";
        try {
            const [result]: any = await query(sql, [id]);
            return result.affectedRows > 0;
        } catch(error){
            console.error("Error en deleteUsuario:", error);
            return false;
        }
    }
}