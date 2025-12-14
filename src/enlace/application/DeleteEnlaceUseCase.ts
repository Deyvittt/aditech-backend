import { EnlaceRepository } from "../domain/EnlaceRepository";

export class DeleteEnlaceUseCase{
    constructor(private repository: EnlaceRepository) {}

    async run(id: string): Promise<boolean> {
        return await this.repository.deleteEnlace(id);
    }
}