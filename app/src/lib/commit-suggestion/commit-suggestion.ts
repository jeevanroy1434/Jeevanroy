/* eslint-disable */
import { OllamaModel } from './models/ollama-model'
import { Repository } from '../../models/repository'
import { getDiffs } from './get-diffs'

const model = new OllamaModel('http://localhost:11434')

async function generateCommitSuggestion(
  repository: Repository
): Promise<[boolean, any]> {
  const diffs: string = await getDiffs(repository)

  const prompt = `Analyze the following git changes and return a JSON object with the following keys, adhering strictly to the structure and guidelines below:
  1. 'type': Specify the type of change, which must be one of the following options: [feat, fix, docs, style, refactor, test, chore].
  2. 'scope': Indicate the specific component, module, or area of the code affected by the change (this field is optional and can be omitted if not applicable).
  3. 'message': Provide a brief, clear description of the change, limited to 50 characters or fewer.
  4. 'body': Include a detailed explanation of the change, explaining both what was changed and why it was necessary (this should be written in complete sentences).
  5. 'breaking': A boolean value (true/false) indicating whether this change introduces a breaking change.

  IMPORTANT: Only return the JSON object and no additional characters or commentary. The response must be in this format:
  {
    "type": "",
    "scope": "",
    "message": "",
    "body": "",
    "breaking": false
  }

  Git changes:
  ${diffs}`

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
