import { RealPdfBarcodeGenerator } from "../../../infra/Pdf/RealPdfBarcodeGenerator";
import { PdfBarcodeGenerator } from "../domain/PdfBarcodeGenerator";


export type PdfDependencies = {
    generateBarcodePdf:PdfBarcodeGenerator
  } 
  //sharedependencie ?

export class PdfDependenciesContainer{
    private static instance: PdfDependenciesContainer
    public dependencies: PdfDependencies = {
        generateBarcodePdf: new RealPdfBarcodeGenerator()           
    }

    private constructor(){}

    public static getInstance():PdfDependenciesContainer{
        if (!PdfDependenciesContainer.instance) PdfDependenciesContainer.instance = new PdfDependenciesContainer();
        return PdfDependenciesContainer.instance;
    }
}