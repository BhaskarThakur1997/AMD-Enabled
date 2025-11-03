import { NextResponse } from 'next/server'
import VoiceResponse from 'twilio/lib/twiml/VoiceResponse'
import { prisma } from '@/lib/prisma'


export async function POST() {
const twiml = new VoiceResponse()
twiml.say('Connecting stream')
twiml.stream({ url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/events` })
return new NextResponse(twiml.toString(), { headers: { 'Content-Type': 'text/xml' }})
} 

export async function POST(req: Request) {
  try {
    // Twilio sends application/x-www-form-urlencoded
    const form = await req.formData()
    const callSid = form.get('CallSid')?.toString() ?? undefined
    const callStatus = form.get('CallStatus')?.toString() ?? undefined
    const amdStatus = form.get('AnsweringMachineDetectionStatus')?.toString() ?? undefined
    const callLogId = new URL(req.url).searchParams.get('callLogId') ?? undefined

    // Choose most meaningful status to persist
    let statusToStore = callStatus ?? 'unknown'
    if (amdStatus) {
      // Twilio may return human | machine_start | machine_end_beep etc.
      // normalize to 'human'|'machine'|'amd_unknown'
      if (amdStatus.toLowerCase().includes('human')) statusToStore = 'human_detected'
      else if (amdStatus.toLowerCase().includes('machine')) statusToStore = 'machine_detected'
      else statusToStore = `amd:${amdStatus}`
    }

    if (callLogId) {
      await prisma.callLog.update({
        where: { id: callLogId },
        data: {
          status: statusToStore
        }
      })
    } else if (callSid) {
      // best-effort: find the call by twilioSid if you store it (not implemented here)
      console.warn('twilio-webhook: callLogId missing; callSid', callSid)
    }

    // Important: return a 200 quickly to Twilio
    return NextResponse.json({ ok: true })
  } catch (err: any) {
    console.error('twilio-webhook error', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}