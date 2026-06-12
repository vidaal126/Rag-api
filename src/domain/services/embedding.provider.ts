export abstract class IEmbeddingProvider {
  abstract embed(text: string): Promise<number[]>;
}
