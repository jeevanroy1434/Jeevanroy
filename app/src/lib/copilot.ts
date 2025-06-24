import { Repository } from '../models/repository'
import { getPath } from '../ui/main-process-proxy'
import { pathExists } from '../ui/lib/path-exists'
import { readFile, writeFile, mkdir } from 'fs/promises'
import * as Path from 'path'

/**
 * The filename for the workspace-level Copilot instructions file.
 */
export const copilotWorkspaceInstructionsFileName = 'git-commit-instructions.md'

/**
 * The filename for the global Copilot instructions file.
 */
export const copilotGlobalInstructionsFileName =
  'global-git-commit-instructions.md'

/**
 * The path to the workspace-level Copilot instructions file.
 */
export function getWorkspaceInstructionsPath(repository: Repository): string {
  return Path.join(
    repository.path,
    '.github',
    copilotWorkspaceInstructionsFileName
  )
}

/**
 * The path to the global Copilot instructions file.
 */
export async function getGlobalInstructionsPath(): Promise<string> {
  // We're using `getPath('userData')` here, which corresponds to Electron's
  // app.getPath('userData'). This is the correct, writable location for user-
  // specific configuration files.
  const userData = await getPath('userData')
  return Path.join(userData, 'copilot', copilotGlobalInstructionsFileName)
}

/**
 * Ensures the workspace-level Copilot instructions file exists and returns its path.
 * If the file does not exist, it will be created.
 */
export async function ensureWorkspaceInstructions(
  repository: Repository
): Promise<string> {
  const path = getWorkspaceInstructionsPath(repository)
  if (!(await pathExists(path))) {
    const parentDir = Path.dirname(path)
    if (!(await pathExists(parentDir))) {
      // .github folder doesn't exist, so create it.
      await mkdir(parentDir, { recursive: true })
    }
    await writeFile(path, '')
  }
  return path
}

/**
 * Ensures the global Copilot instructions file exists and returns its path.
 * If the file does not exist, it will be created.
 */
export async function ensureGlobalInstructions(): Promise<string> {
  const path = await getGlobalInstructionsPath()
  if (!(await pathExists(path))) {
    const parentDir = Path.dirname(path)
    if (!(await pathExists(parentDir))) {
      await mkdir(parentDir, { recursive: true })
    }
    await writeFile(path, '')
  }
  return path
}

/**
 * Checks if the workspace-level Copilot instructions file exists.
 */
export async function workspaceInstructionsExist(
  repository: Repository
): Promise<boolean> {
  return pathExists(getWorkspaceInstructionsPath(repository))
}

/**
 * Checks if the global Copilot instructions file exists.
 */
export async function globalInstructionsExist(): Promise<boolean> {
  return pathExists(await getGlobalInstructionsPath())
}

export type CopilotCommitMessageInstructions = {
  readonly instructions: string | null
  readonly source: 'workspace' | 'global' | null
  readonly sourcePath?: string
}

async function readInstructionsFromFile(path: string): Promise<string | null> {
  if (await pathExists(path)) {
    const content = await readFile(path, 'utf8')
    // Don't return empty instructions.
    return content.trim().length > 0 ? content : null
  }
  return null
}

export async function resolveCopilotInstructions(
  repository: Repository | null
): Promise<CopilotCommitMessageInstructions> {
  if (repository !== null) {
    const workspacePath = getWorkspaceInstructionsPath(repository)
    const workspaceInstructions = await readInstructionsFromFile(workspacePath)
    if (workspaceInstructions !== null) {
      return {
        instructions: workspaceInstructions,
        source: 'workspace',
        sourcePath: workspacePath,
      }
    }
  }

  const globalPath = await getGlobalInstructionsPath()
  const globalInstructions = await readInstructionsFromFile(globalPath)
  if (globalInstructions !== null) {
    return {
      instructions: globalInstructions,
      source: 'global',
      sourcePath: globalPath,
    }
  }

  return {
    instructions: null,
    source: null,
  }
}
