import { PdfBarcodeGenerator } from "../../app/Pdf/domain/PdfBarcodeGenerator";
import { PDFDocument, rgb } from 'pdf-lib';
import * as bwipjs from 'bwip-js';

export class RealPdfBarcodeGenerator implements PdfBarcodeGenerator {
	public async generatePdfWithBarcode(barcode: string): Promise<Uint8Array> {
		const pdfDoc = await PDFDocument.create();

		// Create a new page
		const page = pdfDoc.addPage([150, 300]);
		const { width, height } = page.getSize();

		// Generate the barcode image using bwip-js
		const barcodeOptions = {
			bcid: "code128", // Barcode type
			text: barcode, // Text to encode
			includetext: true, // Show the text below the barcode
		};
		const barcodeImage = await bwipjs.toBuffer(barcodeOptions);


		const image = await pdfDoc.embedPng(barcodeImage);
		const imageSize = image.scale(0.5); // Scale down the image

		page.drawText("Action code", {
			x: width / 2 - imageSize.width / 2,
			y: height / 2 + imageSize.height / 2 + 10,
			size: 12,
			color: rgb(0, 0, 0),
		});
		page.drawImage(image, {
			x: width / 2 - imageSize.width / 2,
			y: height / 2 - imageSize.height / 2,
			width: imageSize.width,
			height: imageSize.height,
		});

		// Serialize the PDF
		const pdfBytes = await pdfDoc.save();
		return pdfBytes;
	}
}
