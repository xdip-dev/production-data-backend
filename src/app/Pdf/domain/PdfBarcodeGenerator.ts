export interface PdfBarcodeGenerator {
    generatePdfWithBarcode(barcode:string):Promise<Uint8Array>
}