import { Repository } from '../models/repository'
import { getPath } from '../ui/main-process-proxy'
import { pathExists } from '../ui/lib/path-exists'
import { readFile, writeFile, mkdir } from 'fs/promises'
import * as Path from 'path'

/** The filename for the workspace-level Copilot instructions file. */
export const copilotWorkspaceInstructionsFileName = 'git-commit-instructions.md'

/** The filename for the global Copilot instructions file. */
export const copilotGlobalInstructionsFileName =
  'global-git-commit-instructions.md'

/** Gets the path to the workspace-level Copilot instructions file. */
export function getWorkspaceInstructionsPath(repository: Repository): string {
  return Path.join(
    repository.path,
    '.github',
    copilotWorkspaceInstructionsFileName
  )
}

/** Gets the path to the global Copilot instructions file. */
export async function getGlobalInstructionsPath(): Promise<string> {
  const userData = await getPath('userData')
  return Path.join(userData, 'copilot', copilotGlobalInstructionsFileName)
}

/** Ensures a file exists at the given path, creating directories if needed. */
async function ensureFile(path: string): Promise<void> {
  if (!(await pathExists(path))) {
    const parentDir = Path.dirname(path)
    if (!(await pathExists(parentDir))) {
      await mkdir(parentDir, { recursive: true })
    }
    await writeFile(path, '')
  }
}

/** Ensures the workspace-level instructions file exists and returns its path. */
export async function ensureWorkspaceInstructions(
  repository: Repository
): Promise<string> {
  const path = getWorkspaceInstructionsPath(repository)
  await ensureFile(path)
  return path
}

/** Ensures the global instructions file exists and returns its path. */
export async function ensureGlobalInstructions(): Promise<string> {
  const path = await getGlobalInstructionsPath()
  await ensureFile(path)
  return path
}

/** Checks if the workspace-level Copilot instructions file exists. */
export function workspaceInstructionsExist(
  repository: Repository
): Promise<boolean> {
  return pathExists(getWorkspaceInstructionsPath(repository))
}

/** Checks if the global Copilot instructions file exists. */
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

/**
 * Resolves the Copilot instructions for a given repository, checking workspace
 * instructions first, then global instructions.
 */
export async function resolveCopilotInstructions(
  repository: Repository | null
): Promise<CopilotCommitMessageInstructions> {
  const sources: ReadonlyArray<{
    source: 'workspace' | 'global'
    getPath: () => Promise<string | null> | string | null
  }> = [
    {
      source: 'workspace',
      getPath: () =>
        repository ? getWorkspaceInstructionsPath(repository) : null,
    },
    {
      source: 'global',
      getPath: () => getGlobalInstructionsPath(),
    },
  ]

  for (const { source, getPath } of sources) {
    const path = await getPath()
    if (path === null) {
      continue
    }

    const instructions = await readInstructionsFromFile(path)
    if (instructions !== null) {
      return { instructions, source, sourcePath: path }
    }
  }

  return { instructions: null, source: null }
}
