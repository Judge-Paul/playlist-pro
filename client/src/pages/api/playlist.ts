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

const cookies = [
  {
    domain: ".youtube.com",
    expirationDate: 1747014825.795909,
    hostOnly: false,
    httpOnly: true,
    name: "__Secure-1PSIDTS",
    path: "/",
    sameSite: "unspecified",
    secure: true,
    session: false,
    storeId: "0",
    value: process.env.COOKIE_1 || "",
    id: 1,
  },
  {
    domain: ".youtube.com",
    expirationDate: 1747014825.796242,
    hostOnly: false,
    httpOnly: false,
    name: "__Secure-3PAPISID",
    path: "/",
    sameSite: "no_restriction",
    secure: true,
    session: false,
    storeId: "0",
    value: process.env.COOKIE_2 || "",
    id: 2,
  },
  {
    domain: ".youtube.com",
    expirationDate: 1747014825.796347,
    hostOnly: false,
    httpOnly: true,
    name: "__Secure-3PSID",
    path: "/",
    sameSite: "no_restriction",
    secure: true,
    session: false,
    storeId: "0",
    value: process.env.COOKIE_3 || "",
    id: 3,
  },
  {
    domain: ".youtube.com",
    expirationDate: 1747014825.796001,
    hostOnly: false,
    httpOnly: true,
    name: "__Secure-3PSIDTS",
    path: "/",
    sameSite: "no_restriction",
    secure: true,
    session: false,
    storeId: "0",
    value: process.env.COOKIE_4 || "",
    id: 4,
  },
  {
    domain: ".youtube.com",
    expirationDate: 1738663032.382918,
    hostOnly: false,
    httpOnly: true,
    name: "GPS",
    path: "/",
    sameSite: "unspecified",
    secure: true,
    session: false,
    storeId: "0",
    value: process.env.COOKIE_5 || "",
    id: 5,
  },
  {
    domain: ".youtube.com",
    expirationDate: 1739266071.005893,
    hostOnly: false,
    httpOnly: false,
    name: "PREF",
    path: "/",
    sameSite: "unspecified",
    secure: true,
    session: false,
    storeId: "0",
    value: process.env.COOKIE_6 || "",
    id: 6,
  },
];

const agent = ytdl.createAgent(cookies);

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
          .getInfo(`https://www.youtube.com/watch?v=${videoId}`, { agent })
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
