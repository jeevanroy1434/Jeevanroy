import { describe, it, beforeEach } from 'node:test'
import assert from 'node:assert'
import { Repository } from '../../../src/models/repository'
import {
  CopilotManager,
  type ICopilotDependencies,
} from '../../../src/lib/copilot'

describe('CopilotManager', () => {
  let repository: Repository
  let manager: CopilotManager
  let fs: Map<string, string>

  beforeEach(() => {
    fs = new Map<string, string>()
    repository = new Repository('/path/to/repo', 1, null, false)

    const dependencies: ICopilotDependencies = {
      pathExists: async (path: string) => fs.has(path),
      readFile: async (path: string) => fs.get(path) ?? '',
      writeFile: async (path: string, data: string) => {
        fs.set(path, data)
      },
      mkdir: async () => {},
      getPath: async () => '/user/data/path',
    }
    manager = new CopilotManager(dependencies)
  })

  describe('resolveCopilotInstructions', () => {
    it('returns null when no instructions file exists', async () => {
      const result = await manager.resolveCopilotInstructions(repository)
      assert.deepStrictEqual(result, { instructions: null, source: null })
    })

    it('returns global instructions when only global file exists', async () => {
      const globalPath = await manager.getGlobalInstructionsPath()
      fs.set(globalPath, 'Global instructions')

      const result = await manager.resolveCopilotInstructions(repository)
      assert.deepStrictEqual(result, {
        instructions: 'Global instructions',
        source: 'global',
        sourcePath: globalPath,
      })
    })

    it('returns workspace instructions when it exists', async () => {
      const workspacePath = manager.getWorkspaceInstructionsPath(repository)
      fs.set(workspacePath, 'Workspace instructions')

      const result = await manager.resolveCopilotInstructions(repository)
      assert.deepStrictEqual(result, {
        instructions: 'Workspace instructions',
        source: 'workspace',
        sourcePath: workspacePath,
      })
    })

    it('prefers workspace instructions when both files exist', async () => {
      const globalPath = await manager.getGlobalInstructionsPath()
      const workspacePath = manager.getWorkspaceInstructionsPath(repository)
      fs.set(globalPath, 'Global instructions')
      fs.set(workspacePath, 'Workspace instructions')

      const result = await manager.resolveCopilotInstructions(repository)
      assert.deepStrictEqual(result, {
        instructions: 'Workspace instructions',
        source: 'workspace',
        sourcePath: workspacePath,
      })
    })

    it('returns null if instructions file is empty', async () => {
      const globalPath = await manager.getGlobalInstructionsPath()
      fs.set(globalPath, '  ')
      const result = await manager.resolveCopilotInstructions(repository)
      assert.deepStrictEqual(result, { instructions: null, source: null })
    })
  })

  describe('instructionsExist', () => {
    it('returns false when no files exist', async () => {
      assert.strictEqual(await manager.globalInstructionsExist(), false)
      assert.strictEqual(
        await manager.workspaceInstructionsExist(repository),
        false
      )
    })

    it('returns true when files exist', async () => {
      const globalPath = await manager.getGlobalInstructionsPath()
      const workspacePath = manager.getWorkspaceInstructionsPath(repository)
      fs.set(globalPath, 'Global instructions')
      fs.set(workspacePath, 'Workspace instructions')

      assert.strictEqual(await manager.globalInstructionsExist(), true)
      assert.strictEqual(
        await manager.workspaceInstructionsExist(repository),
        true
      )
    })
  })

  describe('ensureInstructions', () => {
    it('creates global file if it does not exist', async () => {
      const globalPath = await manager.getGlobalInstructionsPath()
      assert.strictEqual(fs.has(globalPath), false)
      await manager.ensureGlobalInstructions()
      assert.strictEqual(fs.has(globalPath), true)
    })

    it('creates workspace file if it does not exist', async () => {
      const workspacePath = manager.getWorkspaceInstructionsPath(repository)
      assert.strictEqual(fs.has(workspacePath), false)
      await manager.ensureWorkspaceInstructions(repository)
      assert.strictEqual(fs.has(workspacePath), true)
    })
  })
})
