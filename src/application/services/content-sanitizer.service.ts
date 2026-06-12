import { Injectable } from "@nestjs/common";

@Injectable()
export class ContentSanitizerService {
  private readonly injectionPatterns = [
    /ignore\s+(all\s+)?(previous|prior|above)\s+instructions?/gi,
    /ignore\s+(all\s+)?instructions?/gi,
    /you\s+are\s+now\s+a/gi,
    /act\s+as\s+(a\s+)?(?:an?\s+)?(?:unrestricted|unfiltered|jailbroken)/gi,
    /forget\s+(all\s+)?(your\s+)?(previous\s+)?instructions?/gi,
    /disregard\s+(all\s+)?(previous\s+)?instructions?/gi,
    /new\s+instructions?:/gi,
    /system\s*:/gi,
    /\[system\]/gi,
    /\[instructions?\]/gi,
    /<\s*system\s*>/gi,
    /###\s*instructions?/gi,
    /prompt\s*:/gi,
  ];

  sanitize(content: string): string {
    let sanitized = content;

    for (const pattern of this.injectionPatterns) {
      sanitized = sanitized.replace(pattern, "[REMOVED]");
    }

    return sanitized;
  }

  hasInjectionAttempt(content: string): boolean {
    return this.injectionPatterns.some((pattern) => pattern.test(content));
  }
}
