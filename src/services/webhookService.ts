import { parseWebhookResponse } from '../utils/responseParser'

const WEBHOOK_URL = import.meta.env.VITE_WEBHOOK_URL

/**
 * Sends two images to the webhook and returns a URL for the result image.
 * Uses multipart/form-data — do NOT set Content-Type manually,
 * the browser must set it with the correct multipart boundary.
 */
export async function submitTryOn(
  image1: File,
  image2: File,
  signal: AbortSignal,
): Promise<string> {
  if (!WEBHOOK_URL) throw new Error('VITE_WEBHOOK_URL is not configured.')

  const form = new FormData()
  form.append('image1', image1, image1.name)
  form.append('image2', image2, image2.name)

  const response = await fetch(WEBHOOK_URL, {
    method: 'POST',
    body: form,
    signal,
  })

  if (!response.ok) {
    throw new Error(`Server error: ${response.status} ${response.statusText}`)
  }

  return parseWebhookResponse(response)
}
