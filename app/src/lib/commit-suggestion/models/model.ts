/* eslint-disable */

export abstract class AsyncBaseAIModel {
  protected model_name: string
  protected config: Record<string, any>

  public abstract generateResponse(
    prompt: string,
    options?: Record<string, any>
  ): Promise<[boolean, Record<string, any>, number]>

  public abstract getModelInfo(): Promise<Record<string, any>>

  public constructor(model_name: string, config: Record<string, any> = {}) {
    this.model_name = model_name
    this.config = config
  }

  public isJsonValid(input_string: string): boolean {
    try {
      JSON.parse(input_string)
      return true
    } catch (e) {
      return false
    }
  }
}
