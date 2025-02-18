import { Repository } from '../../../../app/src/models/repository'
import {
  IDiff,
  ITextDiff,
  DiffHunk,
  DiffLine,
  DiffLineType,
} from '../../../../app/src/models/diff'
import { WorkingDirectoryFileChange } from '../../../../app/src/models/status'

export class DiffMonitor {
  private readonly repository: Repository

  constructor(repository: Repository) {
    this.repository = repository
  }

  public async processDiff(file: WorkingDirectoryFileChange): Promise<void> {
    try {
      const diff = await this.getDiffForFile(file)
      if (diff && this.isTextDiff(diff)) {
        this.analyzeDiff(diff, file.path)
      }
    } catch (error) {
      console.error('Error processing diff:', error)
    }
  }

  private async getDiffForFile(
    file: WorkingDirectoryFileChange
  ): Promise<IDiff | null> {
    try {
      // Log repository info to show we're using the instance
      console.log('Repository path:', this.repository.path)
      console.log('File changed:', file.path)
      console.log('Change type:', file.status)

      // TODO: Implement actual diff retrieval using repository.diff() or similar
      // For now, return null as placeholder
      return null
    } catch (error) {
      console.error('Error getting diff:', error)
      return null
    }
  }

  private isTextDiff(diff: IDiff): diff is ITextDiff {
    return 'hunks' in diff
  }

  private analyzeDiff(diff: ITextDiff, filePath: string): void {
    console.log('Analyzing diff for:', filePath)
    console.log('Number of hunks:', diff.hunks.length)

    diff.hunks.forEach((hunk: DiffHunk, index: number) => {
      console.log(`Hunk ${index + 1}:`)
      console.log('Lines changed:', hunk.lines.length)
      console.log('Unified diff start:', hunk.unifiedDiffStart)
      console.log('Unified diff end:', hunk.unifiedDiffEnd)

      // Log the first few lines of changes
      const changedLines = hunk.lines
        .filter(
          (line: DiffLine) =>
            line.type === DiffLineType.Add || line.type === DiffLineType.Delete
        )
        .slice(0, 3)

      console.log('Sample of changes:', changedLines)
    })
  }
}
