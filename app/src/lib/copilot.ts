import { Repository } from '../models/repository'
import { join, dirname } from 'path'
import { pathExists as realPathExists } from '../ui/lib/path-exists'
import {
  readFile as realReadFile,
  writeFile as realWriteFile,
  mkdir as realMkdir,
} from 'fs/promises'
import { getPath as realGetPath } from '../ui/main-process-proxy'

/**
 * The subset of file system and main process dependencies that are used by the
 * copilot module. This allows for providing mock implementations for testing.
 */
export interface ICopilotDependencies {
  readonly pathExists: (path: string) => Promise<boolean>
  readonly readFile: (path: string) => Promise<string>
  readonly writeFile: (path: string, data: string) => Promise<void>
  readonly mkdir: (
    path: string,
    options: { readonly recursive: true }
  ) => Promise<void>
  readonly getPath: (name: 'userData') => Promise<string>
}

const defaultDependencies: ICopilotDependencies = {
  pathExists: realPathExists,
  readFile: path => realReadFile(path, 'utf8'),
  writeFile: realWriteFile,
  // The node fs.promises.mkdir function returns the path of the created
  // directory, but we don't need it, so we'll just ignore it.
  mkdir: async (path, options) => {
    await realMkdir(path, options)
  },
  getPath: realGetPath,
}

const copilotWorkspaceInstructionsFileName = 'git-commit-instructions.md'
const copilotGlobalInstructionsFileName = 'global-git-commit-instructions.md'

export type CopilotCommitMessageInstructions = {
  readonly instructions: string | null
  readonly source: 'workspace' | 'global' | null
  readonly sourcePath?: string
}

export class CopilotManager {
  private readonly dependencies: ICopilotDependencies

  public constructor(dependencies: ICopilotDependencies = defaultDependencies) {
    this.dependencies = dependencies
  }

  private async ensureFile(path: string): Promise<void> {
    if (await this.dependencies.pathExists(path)) {
      return
    }

    const parentDir = dirname(path)
    if (!(await this.dependencies.pathExists(parentDir))) {
      await this.dependencies.mkdir(parentDir, { recursive: true })
    }
    await this.dependencies.writeFile(path, '')
  }

  public getWorkspaceInstructionsPath(repository: Repository): string {
    return join(
      repository.path,
      '.github',
      copilotWorkspaceInstructionsFileName
    )
  }

  public async getGlobalInstructionsPath(): Promise<string> {
    const userData = await this.dependencies.getPath('userData')
    return join(userData, 'copilot', copilotGlobalInstructionsFileName)
  }

  public async workspaceInstructionsExist(
    repository: Repository
  ): Promise<boolean> {
    const path = this.getWorkspaceInstructionsPath(repository)
    return this.dependencies.pathExists(path)
  }

  public async globalInstructionsExist(): Promise<boolean> {
    const path = await this.getGlobalInstructionsPath()
    return this.dependencies.pathExists(path)
  }

  private async readInstructionsFromFile(path: string): Promise<string | null> {
    if (await this.dependencies.pathExists(path)) {
      const content = await this.dependencies.readFile(path)
      // Don't return empty instructions.
      return content.trim().length > 0 ? content : null
    }
    return null
  }

  public async resolveCopilotInstructions(
    repository: Repository | null
  ): Promise<CopilotCommitMessageInstructions> {
    const sources: ReadonlyArray<{
      source: 'workspace' | 'global'
      getPath: () => Promise<string | null> | string | null
    }> = [
      {
        source: 'workspace',
        getPath: () =>
          repository ? this.getWorkspaceInstructionsPath(repository) : null,
      },
      {
        source: 'global',
        getPath: () => this.getGlobalInstructionsPath(),
      },
    ]

    for (const { source, getPath } of sources) {
      const path = await getPath()
      if (path === null) {
        continue
      }

      const instructions = await this.readInstructionsFromFile(path)
      if (instructions !== null) {
        return { instructions, source, sourcePath: path }
      }
    }

    return { instructions: null, source: null }
  }

  public async ensureWorkspaceInstructions(
    repository: Repository
  ): Promise<string> {
    const path = this.getWorkspaceInstructionsPath(repository)
    await this.ensureFile(path)
    return path
  }

  public async ensureGlobalInstructions(): Promise<string> {
    const path = await this.getGlobalInstructionsPath()
    await this.ensureFile(path)
    return path
  }
}

/**
 * The singleton instance of the CopilotManager.
 *
 * This should be used for all interactions with the copilot instructions
 * feature.
 */
export const copilotManager = new CopilotManager()
