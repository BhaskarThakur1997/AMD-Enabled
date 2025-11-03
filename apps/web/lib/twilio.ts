import twilio from 'twilio'
export const client = twilio(process.env.TWILIO_ACCOUNT_SID!, process.env.TWILIO_AUTH_TOKEN!) 

const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN

if (!accountSid || !authToken) {
  throw new Error('TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN must be set in env')
}

export const twilioClient = twilio(accountSid, authToken)
