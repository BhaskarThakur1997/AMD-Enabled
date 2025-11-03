import { detectAMD } from '@/lib/amdStrategies'


export async function POST(req: Request) {
const audio = Buffer.from(await req.arrayBuffer())
const res = await detectAMD(audio)
console.log('AMD:', res)
return Response.json({ ok: true })
} 
