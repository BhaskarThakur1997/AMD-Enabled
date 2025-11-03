export async function detectAMD(audio: Buffer) {
const res = await fetch(process.env.AMD_SERVICE_URL!, { method: 'POST', body: audio })
return await res.json()
} 
