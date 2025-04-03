import { NextRequest, NextResponse } from "next/server";


export async function GET( req: NextRequest) {

    try {

        const token = req.nextUrl.searchParams.get("token");;
      
       const data = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
        headers: {
            Authorization: `Bearer ` + token,
        },
        });
        const response = await data.json();
        return NextResponse.json(response, {status: 200});
    }
    catch (error) {
        return NextResponse.json({error: error}, {status: 500});
    }
}