import { Injectable } from '@nestjs/common';
import * as PDFDocument from 'pdfkit';
import * as bwipjs from 'bwip-js';

@Injectable()
export class PdfService {
    async barcodePdf(barcodeText: string, additionalText?: string): Promise<Buffer> {
        const doc = new PDFDocument();
        const buffers: Buffer[] = [];

        doc.on('data', (data) => buffers.push(data));
        doc.on('end', () => Promise.resolve(Buffer.concat(buffers)));

        // Add text above the barcode
        additionalText
            ? doc.text(additionalText, 100, 80, {
                  align: 'center',
              })
            : doc.text('Barcode', 100, 80, {
                  align: 'center',
              });

        // Generate barcode and add to the PDF
        try {
            const barcodeImage = await this.generateBarcode(barcodeText);

            // Define the size and position of the barcode image
            const barcodeWidth = 200; // Adjust as needed
            const barcodeHeight = 100; // Adjust as needed
            const barcodeX = (doc.page.width - barcodeWidth) / 2;
            const barcodeY = 100; // Adjust as needed

            // Draw the barcode image
            doc.image(barcodeImage, barcodeX, barcodeY, {
                width: barcodeWidth,
                height: barcodeHeight,
            });

            // Add text below the barcode
            doc.text(barcodeText, 100, barcodeY + barcodeHeight + 10, {
                align: 'center',
            });
        } catch (err) {
            console.error('Error generating barcode:', err);
            throw err;
        }

        // Finalize the PDF and end the stream
        doc.end();

        return new Promise((resolve) => {
            doc.on('end', () => resolve(Buffer.concat(buffers)));
        });
    }

    private async generateBarcode(text: string): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            bwipjs.toBuffer(
                {
                    bcid: 'code128', // Barcode type
                    text: text,
                    scale: 3, // 3x scaling factor
                    height: 10, // Bar height, in millimeters
                    includetext: false, // Show human-readable text
                    textxalign: 'center', // Always good to set this
                },
                function (err, png) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(png);
                    }
                },
            );
        });
    }
}
