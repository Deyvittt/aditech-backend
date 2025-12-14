export class Direccion{
    constructor(
        readonly id: number,
        readonly nombre: string,
        readonly dependenciaId: number,
        readonly padreId: number
    ){}
}