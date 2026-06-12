import { ILlmProvider } from "@domain/services/llm.provider";
import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class OllamaLlmAdapter extends ILlmProvider {
  private readonly logger = new Logger(OllamaLlmAdapter.name);
  private readonly baseUrl: string;
  private readonly model: string;

  constructor(private readonly config: ConfigService) {
    super();
    this.baseUrl = this.config.getOrThrow<string>("OLLAMA_BASE_URL");
    this.model = this.config.get<string>("OLLAMA_LLM_MODEL", "qwen2.5:7b");
  }

  async generate(prompt: string): Promise<string> {
    const response = await fetch(`${this.baseUrl}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: this.model,
        prompt,
        stream: false,
      }),
    });

    if (!response.ok) {
      this.logger.error(
        `Ollama generate failed: ${response.status} ${response.statusText}`,
      );
      throw new Error(
        `Ollama LLM request failed with status ${response.status}`,
      );
    }

    const data = (await response.json()) as { response: string };

    return data.response;
  }
}
