import * as React from 'react'
import { DialogContent } from '../dialog'
import { TextArea } from '../lib/text-area'

interface ICopilotPreferencesProps {
  readonly copilotCustomInstructions: string | null
  readonly onCopilotCustomInstructionsChanged: (instructions: string) => void
}

export class Copilot extends React.Component<ICopilotPreferencesProps> {
  private onCopilotCustomInstructionsChanged = (
    event: React.FormEvent<HTMLTextAreaElement>
  ) => {
    this.props.onCopilotCustomInstructionsChanged(event.currentTarget.value)
  }

  public render() {
    return (
      <DialogContent>
        <div className="advanced-section">
          <h2>GitHub Copilot</h2>
          <p className="git-settings-description">
            Provide custom instructions to GitHub Copilot for generating commit
            messages. This will be included along with the diff of your staged
            changes.
          </p>
          <TextArea
            placeholder="e.g., Use the Conventional Commits specification"
            value={this.props.copilotCustomInstructions ?? ''}
            onChange={this.onCopilotCustomInstructionsChanged}
            rows={6}
          />
        </div>
      </DialogContent>
    )
  }
}
