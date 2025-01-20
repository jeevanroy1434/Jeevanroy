/* eslint-disable */
import { OllamaModel } from './models/ollama-model'
import { Repository } from '../../models/repository'
import { getDiffs } from './get-diffs'

const model = new OllamaModel('http://localhost:11434')

async function generateCommitSuggestion(
  repository: Repository
): Promise<[boolean, any]> {
  const diffs: string = await getDiffs(repository)

  const prompt = `Analyze the provided Git diffs and generate a exactly one JSON object with the structure below. DO NOT include any other text or explanation. The JSON object should STRICTLY follow this format:

    1. 'type': Identify the type of change. It must be one of the following: [feat, fix, docs, style, refactor, test, chore]. Do not use any other types.
    2. 'scope': (Optional) If applicable, specify the component, module, or area of the code that was affected. If there's no clear scope, leave this field out.
    3. 'message': Provide a clear and concise summary of the change, with a maximum of 50 characters. Ensure it captures the essence of the change. The summary must strictly follow the format.
    4. 'body': Provide a detailed explanation of what the change entails and why it was necessary with a maximum of 100 characters. Include any relevant context or rationale for the change. Do not include any additional or extraneous information.
    5. 'breaking': Boolean value (true/false). Specify whether the change introduces a breaking change that may impact the codebase or dependent projects. This must be accurate and strictly follow the Git diff content.

  Return ONLY the JSON in the following format, with no additional text like this:
  \`\`\`json
  {
      "type": "",
      "scope": "",
      "message": "",
      "body": "",
      "breaking": false
  }
  \`\`\`

  Git Diffs:
  \`\`\`
  ${diffs}
  \`\`\`
  `

  const [success, response, time] = await model.generateResponse(prompt)
  if (success) {
    log.info(`Time taken for generating response: ${time}`)
    return [true, response]
  } else {
    log.error(`Failed to generate commit suggestion.`)
    log.error(response)
    return [false, response]
  }
}

export { generateCommitSuggestion }
