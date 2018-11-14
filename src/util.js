function base64ToArrayBuffer (base64) {
  const binary_string = window.atob(base64)
  const len = binary_string.length
  const bytes = new Uint8Array(len)
  for (let i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i)
  }
  return bytes.buffer
}

export function createAudioBlobUrl (base64Data) {
  const blob = new Blob([base64ToArrayBuffer(base64Data)], {type: 'audio/mp3'})
  return window.URL.createObjectURL(blob)
}
