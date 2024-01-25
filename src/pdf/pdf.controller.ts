import { Body, Controller, Get, Header, StreamableFile, UsePipes } from '@nestjs/common';
import { PdfService } from './pdf.service';
import { ZodValidationPipe } from '@/shared/ZodValidationPipe';
import { BarcodeDto, BarcodeSchema } from './PdfValidations';

@Controller('pdf')
export class PdfController {
    constructor(private readonly pdfService: PdfService) {}

    @Get('/barcode')
    @Header('Content-Type', 'application/pdf')
    @Header('Content-Disposition', 'attachment; filename="barcode.pdf"')
    @UsePipes(new ZodValidationPipe(BarcodeSchema))
    async getBarcodePdf(@Body() body: BarcodeDto): Promise<StreamableFile> {
        const pdf = await this.pdfService.barcodePdf(body.barcodeText, body.additionalText);
        return new StreamableFile(pdf);
    }
}
