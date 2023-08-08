import { UseCase } from "../../shared/UseCase";
import { PdfBarcodeGenerator } from "../domain/PdfBarcodeGenerator";

interface Props {
    barcode:string,
}
export class GenerateBarcodePdfUseCase implements UseCase<Props, Promise<Uint8Array>> {
    constructor(private pdfGenerator: PdfBarcodeGenerator) {
    }

    public async execute(props: Props): Promise<Uint8Array> {
        return this.pdfGenerator.generatePdfWithBarcode(props.barcode);
    }
}