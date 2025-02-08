import * as React from 'react'
import { DialogContent } from '../dialog'
import { Checkbox, CheckboxValue } from '../lib/checkbox'

interface IAccessibilityPreferencesProps {
  readonly underlineLinks: boolean
  readonly onUnderlineLinksChanged: (value: boolean) => void

  readonly showDiffCheckMarks: boolean
  readonly onShowDiffCheckMarksChanged: (value: boolean) => void

  readonly useConventionalCommits: boolean
  readonly onUseConventionalCommits: (value: boolean) => void
}

export class Accessibility extends React.Component<
  IAccessibilityPreferencesProps,
  {}
> {
  public constructor(props: IAccessibilityPreferencesProps) {
    super(props)
  }

  public render() {
    return (
      <DialogContent>
        <div className="advanced-section">
          <h2>Accessibility</h2>
          <Checkbox
            label="Underline links"
            value={
              this.props.underlineLinks ? CheckboxValue.On : CheckboxValue.Off
            }
            onChange={this.onUnderlineLinksChanged}
            ariaDescribedBy="underline-setting-description"
          />
          <p
            id="underline-setting-description"
            className="git-settings-description"
          >
            When enabled, GitHub Desktop will underline links in commit
            messages, comments, and other text fields. This can help make links
            easier to distinguish. {this.renderExampleLink()}
          </p>

          <Checkbox
            label="Show check marks in the diff"
            value={
              this.props.showDiffCheckMarks
                ? CheckboxValue.On
                : CheckboxValue.Off
            }
            onChange={this.onShowDiffCheckMarksChanged}
            ariaDescribedBy="diff-checkmarks-setting-description"
          />
          <p
            id="diff-checkmarks-setting-description"
            className="git-settings-description"
          >
            When enabled, check marks will be displayed along side the line
            numbers and groups of line numbers in the diff when committing. When
            disabled, the line number controls will be less prominent.
          </p>

          <Checkbox
            label="Use conventional commits"
            value={
              this.props.useConventionalCommits
                ? CheckboxValue.On
                : CheckboxValue.Off
            }
            onChange={this.onUseConventionalCommitsChanged}
            ariaDescribedBy="conventional-commits-description"
          />
          <p
            id="conventional-commits-description"
            className="git-settings-description"
          >
            When enabled, it will provide suggestions to follow the conventional
            commit format when writing commit messages. It helps validate your
            commit messages according to standardized formatting rules.
          </p>
        </div>
      </DialogContent>
    )
  }

  private renderExampleLink() {
    // The example link is rendered with inline style to override the global setting.
    const style = {
      textDecoration: this.props.underlineLinks ? 'underline' : 'none',
    }

    return (
      <span className="link-button-component" style={style}>
        This is an example link
      </span>
    )
  }

  private onUnderlineLinksChanged = (
    event: React.FormEvent<HTMLInputElement>
  ) => {
    this.props.onUnderlineLinksChanged(event.currentTarget.checked)
  }

  private onShowDiffCheckMarksChanged = (
    event: React.FormEvent<HTMLInputElement>
  ) => {
    this.props.onShowDiffCheckMarksChanged(event.currentTarget.checked)
  }

  private onUseConventionalCommitsChanged = (
    event: React.FormEvent<HTMLInputElement>
  ) => {
    this.props.onUseConventionalCommits(event.currentTarget.checked)
  }
}
