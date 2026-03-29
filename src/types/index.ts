export type UploadSlot = 'image1' | 'image2'

export type AppStatus = 'idle' | 'loading' | 'success' | 'error'

export interface UploadedImage {
  file: File
  previewUrl: string
}
