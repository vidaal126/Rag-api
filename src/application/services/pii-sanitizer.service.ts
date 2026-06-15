import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class PiiSanitizerService {
  private readonly logger = new Logger(PiiSanitizerService.name);

  private readonly patterns: Array<{
    name: string;
    regex: RegExp;
    replacement: string;
  }> = [
    {
      name: "CPF",
      regex: /\d{3}[.\s]?\d{3}[.\s]?\d{3}[-.\s]?\d{2}/g,
      replacement: "[CPF REMOVIDO]",
    },
    {
      name: "CNPJ",
      regex: /\d{2}[.\s]?\d{3}[.\s]?\d{3}[/\s]?\d{4}[-.\s]?\d{2}/g,
      replacement: "[CNPJ REMOVIDO]",
    },
    {
      name: "EMAIL",
      regex: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
      replacement: "[EMAIL REMOVIDO]",
    },
    {
      name: "TELEFONE",
      regex: /(\+55\s?)?(\(?\d{2}\)?[\s-]?)(\d{4,5}[\s-]?\d{4})/g,
      replacement: "[TELEFONE REMOVIDO]",
    },
    {
      name: "SALARIO",
      regex:
        /(sal[aá]rio|remunera[cç][aã]o|vencimento|contra-cheque|holerite)\s*:?\s*R\$\s?\d{1,3}(\.\d{3})*(,\d{2})?/gi,
      replacement: "[VALOR REMOVIDO]",
    },
    {
      name: "DATA_NASCIMENTO",
      regex: /\b(nasc(ido|imento|eu)?[\s:em]*)?(\d{2}[/-]\d{2}[/-]\d{4})\b/gi,
      replacement: "[DATA REMOVIDA]",
    },
  ];

  sanitize(content: string): string {
    let sanitized = content;
    let detected = false;

    for (const { name, regex, replacement } of this.patterns) {
      const before = sanitized;
      sanitized = sanitized.replace(regex, replacement);
      if (sanitized !== before) {
        detected = true;
        this.logger.warn(`PII detected and removed: ${name}`);
      }
    }

    if (detected) {
      this.logger.warn("PII was found and masked in document content");
    }

    return sanitized;
  }

  hasPii(content: string): boolean {
    return this.patterns.some(
      ({
        regex,
      }: {
        name: string;
        regex: RegExp;
        replacement: string;
      }): boolean => {
        regex.lastIndex = 0;
        return regex.test(content);
      },
    );
  }
}
