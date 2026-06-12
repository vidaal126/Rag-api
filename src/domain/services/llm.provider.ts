export abstract class ILlmProvider {
  abstract generate(prompt: string): Promise<string>;
}
