export interface Collaboration<TInput, TOutput> {
  run(input: TInput): Promise<TOutput>
}