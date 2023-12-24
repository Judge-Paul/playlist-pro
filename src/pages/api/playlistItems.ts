import type { NextApiRequest, NextApiResponse } from "next";
import axios, { AxiosError } from "axios";
import type { PlaylistItem } from "@/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const apiKey = process.env.API_KEY;
  const baseURL = process.env.BASE_URL;
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: "Missing playlistId" });
  }

  try {
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${id}&key=${apiKey}`,
    );

    if (response.status === 200) {
      const { items } = response.data;

      if (!items || items.length === 0) {
        return res.status(200).json([]);
      }

      const filteredItems: PlaylistItem[] = items.filter(
        (item: PlaylistItem) =>
          item.snippet.title !== "Private video" &&
          item.snippet.description !== "This video is private.",
      );

      if (filteredItems.length === 0) {
        return res.status(404).json({ error: "Playlist Not Found" });
      }

      await Promise.all(
        filteredItems.map(async (item) => {
          const { videoId } = item.snippet.resourceId;
          const response = await axios.get(
            `${baseURL}/api/downloadLinks?videoId=${videoId}`,
          );
          // const { downloadLinks } = response.data;
          // return { ...item, downloadLinks };
          item.downloadLinks = response.data.downloadLinks;
        }),
      );
      res.status(200).json(filteredItems);
    } else {
      return res.status(500).json({ error: "Failed getting playlists data" });
    }
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const axiosError: AxiosError = error;

      if (axiosError.response?.status === 404) {
        return res.status(404).json({ error: "Playlist not found" });
      } else {
        return res.status(500).json({ error });
      }
    } else {
      return res.status(500).json({ error: "Unexpected error occurred" });
    }
  }
}
