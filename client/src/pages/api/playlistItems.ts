import type { NextApiRequest, NextApiResponse } from "next";
import { PlaylistItem } from "@/types";
import axios, { AxiosError } from "axios";
import { redis } from "@/lib/redis";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  res.setHeader("Vercel-CDN-Cache-Control", "max-age=21600");
  res.setHeader("CDN-Cache-Control", "max-age=21600");
  res.setHeader("Cache-Control", "public, must-revalidate, max-age=21600");

  const apiKey = process.env.GOOGLE_API_KEY;
  const clientURL = process.env.NEXT_PUBLIC_CLIENT_URL;
  const id = req.query.id as string;

  if (!id) {
    return res.status(400).json({ error: "Missing playlistId" });
  }

  const cachedData = await redis.get<PlaylistItem[]>(id);
  if (cachedData) {
    return res.status(200).json(cachedData);
  }

  try {
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${id}&key=${apiKey}`,
    );

    if (response.status === 200) {
      let items: PlaylistItem[] = response.data.items;

      if (!items || items.length === 0) {
        return res.status(404).json({ error: "Playlist Items Not Found" });
      }

      const videoIds = items.map((item) => item.snippet.resourceId.videoId);

      const [linksRes, playlistRes] = await Promise.all([
        axios.get(
          `${clientURL}/api/downloadLinks?videoIds=${encodeURIComponent(
            JSON.stringify(videoIds),
          )}`,
        ),
        axios.get(
          `https://youtube.googleapis.com/youtube/v3/playlists?part=snippet&id=${id}&key=${apiKey}`,
        ),
      ]);

      items = items.map((item: PlaylistItem, index: number) => {
        return {
          id: item.id,
          snippet: {
            title: item.snippet.title,
            description: item.snippet.description,
            thumbnails: item.snippet.thumbnails,
            resourceId: {
              videoId: item.snippet.resourceId.videoId,
            },
          },
          downloadLinks: linksRes.data[index],
          qualities: Object.getOwnPropertyNames(linksRes.data[index]),
        };
      });

      const playlist = {
        title: playlistRes.data.items[0].snippet.title,
        description: playlistRes.data.items[0].snippet.description,
        items,
      };

      await redis.set(id, playlist);
      await redis.expire(id, 21600);

      return res.status(200).json(playlist);
    } else {
      return res.status(500).json({ error: "Failed getting playlists data" });
    }
  } catch (error: any) {
    return res.status(500).json({ error: "Unexpected error occurred" });
  }
}
