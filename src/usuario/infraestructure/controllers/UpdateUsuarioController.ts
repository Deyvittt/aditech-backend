import { Request, Response } from "express";
import { MysqlUsuarioRepository } from "../MysqlUsuarioRepository";

export class UpdateUsuarioController {
    constructor(private readonly repo: MysqlUsuarioRepository) {}
    async run(req: Request, res: Response) {
        const { id } = req.params;
        const success = await this.repo.updateUsuario(id, req.body);
        success ? res.status(200).json({ msg: "Usuario actualizado" }) 
                : res.status(500).json({ error: "No se pudo actualizar" });
    }
}