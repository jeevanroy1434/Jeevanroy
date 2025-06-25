import { createHash } from 'crypto'
import { TokenStore } from '../stores'
import {
  getSSHCredentialStoreKey,
  setMostRecentSSHCredential,
  setSSHCredential,
} from '../ssh/ssh-credential-storage'

const GPGPassphraseTokenStoreKey = getSSHCredentialStoreKey('GPG passphrases')

async function getHashForGPGKey(keyId: string) {
  // Hash the GPG key ID to use as a storage key
  return createHash('sha256').update(keyId).digest('hex')
}

/** Retrieves the passphrase for the GPG key with the given ID. */
export async function getGPGPassphrase(keyId: string) {
  try {
    const keyHash = await getHashForGPGKey(keyId)
    return TokenStore.getItem(GPGPassphraseTokenStoreKey, keyHash)
  } catch (e) {
    log.error('Could not retrieve passphrase for GPG key:', e)
    return null
  }
}

/**
 * Stores the GPG key passphrase.
 *
 * @param operationGUID A unique identifier for the ongoing git operation. In
 *                      practice, it will always be the trampoline token for the
 *                      ongoing git operation.
 * @param keyId         ID of the GPG key.
 * @param passphrase    Passphrase for the GPG key.
 */
export async function setGPGPassphrase(
  operationGUID: string,
  keyId: string,
  passphrase: string
) {
  try {
    const keyHash = await getHashForGPGKey(keyId)

    await setSSHCredential(
      operationGUID,
      GPGPassphraseTokenStoreKey,
      keyHash,
      passphrase
    )
  } catch (e) {
    log.error('Could not store passphrase for GPG key:', e)
  }
}

/**
 * Keeps the GPG credential details in memory to be deleted later if the ongoing
 * git operation fails to authenticate.
 *
 * @param operationGUID A unique identifier for the ongoing git operation. In
 *                      practice, it will always be the trampoline secret for the
 *                      ongoing git operation.
 * @param keyId         ID of the GPG key.
 */
export async function setMostRecentGPGPassphrase(
  operationGUID: string,
  keyId: string
) {
  try {
    const keyHash = await getHashForGPGKey(keyId)

    setMostRecentSSHCredential(
      operationGUID,
      GPGPassphraseTokenStoreKey,
      keyHash
    )
  } catch (e) {
    log.error('Could not store passphrase for GPG key:', e)
  }
}
