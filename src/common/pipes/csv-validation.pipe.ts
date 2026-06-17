import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class CsvFileValidationPipe implements PipeTransform {
  transform(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    if (!file.originalname.endsWith('.csv')) {
      throw new BadRequestException('Only CSV files are allowed');
    }

    if (file.size === 0) {
      throw new BadRequestException('File is empty');
    }

    return file;
  }
}
