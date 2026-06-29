import { cookies } from 'next/headers'
import { verifyToken } from './auth'

export async function getServerUser() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value

    if (!token) {
      return null
    }

    const decoded = verifyToken(token) as any
    return decoded
  } catch (error) {
    console.error("Error reading server auth token:", error)
    return null
  }
}
