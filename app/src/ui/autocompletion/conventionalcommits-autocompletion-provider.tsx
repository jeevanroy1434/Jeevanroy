import * as React from 'react'
import { IAutocompletionProvider } from './index'
import {
  useConventionalCommitsKey,
  useConventionalCommitsDefault,
} from '../../lib/stores'

import { getBoolean } from '../../lib/local-storage'

export interface ICommitType {
  text: string
  description?: string
}

/** The autocompletion provider for predefined suggestions. */
export class ConventionalCommitsProvider
  implements IAutocompletionProvider<ICommitType>
{
  public readonly kind = 'conventional-commits'

  private readonly suggestions: ICommitType[] = [
    { text: 'feat', description: 'A new feature' },
    { text: 'fix', description: 'A bug fix' },
    { text: 'docs', description: 'Documentation only changes' },
    {
      text: 'style',
      description: 'Changes that do not affect the meaning of the code',
    },
    {
      text: 'refactor',
      description: 'A code change that neither fixes a bug nor adds a feature',
    },
    { text: 'perf', description: 'A code change that improves performance' },
    {
      text: 'test',
      description: 'Adding missing tests or correcting existing tests',
    },
    {
      text: 'build',
      description:
        'Changes that affect the build system or external dependencies',
    },
    {
      text: 'ci',
      description: 'Changes to CI configuration files and scripts',
    },
    {
      text: 'chore',
      description: 'Changes to the build process or auxiliary tools',
    },
    { text: 'revert', description: 'Reverts a previous commit' },
    { text: 'wip', description: 'Work in progress' },
  ]

  public constructor() {}

  public getRegExp(): RegExp {
    return /^([a-z]+)(?:[:])?$/gi
  }

  public async getAutocompletionItems(
    text: string
  ): Promise<ReadonlyArray<ICommitType>> {
    // return no autocompletion if useConventionalCommits is turned off
    if (!getBoolean(useConventionalCommitsKey, useConventionalCommitsDefault)) {
      return []
    }

    const items = this.suggestions.filter(item =>
      item.text.toLowerCase().startsWith(text.toLowerCase())
    )

    return items
  }

  public getItemAriaLabel(item: ICommitType): string {
    return `${item.text}${item.description ? ` - ${item.description}` : ''}`
  }

  public renderItem(item: ICommitType): JSX.Element {
    return (
      <div className="conventional-commits" key={item.text}>
        <span className="text">{item.text}</span>
        {item.description && (
          <span className="description"> {item.description}</span>
        )}
      </div>
    )
  }

  public getCompletionText(item: ICommitType): string {
    return `${item.text}:`
  }
}
