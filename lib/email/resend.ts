import { Resend } from 'resend'

let resend: Resend | null = null

export function getResend() {
  if (resend) return resend

  const apiKey = process.env.RESEND_API_KEY

  // Don't crash the build if the env variable doesn't exist yet.
  // Only throw when an email is actually being sent.
  if (!apiKey) {
    throw new Error('Missing RESEND_API_KEY')
  }

  resend = new Resend(apiKey)

  return resend
}
