import * as React from 'react'
import { IConventionalCommitLintError } from '../../lib/lint-conventional-commit'
import { ICommitContext } from '../../models/commit'
import { DefaultCommitMessage } from '../../models/commit-message'
import { Repository } from '../../models/repository'
import { Dialog, DialogContent, DialogFooter } from '../dialog'
import { OkCancelButtonGroup } from '../dialog/ok-cancel-button-group'
import { Dispatcher } from '../dispatcher'
import { LinkButton } from '../lib/link-button'

const conventionalCommitsWebsiteURL = 'https://www.conventionalcommits.org/'

interface IInvalidCommitProps {
  readonly onDismissed: () => void
  readonly dispatcher: Dispatcher
  readonly context: ICommitContext
  readonly repository: Repository
  readonly conventionalCommitValidationErrors: ReadonlyArray<IConventionalCommitLintError>
}

/** A dialog to warn about invalid conventional commit format. */
export class InvalidConventionalCommitWarning extends React.Component<IInvalidCommitProps> {
  public constructor(props: IInvalidCommitProps) {
    super(props)
  }

  public render() {
    return (
      <Dialog
        id="invalid-commit"
        title={__DARWIN__ ? 'Invalid Commit Format' : 'Invalid commit format'}
        onSubmit={this.onSubmit}
        onDismissed={this.props.onDismissed}
        type="warning"
      >
        <DialogContent>
          <p>
            Your commit message does not follow the{' '}
            <LinkButton uri={conventionalCommitsWebsiteURL}>
              Conventional Commits
            </LinkButton>{' '}
            format.
          </p>
          <p>The following errors were found:</p>
          <ul className="validation-errors">
            {this.props.conventionalCommitValidationErrors.map((error, i) => (
              <li key={i} className="error-item">
                {error.message}
              </li>
            ))}
          </ul>
          <p>The commit message should be structured as follows:</p>
          <pre>type(scope): description [optional body] [optional footer]</pre>
          <p>Common types: feat, fix, docs, style, refactor, test, chore</p>
        </DialogContent>

        <DialogFooter>
          <OkCancelButtonGroup
            destructive={true}
            okButtonText={__DARWIN__ ? 'Commit Anyway' : 'Commit anyway'}
          />
        </DialogFooter>
      </Dialog>
    )
  }

  private onSubmit = async () => {
    this.props.onDismissed()

    await this.props.dispatcher.commitIncludedChanges(
      this.props.repository,
      this.props.context
    )

    this.props.dispatcher.setCommitMessage(
      this.props.repository,
      DefaultCommitMessage
    )
  }
}
