import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import * as cheerio from "cheerio";

interface DownloadLinks {
  [quality: string]: {
    resolution: string;
    format: string;
    link: string;
    size: number;
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const videoIds = JSON.parse(req.query.videoIds as string);

  if (!videoIds) {
    return res.status(400).json({ error: "Missing videoIds" });
  }

  try {
    const responses = await Promise.all(
      videoIds.map(async (videoId: string) => {
        try {
          const response = await axios.get(
            `https://ytsnag.com/download?v=https://www.youtube.com/watch?v=${videoId}`,
          );

          if (response.status === 200) {
            const $ = cheerio.load(response.data);

            const qualityMap = ["high", "medium", "low"];
            const firstTable = $(".downloadsTable").first();
            const rows = firstTable.find("tr:gt(0)");

            const promises = rows
              .map(async (i, row) => {
                const quality = qualityMap[i];
                const resolution = $(row).find("td:nth-child(1)").text();
                const format = $(row).find("td:nth-child(2)").text();
                const link = $(row).find("a.downloadBtn").attr("href");

                const headResponse = await axios.head(link ?? "");
                const size =
                  parseInt(headResponse.headers["content-length"]) ?? 0;

                return {
                  [quality]: {
                    resolution,
                    format,
                    link,
                    size,
                  },
                };
              })
              .get();

            const results = await Promise.all(promises);
            let downloadLinks: DownloadLinks = {};

            results.forEach(async (result) => {
              Object.assign(downloadLinks, result);
            });

            return downloadLinks;
          } else {
            throw new Error("Failed getting download links");
          }
        } catch (error) {
          throw new Error("Internal server error");
        }
      }),
    );

    res.status(200).json(responses);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}
