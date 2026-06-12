import { IEmbeddingProvider } from "@domain/services/embedding.provider";
import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class OllamaEmbeddingAdapter extends IEmbeddingProvider {
  private readonly logger = new Logger(OllamaEmbeddingAdapter.name);
  private readonly baseUrl: string;
  private readonly model: string;

  constructor(private readonly config: ConfigService) {
    super();
    this.baseUrl = this.config.getOrThrow<string>("OLLAMA_BASE_URL");
    this.model = this.config.get<string>(
      "OLLAMA_EMBEDDING_MODEL",
      "nomic-embed-text",
    );
  }

  async embed(text: string): Promise<number[]> {
    const response = await fetch(`${this.baseUrl}/api/embed`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: this.model, input: text }),
    });

    if (!response.ok) {
      this.logger.error(
        `Ollama embed failed: ${response.status} ${response.statusText}`,
      );
      throw new Error(
        `Ollama embedding request failed with status ${response.status}`,
      );
    }

    const data = (await response.json()) as { embeddings: number[][] };

    return data.embeddings[0];
  }
}
