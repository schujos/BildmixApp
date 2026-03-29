/**
 * Parses the webhook response into a usable image URL.
 * Handles three possible response shapes:
 *   1. Binary image  → blob URL via URL.createObjectURL
 *   2. JSON with URL → returns the URL string directly
 *   3. JSON with base64 → returns a data URI
 */
export async function parseWebhookResponse(response: Response): Promise<string> {
  const contentType = response.headers.get('content-type') ?? ''

  // Log headers for debugging — visible in browser DevTools console
  console.debug('[Webhook] Status:', response.status)
  console.debug('[Webhook] Content-Type:', contentType)

  if (contentType.startsWith('image/')) {
    const blob = await response.blob()
    return URL.createObjectURL(blob)
  }

  if (contentType.includes('application/json')) {
    const json: unknown = await response.json()
    console.debug('[Webhook] JSON body:', json)

    if (isObject(json)) {
      // Common URL field names
      const urlValue = json['url'] ?? json['imageUrl'] ?? json['image_url']
      if (typeof urlValue === 'string' && urlValue.length > 0) return urlValue

      // Common base64 / data URI field names
      const b64Value = json['image'] ?? json['data'] ?? json['base64'] ?? json['result']
      if (typeof b64Value === 'string' && b64Value.length > 0) {
        return b64Value.startsWith('data:') ? b64Value : `data:image/png;base64,${b64Value}`
      }
    }

    throw new Error('Unexpected JSON shape from webhook. See browser console for details.')
  }

  throw new Error(`Unexpected Content-Type: "${contentType}". See browser console for details.`)
}

function isObject(val: unknown): val is Record<string, unknown> {
  return typeof val === 'object' && val !== null && !Array.isArray(val)
}
