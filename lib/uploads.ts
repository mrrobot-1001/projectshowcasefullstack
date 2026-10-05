import { mkdir, writeFile } from 'fs/promises'
import { join } from 'path'
import { randomUUID } from 'crypto'

const MAX_BYTES = 5 * 1024 * 1024

// Format comes from the file's leading bytes, never from the browser-supplied
// name or MIME type, so nothing but an image can be stored and served.
function detectImageExtension(buf: Buffer): string | null {
  if (buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return 'jpg'
  if (buf.length >= 8 && buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return 'png'
  if (buf.length >= 6 && ['GIF87a', 'GIF89a'].includes(buf.subarray(0, 6).toString('ascii'))) return 'gif'
  if (buf.length >= 12 && buf.subarray(0, 4).toString('ascii') === 'RIFF' && buf.subarray(8, 12).toString('ascii') === 'WEBP') return 'webp'
  return null
}

export class UploadError extends Error {}

// Saves an uploaded image under public/uploads/<folder>/ and returns its URL path.
export async function saveImage(file: File, folder: string): Promise<string> {
  if (file.size > MAX_BYTES) throw new UploadError('Image is too large (max 5MB)')
  const buffer = Buffer.from(await file.arrayBuffer())
  const ext = detectImageExtension(buffer)
  if (!ext) throw new UploadError('Only JPEG, PNG, WebP or GIF images are allowed')

  const dir = join(process.cwd(), 'public', 'uploads', folder)
  await mkdir(dir, { recursive: true })
  const name = `${randomUUID()}.${ext}`
  await writeFile(join(dir, name), buffer)
  return `/uploads/${folder}/${name}`
}
