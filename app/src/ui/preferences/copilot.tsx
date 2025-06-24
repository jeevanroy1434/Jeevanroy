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
import { LinkButton } from '../lib/link-button'

interface ICopilotPreferencesProps {
  readonly repository: Repository | null
  readonly onOpenPathInExternalEditor: (path: string) => void
}

interface ICopilotPreferencesState {
  readonly workspaceInstructionsExist: boolean
  readonly globalInstructionsExist: boolean
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

export class Copilot extends React.Component<
  ICopilotPreferencesProps,
  ICopilotPreferencesState
> {
  public constructor(props: ICopilotPreferencesProps) {
    super(props)
    this.state = {
      workspaceInstructionsExist: false,
      globalInstructionsExist: false,
    }
  }

  public componentDidMount() {
    this.updateFileExistsState()
  }

  public componentDidUpdate(prevProps: ICopilotPreferencesProps) {
    if (this.props.repository?.id !== prevProps.repository?.id) {
      this.updateFileExistsState()
    }
  }

  private updateFileExistsState = async () => {
    const globalExists = await globalInstructionsExist()
    const workspaceExists =
      this.props.repository !== null
        ? await workspaceInstructionsExist(this.props.repository)
        : false

    this.setState({
      globalInstructionsExist: globalExists,
      workspaceInstructionsExist: workspaceExists,
    })
  }

  private onOpenWorkspaceInstructions = async () => {
    if (this.props.repository !== null) {
      const path = await ensureWorkspaceInstructions(this.props.repository)
      this.props.onOpenPathInExternalEditor(path)
      this.updateFileExistsState()
    }
  }

  private onOpenGlobalInstructions = async () => {
    const path = await ensureGlobalInstructions()
    this.props.onOpenPathInExternalEditor(path)
    this.updateFileExistsState()
  }

  public render() {
    const { repository } = this.props
    const { workspaceInstructionsExist, globalInstructionsExist } = this.state

    return (
      <DialogContent>
        <h2>GitHub Copilot</h2>
        <p className="git-settings-description">
          Provide custom instructions to GitHub Copilot for generating commit
          messages. Workspace instructions override global instructions. Learn
          more about configuring GitHub Copilot in GitHub Desktop{' '}
          <LinkButton uri="https://docs.github.com/en/desktop/configuring-and-customizing-github-desktop/configuring-github-copilot-in-github-desktop">
            here
          </LinkButton>
          .
        </p>

        <InstructionsFileSetting
          title="Workspace Instructions"
          description="Instructions specific to this repository."
          buttonLabel={
            workspaceInstructionsExist
              ? 'Edit instructions'
              : 'Create instructions'
          }
          fileStatus={
            repository === null
              ? ''
              : workspaceInstructionsExist
              ? 'File exists at .github/git-commit-instructions.md'
              : 'File will be created at .github/git-commit-instructions.md'
          }
          onButtonClick={this.onOpenWorkspaceInstructions}
          disabled={repository === null}
        />

        <InstructionsFileSetting
          title="Global Instructions"
          description="Instructions that apply to all repositories."
          buttonLabel={
            globalInstructionsExist ? 'Edit instructions' : 'Create instructions'
          }
          fileStatus={
            globalInstructionsExist
              ? 'Global instructions file exists.'
              : 'Global instructions file does not exist.'
          }
          onButtonClick={this.onOpenGlobalInstructions}
        />
      </DialogContent>
    )
  }
}
