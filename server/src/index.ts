import express, { Request, Response } from "express";
import axios, { AxiosError } from "axios";
import JSZip from "jszip";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import { PlaylistItem } from "./@types";

dotenv.config();

const app = express();
const port = parseInt(process.env.PORT ?? "") || 8080;
const clientURL = process.env.CLIENT_URL;

app.use(morgan("dev"));
app.use(express.json({ limit: "250kb" }));
app.use(cors({ origin: "*" }));

app.get("/", (req: Request, res: Response) => {
  res.send(`Go to /createZip to get ZIP file`);
});

app.get("/createZip", async (req: Request, res: Response) => {
  const payload = req.body;
  const { quality } = req.query as { quality?: string };

  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  if (!req.body)
    return res.status(400).json({ error: "Payload not specified" });

  if (!Array.isArray(payload) || !payload[0].downloadLinks)
    return res.status(400).json({ error: "Payload is incorrect" });

  if (!quality) return res.status(400).json({ error: "Quality not specified" });

  try {
    const zip = new JSZip();

    for (let i = 0; i < payload.length; i++) {
      const response = await axios.get(payload[i].downloadLinks[quality].link, {
        responseType: "stream",
      });
      zip.file(`${payload[i].title} ytplaylistpro.vercel.app`, response.data, {
        binary: true,
      });
    }

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

app.get("/playlistItems", async (req: Request, res: Response) => {
  res.setHeader("CDN-Cache-Control", "max-age=21600");
  res.setHeader(
    "Cache-Control",
    "max-age=18000, must-revalidate, stale-while-revalidate=21600",
  );
  const apiKey = process.env.GOOGLE_API_KEY;
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: "Missing playlistId" });
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
      });
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
