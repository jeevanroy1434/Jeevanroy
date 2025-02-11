import { Repository } from '../../../../app/src/models/repository'
import {
  WorkingDirectoryFileChange,
  CommittedFileChange,
} from '../../../../app/src/models/status'
import { FileChange } from '../../../../app/src/models/status'
import { DiffType } from '../../../../app/src/models/diff'

interface ScrapedDiff {
  path: string
  status: string
  additions: string[]
  deletions: string[]
  hunks: Array<{
    oldStart: number
    oldLines: number
    newStart: number
    newLines: number
    content: string
  }>
}

export class DiffScraper {
  private readonly repository: Repository
  private trackedFiles: Map<string, FileChange> = new Map()

  constructor(repository: Repository) {
    this.repository = repository
  }

  /**
   * Track files for changes
   */
  public trackFiles(
    files: ReadonlyArray<CommittedFileChange | WorkingDirectoryFileChange>
  ) {
    for (const file of files) {
      this.trackedFiles.set(file.path, file)
      console.log('Tracking file:', file.path, 'Status:', file.status)
    }
  }

  /**
   * Get all current diffs from tracked files
   */
  public async getCurrentDiffs(): Promise<ScrapedDiff[]> {
    try {
      const diffs: ScrapedDiff[] = []

      for (const file of this.trackedFiles.values()) {
        const diff = await this.getDiffForFile(file)
        if (diff) {
          diffs.push(diff)
        }
      }

      return diffs
    } catch (error) {
      console.error('Error getting current diffs:', error)
      return []
    }
  }

  /**
   * Get diff for a specific file
   */
  public async getDiffForFile(file: FileChange): Promise<ScrapedDiff | null> {
    try {
      // Here we'll integrate with GitHub Desktop's diff functionality
      // For now, create a placeholder diff
      const placeholderDiff: ScrapedDiff = {
        path: file.path,
        status: file.status.toString(),
        additions: [],
        deletions: [],
        hunks: [],
      }

      console.log('Getting diff for file:', file.path, 'Status:', file.status)
      return placeholderDiff
    } catch (error) {
      console.error('Error getting diff for file:', error)
      return null
    }
  }

  /**
   * Get all tracked files
   */
  public getTrackedFiles(): ReadonlyArray<FileChange> {
    return Array.from(this.trackedFiles.values())
  }

  /**
   * Clear tracked files
   */
  public clearTrackedFiles() {
    this.trackedFiles.clear()
  }

  /**
   * Get all staged diffs
   */
  public async getStagedDiffs(): Promise<ScrapedDiff[]> {
    try {
      console.log('Getting staged diffs')
      return []
    } catch (error) {
      console.error('Error getting staged diffs:', error)
      return []
    }
  }

  /**
   * Get all unstaged diffs
   */
  public async getUnstagedDiffs(): Promise<ScrapedDiff[]> {
    try {
      console.log('Getting unstaged diffs')
      return []
    } catch (error) {
      console.error('Error getting unstaged diffs:', error)
      return []
    }
  }

  /**
   * Format the scraped diffs into a readable format for the AI
   */
  private formatDiffForAI(diff: ScrapedDiff): string {
    const { path, status, additions, deletions, hunks } = diff
    return `
File: ${path}
Status: ${status}
Changes:
${hunks
  .map(
    hunk => `
@@ -${hunk.oldStart},${hunk.oldLines} +${hunk.newStart},${hunk.newLines} @@
${hunk.content}
`
  )
  .join('\n')}
    `.trim()
  }
}
