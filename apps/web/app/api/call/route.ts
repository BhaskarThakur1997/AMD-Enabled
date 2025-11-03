import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { phone } = await req.json();

  const TWILIO_SID = process.env.TWILIO_ACCOUNT_SID!;
  const TWILIO_TOKEN = process.env.TWILIO_AUTH_TOKEN!;
  const FROM = process.env.TWILIO_CALLER_ID!;

  const callUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/amd-webhook`;

  const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${TWILIO_SID}/Calls.json`, {
    method: "POST",
    headers: {
      Authorization: "Basic " + Buffer.from(`${TWILIO_SID}:${TWILIO_TOKEN}`).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      To: phone,
      From: FROM,
      Url: callUrl,
    }),
  });

  const data = await response.json();
  return NextResponse.json({ success: !data.error, data });
}
