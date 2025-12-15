declare module 'pdf-parse' {
  export interface PDFParseResult {
    numpages: number;
    text: string;
  }

  export default function pdfParse(data: Buffer): Promise<PDFParseResult>;
}
