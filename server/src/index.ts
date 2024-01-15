import express, { Request, Response } from "express";
import axios from "axios";
import JSZip from "jszip";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";

dotenv.config();

const app = express();
const port = parseInt(process.env.PORT ?? "") || 8080;

app.use(morgan("dev"));
app.use(cors({ origin: "*" }));
app.use(express.json({ limit: "250kb" }));

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

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
