import S3Service from '../../../external/S3';
import { FileType } from '../../types';

export default class FileUploadService {
  constructor(private readonly uploadProvider: S3Service) {}
  public async uploadBase64File(
    base64Data: string,
    originalName: string,
  ): Promise<string> {
    return await this.uploadProvider.uploadBase64File(base64Data, originalName);
  }
  public async uploadFile(file: Express.Multer.File): Promise<FileType> {
    return await this.uploadProvider.uploadFile(file);
  }

  public async deleteFile(filePath: string): Promise<void> {
    await this.uploadProvider.deleteFile(filePath);
  }
}
