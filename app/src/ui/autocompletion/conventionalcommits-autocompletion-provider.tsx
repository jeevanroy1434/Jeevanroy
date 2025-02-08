import * as React from 'react'
import { IAutocompletionProvider } from './index'

interface ISuggestionItem {
  text: string
  description?: string
}

/** The autocompletion provider for predefined suggestions. */
export class ConventionalCommitsProvider
  implements IAutocompletionProvider<ISuggestionItem>
{
  public readonly kind = 'conventional-commits'

  private readonly suggestions: ISuggestionItem[] = [
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
    {
      text: 'test',
      description: 'Adding missing tests or correcting existing tests',
    },
    {
      text: 'chore',
      description: 'Changes to the build process or auxiliary tools',
    },
  ]

  public constructor() {}

  public getRegExp(): RegExp {
    return /(?:^|\n| )([a-z\d\\+-][a-z\d_]*)?/g
  }

  public async getAutocompletionItems(
    text: string,
    wholeText?: string
  ): Promise<ReadonlyArray<ISuggestionItem>> {
    // return no autocompletion if its not the beginning of text
    if (
      wholeText?.includes(' ') ||
      this.suggestions.some(item => wholeText?.includes(item.text))
    ) {
      return []
    }

    const items = this.suggestions.filter(item =>
      item.text.toLowerCase().startsWith(text.toLowerCase())
    )

    return items
  }

  public getItemAriaLabel(item: ISuggestionItem): string {
    return `${item.text}${item.description ? ` - ${item.description}` : ''}`
  }

  public renderItem(item: ISuggestionItem): JSX.Element {
    return (
      <div className="conventional-commits" key={item.text}>
        <span className="text">{item.text}</span>
        {item.description && (
          <span className="description"> {item.description}</span>
        )}
      </div>
    )
  }

  public getCompletionText(item: ISuggestionItem): string {
    return item.text
  }
}
