import type { NextApiRequest, NextApiResponse } from "next";
import { PlaylistItem } from "@/types";
import axios from "axios";
import { redis } from "@/lib/redis";
import { getQualities } from "@/lib/utils";
import mixpanel from "@/lib/mixpanel";
import ytdl from "@distube/ytdl-core";

type Resolution = "144p" | "240p" | "360p" | "480p" | "720p" | "1080p";
type Quality =
  | "ultraHigh"
  | "high"
  | "medium"
  | "standard"
  | "low"
  | "ultraLow";

interface DownloadLinks {
  [quality: string]: {
    resolution: Resolution;
    format: string;
    link: string;
    size: number;
  };
}

const qualityMap: any = {
  "1080p": "ultraHigh",
  "720p": "high",
  "480p": "standard",
  "360p": "medium",
  "240p": "low",
  "144p": "ultraLow",
};

const cookies = JSON.parse(process.env.COOKIES || "");

const agentOptions = {
  maxSockets: 10, // Limit concurrent requests to avoid rate limits
  maxFreeSockets: 5, // Avoid holding too many idle sockets
  timeout: 30000, // Timeout in milliseconds (30s)
  maxRedirections: 5, // Follow up to 5 redirects
};

const agent = ytdl.createAgent(cookies, agentOptions);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // res.setHeader("Vercel-CDN-Cache-Control", "max-age=21600");
  // res.setHeader("CDN-Cache-Control", "max-age=21600");
  // res.setHeader("Cache-Control", "public, must-revalidate, max-age=21600");

  const apiKey = process.env.GOOGLE_API_KEY;
  const clientURL = process.env.NEXT_PUBLIC_CLIENT_URL;
  const id = req.query.id as string;

  if (!apiKey) {
    return res.status(401).json({ error: "API Key not found" });
  }

  if (!id) {
    return res.status(400).json({ error: "Missing playlistId" });
  }

  const cachedData = await redis.get<PlaylistItem[]>(id);
  if (cachedData) {
    mixpanel.track("Fetch Playlist", { fromCache: true });
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
        getDownloadLinks(videoIds),
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
          downloadLinks: linksRes[index],
          qualities: Object.getOwnPropertyNames(linksRes[index]),
        };
      });

      const qualities = getQualities(items) ?? [];
      const playlist = {
        title: playlistRes.data.items[0].snippet.title,
        description: playlistRes.data.items[0].snippet.description,
        items,
        qualities,
      };

      await redis.set(id, playlist);
      await redis.expire(id, 21600);

      mixpanel.track("Fetch Playlist", {
        id: id,
        fromCache: false,
        title: playlist?.title,
        quantity: playlist?.items.length,
      });
      return res.status(200).json(playlist);
    } else {
      return res.status(500).json({ error: "Failed getting playlists data" });
    }
  } catch (error: any) {
    // console.error(error);
    // if (axios.isAxiosError(error)) {
    //   return res.status(500).json({ error });
    // }
    // return res.status(500).json({ error });
    if (error?.response?.status === 404) {
      return res.status(404).json({ error: "Playlist not found" });
    }
    return res.status(500).json({ error: "Unexpected error occurred" });
  }
}

async function getDownloadLinks(videoIds: string[]) {
  if (!videoIds) {
    throw new Error("Missing videoIds");
  }

  try {
    const responses = await Promise.all(
      videoIds.map(async (videoId: string) => {
        return ytdl
          .getInfo(`https://www.youtube.com/watch?v=${videoId}`, {
            agent,
            requestOptions: {
              headers: {
                "User-Agent":
                  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36",
              },
            },
            playerClients: ["WEB"],
          })
          .then((info) => {
            const formats = ytdl.filterFormats(info.formats, "videoandaudio");

            const downloadLinks: any = {};
            formats.forEach((format) => {
              if (format.hasVideo && format.hasAudio && format.url) {
                downloadLinks[qualityMap[format.qualityLabel]] = {
                  resolution: format.qualityLabel,
                  format: format.container,
                  link: format.url,
                  size: format.contentLength,
                };
              }
            });
            return downloadLinks;
          })
          .catch((err) => {
            console.error(err);
            throw new Error(err);
          });
      }),
    );

    return responses;
  } catch (error) {
    console.error("Download links error:", error);
    throw new Error("Failed to generate download links");
  }
}
