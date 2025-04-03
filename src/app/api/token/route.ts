import {NextResponse} from 'next/server';

export async function GET() {


    try {
      
        const clientId = process.env.CLIENT_ID!;
        const clientSecret = process.env.CLIENT_SECRET!;
        const refreshToken = process.env.REFRESH_TOKEN!;

        const params = new URLSearchParams();
        params.append("grant_type", "refresh_token");
        params.append("refresh_token", refreshToken);
   
        const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

        const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": `Basic ${basicAuth}`,
        },
        body: params.toString(),
        });

        const data = await response.json();

        return NextResponse.json(data, {status: 200});
    }
    catch (error) {
        return NextResponse.json({error: error}, {status: 500});
    }
}