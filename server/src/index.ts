import express, { Request, Response } from "express";
import axios, { AxiosError } from "axios";
import JSZip from "jszip";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import { PlaylistItem } from "./@types";
import NodeCache from "node-cache";
import { getQualities } from "./utils";

dotenv.config();

const app = express();
const port = parseInt(process.env.PORT ?? "") || 8080;
const clientURL = process.env.CLIENT_URL;
const serverURL = process.env.SERVER_URL;

app.use(morgan("dev"));
app.use(express.json({ limit: "250kb" }));
app.use(cors({ origin: "*" }));

app.get("/", (req: Request, res: Response) => {
  res.send(
    `Go to /createZip to get ZIP file\nGo to /playlistItems to get playlist items`,
  );
});

app.get("/createZip", async (req: Request, res: Response) => {
  const id = req.query.id as string;

  if (!id) return res.status(400).json({ error: "Playlist id not specified" });

  try {
    const playlistRes = await axios.get(`${serverURL}/playlistItems?id=${id}`);
    const playlist: PlaylistItem[] = playlistRes.data;

    const zip = new JSZip();

    await Promise.all(
      playlist.map(async (item) => {
        const qualities = getQualities(playlist);
        const quality = qualities[0];
        const downloadLink = item.downloadLinks[quality]?.link;
        const fileName = `${item.snippet.title} ytplaylistpro.vercel.app`;
        const response = await axios.get(downloadLink, {
          responseType: "stream",
        });
        zip.file(fileName, response.data, { binary: true });
      }),
    );
    res.setHeader("Content-Type", "application/zip");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=YTPlaylistPro.zip",
    );
    zip.generateNodeStream({ streamFiles: true }).pipe(res);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

const cacheDuration = 6 * 60 * 60;

const playlistCache = new NodeCache({
  stdTTL: cacheDuration,
  checkperiod: cacheDuration * 0.2,
});

app.get("/playlistItems", async (req: Request, res: Response) => {
  const apiKey = process.env.GOOGLE_API_KEY;
  const id = req.query.id as string;

  if (!id) {
    return res.status(400).json({ error: "Missing playlistId" });
  }

  // Check if the data is in the cache
  const cachedData = playlistCache.get<PlaylistItem[]>(id);

  if (cachedData) {
    console.log(`Sending cached data for playlistId: ${id}`);
    return res.status(200).json(cachedData);
  }

  try {
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${id}&key=${apiKey}`,
    );

    if (response.status === 200) {
      const items: PlaylistItem[] = response.data.items;

      if (!items || items.length === 0) {
        return res.status(404).json({ error: "Playlist Items Not Found" });
      }

      const videoIds = items.map((item) => item.snippet.resourceId.videoId);

      const linksRes = await axios.get(
        `${clientURL}/api/downloadLinks?videoIds=${encodeURIComponent(
          JSON.stringify(videoIds),
        )}`,
      );
      items.map((item: PlaylistItem, index: number) => {
        item.downloadLinks = linksRes.data[index];
        item.qualities = Object.getOwnPropertyNames(item.downloadLinks);
      });
      // Cache the data for the specified duration
      playlistCache.set(id, items);

      return res.status(200).json(items);
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
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
