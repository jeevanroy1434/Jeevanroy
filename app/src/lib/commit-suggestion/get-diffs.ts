import { Repository } from '../../models/repository'
import {
  getStagedChanges,
  getUnstagedChanges,
  getUntrackedFiles,
  getUntrackedFileContent,
  getLastCommitMessage,
} from '../git'

async function getDiffs(repository: Repository): Promise<string> {
  const allChanges: string[] = []

  const stagedDiff = await getStagedChanges(repository)
  const unstagedDiff = await getUnstagedChanges(repository)
  const lastCommit = await getLastCommitMessage(repository)

  const untrackedFiles = await getUntrackedFiles(repository)
  const untrackedContent: string[] = []
  for (const file of untrackedFiles) {
    untrackedContent.push(await getUntrackedFileContent(repository, file))
  }

  if (lastCommit) {
    allChanges.push(`Last commit message:\n${lastCommit}`)
  }
  if (stagedDiff) {
    allChanges.push(`=== Staged changes ===\n${stagedDiff}`)
  }
  if (unstagedDiff) {
    allChanges.push(`=== Unstaged changes ===\n${unstagedDiff}`)
  }
  if (untrackedContent.length > 0) {
    allChanges.push(
      `=== Untracked files content ===\n${untrackedContent.join('\n\n')}`
    )
  }

  return allChanges.join('\n')
}

export { getDiffs }
