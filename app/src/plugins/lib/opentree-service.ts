import { Repository } from '../../../../app/src/models/repository'
import { DiffMonitor } from './diff-monitor'
import { WorkingDirectoryFileChange } from '../../../../app/src/models/status'

class OpenTreeService {
  private diffMonitor: DiffMonitor | null = null

  public initialize(repository: Repository): void {
    this.diffMonitor = new DiffMonitor(repository)
    console.log('OpenTreeService initialized')
  }

  public async handleFileChange(
    file: WorkingDirectoryFileChange
  ): Promise<void> {
    if (!this.diffMonitor) {
      console.warn('OpenTreeService not initialized')
      return
    }

    await this.diffMonitor.processDiff(file)
  }
}

// Create and export a singleton instance
export const openTreeService = new OpenTreeService()
