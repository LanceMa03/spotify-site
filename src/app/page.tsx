"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";


export default function Home() {
  const [currentTrack, setCurrentTrack] = useState("");
  const [currentArtist, setCurrentArtist] = useState("");
  const [albumArt, setAlbumArt] = useState("");
  const [lastUpdated, setLastUpdated] = useState(0);

  // gets the access token using the refresh token
  // allows it to make API calls to SpotifyAPI
  const getAccessToken = async () => {

    try {
      const response = await axios.get("/api/token")
      return response.data.access_token;

    } catch (error) {
      console.error("Error fetching access token:", error);
    }
  };


  const fetchSpotifyData = async () => {
    const token = await getAccessToken();

    if (token) {
      
      try {
        
        const response = await axios.get(`/api/spotifyData?token=${token}`)
        setCurrentTrack(response.data.item.name);

        const artistString = response.data.item.artists;
        const finalArtistStr = artistString.map((artist: { name: string }) => artist.name).join(", ");
        setCurrentArtist(finalArtistStr);

        setAlbumArt(response.data.item.album.images[0].url);
        return "good";
        
      } catch (error) {
        console.error("Error fetching data:", error);
      }

      
    }
  };



  /* tries to get the current track every 10 seconds */
  useEffect(() => {

    const intervalId = setInterval(() => {
      if (lastUpdated === 5) {

        fetchSpotifyData().then((returnVal) => {
          if (returnVal === "good") {
            setLastUpdated(0);
          }
        });

      } else {
        setLastUpdated(lastUpdated + 1);
      }

      return clearInterval(intervalId);
    }, 1000);

  });


  return (
    <div className="grid min-h-screen justify-center place-items-center bg-grey-900 relative px-4 py-7">

      <a className="absolute top-2 left-2 w-fit bg-zinc-800 text-sm text-gray-50 px-3 py-1 rounded-lg shadow-md hover:bg-zinc-700 transition " href="https://website-next-seven-theta.vercel.app/#aboutme">
        ← Back
      </a>

      <div className="flex flex-col items-center gap-2 -mt-15">
        <div className="w-[250px] h-[250px] mb-10">
          <a href="https://open.spotify.com/user/konsama17" target="_blank">
            <Image src="/pfp.jpg" alt="spotify pfp" width={250} height={250} className="rounded-full object-cover w-full h-full shadow-lg"/>
          </a>
           
        </div>


        {currentTrack && (
          <div className="w-full flex text-sm justify-left text-left font-bold text-zinc-100">
          Currently Playing:
          </div>
        )}
        
        <div className="flex items-center gap-4 w-full max-w-xl bg-neutral-700 text-white p-4 rounded-xl shadow-md">
          {currentTrack && <Image src={albumArt} width={64} height={64} alt="album art" className="rounded-lg"></Image>}
        
          <div className="flex flex-col">
            <span className="text-base font-semibold">
              {currentTrack || "Not currently playing anything"}
            </span>
            <span className="text-sm mt-0.5 text-zinc-400">{currentArtist} </span>
          </div>
          
        </div>
      </div>
      
      <div className="absolute bottom-1 text-sm text-zinc-500 ">Last Updated: {lastUpdated} seconds ago</div>


    </div>

    
  );
}
