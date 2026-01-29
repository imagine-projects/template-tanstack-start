import { getAppwriteSessionFn } from '../functions/auth'
import { createSessionClient } from './appwrite'

export async function getScreenshot(
  url: string,
  width?: number,
  height?: number,
  sleep?: number,
) {
  try {
    const session = await getAppwriteSessionFn()

    const { avatars } = await createSessionClient(session!)

    return await avatars.getScreenshot({
      url,
      width,
      height,
      sleep,
    })
  } catch (error) {
    console.error('Error getting screenshot:', error)
    throw error
  }
}
