/**
 * Compares two Uint8Array byte arrays to check if they are identical.
 * @param {Uint8Array} downloadedFileBytes - The byte array of the downloaded file.
 * @param {Uint8Array} apiBytes - The byte array received from the API response.
 * @returns {Promise<boolean>} Returns true if the byte arrays are identical, otherwise false.
 */
export async function compareByteArrays(downloadedFileBytes: Uint8Array, apiBytes: Uint8Array): Promise<boolean> {
    if (downloadedFileBytes.length !== apiBytes.length) {
        return false;
    }
    for (let i = 0; i < downloadedFileBytes.length; i++) {
        if (downloadedFileBytes[i] !== apiBytes[i]) {
            return false;
        }
    }
    return true;
}
