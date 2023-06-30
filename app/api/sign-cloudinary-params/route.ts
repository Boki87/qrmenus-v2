import { v2 as cloudinary } from "cloudinary";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

cloudinary.config({
  cloud_name: "dgwhzqt43",
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function signUploadForm(params?: {
  public_id?: string;
  timestamp?: number | string;
  upload_preset?: string;
}) {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const signature = cloudinary.utils.api_sign_request(
    {
      timestamp,
      ...params,
    },
    cloudinary.config().api_secret || ""
  );

  return { timestamp, signature };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const sig = signUploadForm(body);

    return new Response(
      JSON.stringify({
        signature: sig.signature,
        timestamp: sig.timestamp,
        cloudname: cloudinary.config().cloud_name,
        apikey: cloudinary.config().api_key,
      }),
      { status: 200 }
    );
  } catch (e) {
    return new Response(null, { status: 500 });
  }
}
