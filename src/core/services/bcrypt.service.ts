import bcrypt from 'bcrypt';
export default class BcryptService {
  public async generateHash(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  public async compareHash(hash: string, password: string): Promise<boolean> {
    return await bcrypt.compare(hash, password);
  }
}
