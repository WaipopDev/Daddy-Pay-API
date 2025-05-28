export interface FileValidationOptions {
  maxSize?: number; // in bytes
  allowedTypes?: string[];
  allowedExtensions?: string[];
}

export class FileValidationService {
  static validateFile(file: Express.Multer.File, options: FileValidationOptions = {}): boolean {
    const {
      maxSize = 5 * 1024 * 1024, // 5MB default
      allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'],
      allowedExtensions = ['.jpg', '.jpeg', '.png', '.pdf']
    } = options;

    // Check file size
    if (file.size > maxSize) {
      throw new Error(`File size exceeds maximum allowed size of ${maxSize / (1024 * 1024)}MB`);
    }

    // Check MIME type
    if (!allowedTypes.includes(file.mimetype)) {
      throw new Error(`File type ${file.mimetype} is not allowed. Allowed types: ${allowedTypes.join(', ')}`);
    }

    // Check file extension
    const fileExtension = file.originalname.toLowerCase().substring(file.originalname.lastIndexOf('.'));
    if (!allowedExtensions.includes(fileExtension)) {
      throw new Error(`File extension ${fileExtension} is not allowed. Allowed extensions: ${allowedExtensions.join(', ')}`);
    }

    return true;
  }

  static generateUniqueFileName(originalName: string, prefix: string = 'file'): string {
    const timestamp = Date.now();
    const randomSuffix = Math.round(Math.random() * 1E9);
    const extension = originalName.substring(originalName.lastIndexOf('.'));
    return `${prefix}-${timestamp}-${randomSuffix}${extension}`;
  }
}
