import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const pixelId = "1523944362485658";
    const accessToken = "EAAPiJwUDYecBRJfmiFTRjm81OXDDyWEQHgi1a4RiYYKzD2kAV7LxyQFNJZBNW04DOI3vdvhYcJnTIW2l1X2kYiJRu5EPZC82Ofjb7fmgbKY0K0SVv6qr619h4zU0ZCaKnMlBYxRs9IPIuyzty6MdovWXLezxBLZBA9dxxZCEE4t1eEXuGHXKd2RiwY4DIi55TUgZDZD";
    
    // Facebook Conversion API URL
    const url = `https://graph.facebook.com/v19.0/${pixelId}/events?access_token=${accessToken}`;
    
    const body = {
      data: [
        {
          event_name: data.event_name,
          event_time: Math.floor(Date.now() / 1000),
          action_source: "website",
          event_source_url: data.url,
          user_data: {
            client_ip_address: req.headers.get("x-forwarded-for") || "127.0.0.1",
            client_user_agent: req.headers.get("user-agent") || "",
          },
          custom_data: data.custom_data || {},
        },
      ],
    };

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const result = await response.json();
    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
