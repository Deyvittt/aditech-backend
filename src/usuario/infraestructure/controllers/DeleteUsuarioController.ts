import { Request, Response } from "express";
import { MysqlUsuarioRepository } from "../MysqlUsuarioRepository";

export class DeleteUsuarioController {
    constructor(private readonly repo: MysqlUsuarioRepository) {}
    async run(req: Request, res: Response) {
        const { id } = req.params;
        const success = await this.repo.deleteUsuario(id);
        success ? res.status(200).json({ msg: "Usuario eliminado" }) 
                : res.status(500).json({ error: "No se pudo eliminar" });
    }
}