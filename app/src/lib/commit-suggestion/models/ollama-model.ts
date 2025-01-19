/* eslint-disable */

import axios, { AxiosResponse } from 'axios'
import { AsyncBaseAIModel } from '../models/model'

export class OllamaModel extends AsyncBaseAIModel {
  private endpoint: string
  private modelName: string

  constructor(
    endpoint: string,
    modelName: string = 'llama3.2:latest',
    config: any = {}
  ) {
    super('ollama', config)
    this.endpoint = endpoint.replace(/\/$/, '')
    this.modelName = modelName
  }

  async generateResponse(
    prompt: string,
    _config: any = {}
  ): Promise<[boolean, any, number]> {
    const headers = {
      'Content-Type': 'application/json',
    }

    const payload = {
      model: this.modelName,
      prompt: prompt,
      stream: false,
    }

    const startTime = Date.now()

    try {
      const response: AxiosResponse = await axios.post(
        `${this.endpoint}/api/generate`,
        payload,
        { headers }
      )

      const elapsedTime = (Date.now() - startTime) / 1000

      if (response.status === 200) {
        const validation = this.isJsonValid(response.data.response)
        if (!validation) {
          console.log('Response is not valid JSON.')
          return [false, response.data.response, Infinity]
          // throw new Error('Response is not valid JSON')
        }

        return [true, JSON.parse(response.data.response), elapsedTime]
      } else {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }
    } catch (error) {
      return [false, {}, Infinity]
    }
  }

  async getModelInfo(): Promise<Record<string, any>> {
    return {}
  }
}
