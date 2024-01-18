import aws from 'aws-sdk';
import { getAWSConfig } from '../../configs/env-config';
import { FileType } from '../../core/types';

const awsConfig = getAWSConfig();
class S3Service {
  private s3: aws.S3;

  constructor() {
    aws.config.update({
      accessKeyId: awsConfig.accessKeyId,
      secretAccessKey: awsConfig.secretKey,
      region: awsConfig.region,
    });

    this.s3 = new aws.S3();
  }

  public async uploadBase64File(
    base64Data: string,
    originalName: string,
  ): Promise<string> {
    try {
      const mimeType = base64Data.split(';')[0].split(':')[1];

      const bufferData = Buffer.from(base64Data.split(',')[1], 'base64');

      const fileName = Date.now() + '-' + originalName;

      const filePath = 'hrm/' + fileName;

      const params = {
        Bucket: awsConfig.bucketName,
        Key: filePath,
        Body: bufferData,
        ContentType: mimeType,
        ACL: 'private', // Set ACL as needed
      };

      await this.s3.upload(params).promise();
      return filePath;
    } catch (error) {
      throw error;
    }
  }

  public async deleteFile(filePath: string): Promise<void> {
    const params = {
      Bucket: awsConfig.bucketName,
      Key: filePath,
    };

    try {
      await this.s3.deleteObject(params).promise();
    } catch (error) {
      throw error;
    }
  }

  public async uploadFile(file: Express.Multer.File): Promise<FileType> {
    const fileName = Date.now() + '-' + file.originalname;
    const filePath = 'hrm/' + fileName;

    const params = {
      Bucket: awsConfig.bucketName,
      Key: filePath,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'private', // Set ACL as needed
    };

    try {
      await this.s3.upload(params).promise();

      return {
        document_name: file.originalname,
        file_path: filePath,
        mime_type: file.mimetype,
        size: file.size,
      };
    } catch (error) {
      throw error;
    }
  }
}

export default S3Service;
