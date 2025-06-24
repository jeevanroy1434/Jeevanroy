import * as React from 'react'
import { DialogContent } from '../dialog'
import { Button } from '../lib/button'
import { Row } from '../lib/row'
import {
  ensureWorkspaceInstructions,
  ensureGlobalInstructions,
  workspaceInstructionsExist,
  globalInstructionsExist,
} from '../../lib/copilot'
import { Repository } from '../../models/repository'

interface ICopilotPreferencesProps {
  readonly repository: Repository | null
  readonly onOpenPathInExternalEditor: (path: string) => void
}

interface IInstructionsFileSettingProps {
  readonly title: string
  readonly description: string
  readonly buttonLabel: string
  readonly fileStatus: string
  readonly onButtonClick: () => void
  readonly disabled?: boolean
}

const InstructionsFileSetting: React.FC<IInstructionsFileSettingProps> = props => {
  return (
    <Row>
      <div className="copilot-instructions-container">
        <h3>{props.title}</h3>
        <p className="git-settings-description">{props.description}</p>
        <Button onClick={props.onButtonClick} disabled={props.disabled}>
          {props.buttonLabel}
        </Button>
        <p className="git-settings-description file-status">
          {props.fileStatus}
        </p>
      </div>
    </Row>
  )
}

export const Copilot: React.FC<ICopilotPreferencesProps> = props => {
  const { repository, onOpenPathInExternalEditor } = props
  const [hasWorkspaceInstructions, setHasWorkspaceInstructions] =
    React.useState(false)
  const [hasGlobalInstructions, setHasGlobalInstructions] = React.useState(false)

  const updateFileExistsState = React.useCallback(async () => {
    const globalExists = await globalInstructionsExist()
    const workspaceExists =
      repository !== null ? await workspaceInstructionsExist(repository) : false

    setHasGlobalInstructions(globalExists)
    setHasWorkspaceInstructions(workspaceExists)
  }, [repository])

  React.useEffect(() => {
    updateFileExistsState()
  }, [updateFileExistsState])

  const onOpenWorkspaceInstructions = React.useCallback(async () => {
    if (repository !== null) {
      const path = await ensureWorkspaceInstructions(repository)
      onOpenPathInExternalEditor(path)
      updateFileExistsState()
    }
  }, [repository, onOpenPathInExternalEditor, updateFileExistsState])

  const onOpenGlobalInstructions = React.useCallback(async () => {
    const path = await ensureGlobalInstructions()
    onOpenPathInExternalEditor(path)
    updateFileExistsState()
  }, [onOpenPathInExternalEditor, updateFileExistsState])

  return (
    <DialogContent>
      <h2>GitHub Copilot</h2>
      <p className="git-settings-description">
        Provide custom instructions to GitHub Copilot for generating commit
        messages. Workspace instructions override global instructions.
      </p>

      <InstructionsFileSetting
        title="Workspace Instructions"
        description="Instructions specific to this repository."
        buttonLabel={
          hasWorkspaceInstructions ? 'Edit instructions' : 'Create instructions'
        }
        fileStatus={
          repository === null
            ? ''
            : hasWorkspaceInstructions
            ? 'File exists at .github/git-commit-instructions.md'
            : 'File will be created at .github/git-commit-instructions.md'
        }
        onButtonClick={onOpenWorkspaceInstructions}
        disabled={repository === null}
      />

      <InstructionsFileSetting
        title="Global Instructions"
        description="Instructions that apply to all repositories."
        buttonLabel={
          hasGlobalInstructions ? 'Edit instructions' : 'Create instructions'
        }
        fileStatus={
          hasGlobalInstructions
            ? 'Global instructions file exists.'
            : 'Global instructions file does not exist.'
        }
        onButtonClick={onOpenGlobalInstructions}
      />
    </DialogContent>
  )
}
