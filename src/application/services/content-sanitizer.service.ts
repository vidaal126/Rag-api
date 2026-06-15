import { Injectable } from '@nestjs/common';

@Injectable()
export class ContentSanitizerService {
  private readonly injectionPatterns = [
    /ignore\s+(all\s+)?(previous|prior|above)\s+instructions?/gi,
    /ignore\s+(all\s+)?instructions?/gi,
    /disregard\s+(all\s+)?(previous\s+)?instructions?/gi,
    /forget\s+(all\s+)?(your\s+)?(previous\s+)?instructions?/gi,
    /you\s+are\s+now\s+a/gi,
    /act\s+as\s+(a\s+)?(?:an?\s+)?(?:unrestricted|unfiltered|jailbroken)/gi,
    /new\s+instructions?:/gi,
    /override\s+(previous\s+)?instructions?/gi,
    /bypass\s+(your\s+)?(restrictions?|rules?|guidelines?)/gi,
    /do\s+not\s+follow\s+(your\s+)?instructions?/gi,
    /ignor[ae]\s+(todas?\s+)?(as\s+)?instru[cç][oõ]es?\s+anteriores?/gi,
    /esque[cç]a?\s+(todas?\s+)?(as\s+)?instru[cç][oõ]es?/gi,
    /desconsider[ae]\s+(todas?\s+)?(as\s+)?instru[cç][oõ]es?/gi,
    /voc[eê]\s+agora\s+[eé]/gi,
    /novas?\s+instru[cç][oõ]es?:/gi,
    /aja\s+como\s+(um\s+)?(assistente\s+)?(sem\s+restri[cç][oõ]es?|livre|irrestrito)/gi,
    /system\s*:/gi,
    /\[system\]/gi,
    /<\s*system\s*>/gi,
    /###\s*instructions?/gi,
    /###\s*instru[cç][oõ]es?/gi,
    /prompt\s*:/gi,
    /\[instructions?\]/gi,
    /\[instru[cç][oõ]es?\]/gi,
  ];

  private normalize(text: string): string {
    return text
      .toLowerCase()
      .replace(/([a-z])([-_.])([a-z])/g, '$1$3')
      .replace(/\s+/g, ' ')
      .trim();
  }

  sanitize(content: string): string {
    // sanitiza o texto original diretamente
    let sanitized = content;
    for (const pattern of this.injectionPatterns) {
      sanitized = sanitized.replace(pattern, '[REMOVED]');
      pattern.lastIndex = 0;
    }

    // sanitiza também a versão normalizada e substitui linha a linha
    const lines = sanitized.split('\n');
    const result = lines.map((line): string => {
      const normalized = this.normalize(line);
      for (const pattern of this.injectionPatterns) {
        pattern.lastIndex = 0;
        if (pattern.test(normalized)) {
          pattern.lastIndex = 0;
          return '[REMOVED]';
        }
        pattern.lastIndex = 0;
      }
      return line;
    });

    return result.join('\n');
  }

  hasInjectionAttempt(content: string): boolean {
    const lines = content.split('\n');
    return lines.some((line): boolean => {
      const normalized = this.normalize(line);
      return this.injectionPatterns.some((pattern): boolean => {
        pattern.lastIndex = 0;
        const result = pattern.test(normalized);
        pattern.lastIndex = 0;
        return result;
      });
    });
  }
}
