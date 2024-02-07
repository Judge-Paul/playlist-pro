import express, { Request, Response } from "express";
import axios from "axios";
import JSZip from "jszip";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import { getQualities } from "./utils";
import { Redis } from "@upstash/redis";
import { PlaylistItem } from "./@types";

dotenv.config();

const app = express();
const port = parseInt(process.env.PORT ?? "") || 8080;
const clientURL = process.env.CLIENT_URL;
const redisURL = process.env.REDIS_URL || "";
const redisToken = process.env.REDIS_TOKEN || "";

const redis = new Redis({
  url: redisURL,
  token: redisToken,
});

app.use(morgan("combined"));
app.use(express.json({ limit: "400kb" }));
app.use(cors({ origin: clientURL }));

app.get("/", (req: Request, res: Response) => {
  res.send(`Go to /createZip to get ZIP file`);
});

app.get("/createZip", async (req: Request, res: Response) => {
  const id = req.query.id as string;

  if (!id) return res.status(400).json({ error: "Playlist id not specified" });

  try {
    const playlist: any = await redis.get(id);

    const zip = new JSZip();

    await Promise.all(
      playlist.map(async (item: PlaylistItem) => {
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
      "attachment; filename=ytplaylistpro.vercel.app.zip",
    );
    zip.generateNodeStream({ streamFiles: true }).pipe(res);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
