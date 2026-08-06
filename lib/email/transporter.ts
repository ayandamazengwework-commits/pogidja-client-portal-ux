import nodemailer from 'nodemailer'

console.log('HOST:', process.env.SMTP_HOST)
console.log('PORT:', process.env.SMTP_PORT)
console.log('USER:', process.env.SMTP_USER)
console.log('PASS EXISTS:', !!process.env.SMTP_PASS)
console.log('FROM:', process.env.SMTP_FROM)

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})
