import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60;

/**
 * POST /api/pinata
 * Accepts multipart/form-data with a `file` field and forwards it to Pinata.
 */
export async function POST(request: Request) {
  const apiKey = process.env.PINATA_API_KEY;
  const apiSecret = process.env.PINATA_SECRET_API_KEY;

  if (!apiKey || !apiSecret) {
    return NextResponse.json(
      { error: "Missing PINATA_API_KEY or PINATA_SECRET_API_KEY" },
      { status: 500 }
    );
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  try {
    const pinataForm = new FormData();
    pinataForm.append("file", file, file.name);

    const pinRes = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
      method: "POST",
      headers: {
        pinata_api_key: apiKey,
        pinata_secret_api_key: apiSecret,
      },
      body: pinataForm,
    });

    if (!pinRes.ok) {
      const text = await pinRes.text();
      return NextResponse.json(
        { error: "Pinata upload failed", details: text },
        { status: 502 }
      );
    }

    const json = (await pinRes.json()) as { IpfsHash: string; PinSize?: number; Timestamp?: string };
    return NextResponse.json({
      cid: json.IpfsHash,
      size: json.PinSize,
      timestamp: json.Timestamp,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Upload failed", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

