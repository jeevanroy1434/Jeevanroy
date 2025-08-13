import * as React from 'react'
import { DialogContent } from '../dialog'
import { Account } from '../../models/account'
import { GitConfigUserForm } from '../lib/git-config-user-form'
import { Row } from '../lib/row'
import { RadioGroup } from '../lib/radio-group'
import { assertNever } from '../../lib/fatal-error'
import memoizeOne from 'memoize-one'
import { Checkbox, CheckboxValue } from '../lib/checkbox'

interface IGitConfigProps {
  readonly account: Account | null

  readonly gitConfigLocation: GitConfigLocation
  readonly name: string
  readonly email: string
  readonly globalName: string
  readonly globalEmail: string
  readonly isLoadingGitConfig: boolean
  readonly skipGitHooks: boolean

  readonly onGitConfigLocationChanged: (value: GitConfigLocation) => void
  readonly onNameChanged: (name: string) => void
  readonly onEmailChanged: (email: string) => void
  readonly onSkipGitHooksChanged: (checked: boolean) => void
}

export enum GitConfigLocation {
  Global = 'Global',
  Local = 'Local',
}

/** A view for creating or modifying the repository's gitignore file */
export class GitConfig extends React.Component<IGitConfigProps> {
  // To avoid recreating the accounts array on every render
  private getAccounts = memoizeOne((account: Account | null) =>
    account ? [account] : []
  )

  private onGitConfigLocationChanged = (value: GitConfigLocation) => {
    this.props.onGitConfigLocationChanged(value)
  }

  private onSkipGitHooksChanged = (
    event: React.FormEvent<HTMLInputElement>
  ) => {
    this.props.onSkipGitHooksChanged(event.currentTarget.checked)
  }

  private renderConfigOptionLabel = (key: GitConfigLocation) => {
    switch (key) {
      case GitConfigLocation.Global:
        return 'Use my global Git config'
      case GitConfigLocation.Local:
        return 'Use a local Git config'
      default:
        return assertNever(key, `Unknown git config location: ${key}`)
    }
  }

  public render() {
    const configOptions = [GitConfigLocation.Global, GitConfigLocation.Local]
    const selectionOption =
      configOptions.find(o => o === this.props.gitConfigLocation) ??
      GitConfigLocation.Global

    return (
      <DialogContent>
        <div className="advanced-section">
          <h2 id="git-config-heading">For this repository I wish to</h2>
          <Row>
            <RadioGroup<GitConfigLocation>
              ariaLabelledBy="git-config-heading"
              selectedKey={selectionOption}
              radioButtonKeys={configOptions}
              onSelectionChanged={this.onGitConfigLocationChanged}
              renderRadioButtonLabelContents={this.renderConfigOptionLabel}
            />
          </Row>
          <GitConfigUserForm
            email={
              this.props.gitConfigLocation === GitConfigLocation.Global
                ? this.props.globalEmail
                : this.props.email
            }
            name={
              this.props.gitConfigLocation === GitConfigLocation.Global
                ? this.props.globalName
                : this.props.name
            }
            accounts={this.getAccounts(this.props.account)}
            disabled={this.props.gitConfigLocation === GitConfigLocation.Global}
            onEmailChanged={this.props.onEmailChanged}
            onNameChanged={this.props.onNameChanged}
            isLoadingGitConfig={this.props.isLoadingGitConfig}
          />
          <Checkbox
            className="skip-git-hooks-checkbox"
            label="Skip Git hooks for commits and pushes in this repository"
            value={
              this.props.skipGitHooks ? CheckboxValue.On : CheckboxValue.Off
            }
            onChange={this.onSkipGitHooksChanged}
          />
        </div>
      </DialogContent>
    )
  }
}
