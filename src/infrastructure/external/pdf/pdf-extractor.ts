import { Injectable, Logger } from "@nestjs/common";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import { join } from "node:path";

@Injectable()
export class PdfExtractor {
  private readonly logger = new Logger(PdfExtractor.name);

  async extract(buffer: Buffer): Promise<string> {
    try {
      const loadingTask = pdfjsLib.getDocument({
        data: new Uint8Array(buffer),
        standardFontDataUrl: join(
          process.cwd(),
          "node_modules/pdfjs-dist/standard_fonts/",
        ),
      });

      const pdf = await loadingTask.promise;
      const pages: string[] = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item) => ("str" in item ? item.str : ""))
          .join(" ");
        pages.push(pageText);
      }

      return pages.join("\n\n");
    } catch (error) {
      this.logger.error("Failed to extract text from PDF", error);
      throw new Error("Failed to extract text from PDF");
    }
  }
}
