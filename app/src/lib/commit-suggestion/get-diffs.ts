import { Repository } from '../../models/repository'
import {
  getStagedChanges,
  getUnstagedChanges,
  getUntrackedFiles,
  getUntrackedFileContent,
} from '../git'

async function getDiffs(repository: Repository): Promise<string> {
  const allChanges: string[] = []
  const MAX_FILE_SIZE = 1024 * 1024 // 1MB limit

  const ignoredFileTypes = [
    '.png',
    '.jpg',
    '.jpeg',
    '.gif',
    '.svg',
    '.ico',
    '.lock',
    '.pdf',
    '.zip',
    '.bin',
    '.tar',
    '.gz',
    '.7z',
    '.mp3',
    '.mp4',
    '.avi',
    '.mov',
    '.ttf',
  ]

  const stagedDiff = await getStagedChanges(repository)
  const unstagedDiff = await getUnstagedChanges(repository)

  const untrackedFiles = await getUntrackedFiles(repository)
  const untrackedContent: string[] = []
  for (const file of untrackedFiles) {
    const fileExt = file.toLowerCase().substring(file.lastIndexOf('.'))
    const content = await getUntrackedFileContent(repository, file)
    if (!ignoredFileTypes.includes(fileExt) && content.length < MAX_FILE_SIZE) {
      untrackedContent.push(content)
    }
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
