import { prisma } from '@/lib/prisma'
import { client } from '@/lib/twilio'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { twilioClient } from '@/lib/twilio'
import { prisma } from '@/lib/prisma'
import { randomUUID } from 'crypto'


export async function POST(req: Request) {
const { to } = await req.json()


await client.calls.create({
url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/twilio-webhook`,
to,
from: process.env.TWILIO_CALLER_ID!
})


await prisma.callLog.create({ data: { to, strategy: 'huggingface', status: 'dialing' }})
return Response.json({ ok: true })
} 

const BodySchema = z.object({
  to: z.string().min(4),
  strategy: z.enum(['twilio', 'twilio_media', 'jambonz', 'hf', 'gemini']).optional()
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = BodySchema.parse(body)
    const { to, strategy = 'twilio' } = parsed

    // create a DB row first to correlate callbacks (so we can update it later)
    const callId = randomUUID()
    const callLog = await prisma.callLog.create({
      data: {
        id: callId,
        to,
        strategy,
        status: 'queued'
      }
    })

    // Prepare TwiML URL and status callback. Include callLogId as query param so webhook can find DB row.
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? process.env.NGROK_URL
    if (!baseUrl) {
      return NextResponse.json({ error: 'NEXT_PUBLIC_BASE_URL or NGROK_URL must be set' }, { status: 500 })
    }

    const statusCallback = `${baseUrl.replace(/\/$/, '')}/api/twilio-webhook?callLogId=${callId}`

    // Prepare TwiML payload depending on strategy
    let twiml: string
    if (strategy === 'twilio_media') {
      // streams audio to /api/media (not implemented here; placeholder)
      twiml = `<?xml version="1.0" encoding="UTF-8"?><Response><Start><Stream url="${baseUrl}/api/media"/></Start><Say>Connecting you</Say></Response>`
    } else {
      twiml = `<?xml version="1.0" encoding="UTF-8"?><Response><Say>Connecting you</Say></Response>`
    }

    // Place Twilio call
    const fromNumber = process.env.TWILIO_CALLER_ID
    if (!fromNumber) {
      return NextResponse.json({ error: 'TWILIO_CALLER_ID must be set' }, { status: 500 })
    }

    const call = await twilioClient.calls.create({
      twiml,
      to,
      from: fromNumber,
      // request Twilio's answering-machine detection (optional)
      machineDetection: 'Enable',
      statusCallback,
      statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed']
    })

    // store twilio sid on DB record (update)
    await prisma.callLog.update({
      where: { id: callId },
      data: { status: 'initiated', /* optional: twilioSid: call.sid */ }
    })

    return NextResponse.json({ ok: true, callSid: call.sid, callId })
  } catch (err: any) {
    console.error('dial error', err)
    return NextResponse.json({ error: err?.message ?? String(err) }, { status: 500 })
  }
}