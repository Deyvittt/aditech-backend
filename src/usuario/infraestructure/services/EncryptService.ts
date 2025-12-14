import bcrypt from "bcrypt";
import { IEncryptService } from "../../application/services/IEncryptService";
import 'dotenv/config';
import { Signale } from "signale";

const signale = new Signale({scope: "EncryptService"});

export class EncryptService implements IEncryptService {
    async encrypt(data: string): Promise<string> {
        try{
            const pass = bcrypt.hashSync(data, 12);
            signale.info('Password encrypted successfully');
            return pass;
        } catch (error: any) {
            signale.error('Error at encrypt:', error);
            throw error;
        }
    }

    async compare(data: string, hashedData: string): Promise<boolean> {
        try{
            const cleanHash = hashedData.trim();
            const result = bcrypt.compareSync(data, cleanHash);
            return result;
        } catch (error: any) {
            signale.error('Error at compare:', error);
            return false;
        }
    }
}