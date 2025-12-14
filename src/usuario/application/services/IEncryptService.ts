export interface IEncryptService {
    encrypt(data: string): Promise<string>;
    compare(data: string, hashedData: string): Promise<boolean>;
}
