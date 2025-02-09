interface ILintError {
  message: string
}

const CONVENTIONAL_TYPES = [
  'feat',
  'fix',
  'docs',
  'style',
  'refactor',
  'perf',
  'test',
  'build',
  'ci',
  'chore',
  'revert',
  'wip',
]

const MAX_SUBJECT_LENGTH = 100

export function lintCommitMessage(commitMessage: string): ILintError[] {
  const errors: ILintError[] = []
  const message = commitMessage.trim()

  // Check empty message
  if (message === '') {
    return [{ message: 'Commit message cannot be empty' }]
  }

  // Check for colon presence first
  if (!message.includes(':')) {
    return [
      { message: 'Missing colon separator between type/scope and message' },
    ]
  }

  // Split into header and subject
  const [header, ...subjectParts] = message.split(/:\s*/)
  const subject = subjectParts.join(': ').trim()

  // Validate header structure
  const headerPattern = /^(\w*)(?:\(([\w$@.\-*/ ]*)\))?(!)?$/
  const headerMatch = header.match(headerPattern)

  if (!headerMatch) {
    errors.push({
      message: 'Invalid format before colon. Expected: <type>(<scope>)?[!]',
    })
    return errors
  }

  const [_, type, scope, breaking] = headerMatch

  // Validate type
  if (!CONVENTIONAL_TYPES.includes(type.toLowerCase())) {
    errors.push({
      message: `Invalid type "${type}". Valid types: ${CONVENTIONAL_TYPES.join(
        ', '
      )}`,
    })
  }

  // Validate type casing
  if (type !== type.toLowerCase()) {
    errors.push({ message: `Type must be lowercase (found "${type}")` })
  }

  // Validate scope format
  if (scope && !/^[a-z0-9_.-]+$/.test(scope)) {
    errors.push({
      message: `Invalid scope format. Use lowercase letters, numbers, and: . _ -`,
    })
  }

  // Validate breaking change notation
  if (message.includes('!:') && !breaking) {
    errors.push({
      message:
        "Breaking changes should use '!' after scope: feat(scope)!: description",
    })
  }

  // Validate subject
  if (subject.length === 0) {
    errors.push({ message: 'Missing description after colon' })
  } else {
    if (subject.length > MAX_SUBJECT_LENGTH) {
      errors.push({
        message: `Subject too long (${subject.length}/${MAX_SUBJECT_LENGTH} chars)`,
      })
    }

    if (subject[0] !== subject[0].toLowerCase()) {
      errors.push({ message: 'Subject should start with a lowercase letter' })
    }

    if (/[.!?]$/.test(subject)) {
      errors.push({ message: 'Subject should not end with punctuation (.!?)' })
    }
  }

  return errors
}
