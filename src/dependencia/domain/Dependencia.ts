export class Dependencia{
    constructor(
        readonly id: number,
        readonly nombre: string,
        readonly nombreCorto: string,
        readonly ubicacion: string,
        readonly codigoPostal: number,
        readonly colonia: string,
        readonly conmutador: string,
        readonly correo: string,
        readonly domicilio: string,
        readonly fax: string,
        readonly txtDependenciaId: string,
        readonly municipioId: number,
        readonly sectorId: number,
        readonly telefonoDirecto: string,
        readonly tipoOrgano: number,
        readonly web: string
    ){}
}