import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import * as cheerio from "cheerio";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  res.setHeader("CDN-Cache-Control", "max-age=2419200");
  // res.setHeader("Cache-Control", "max-age=3600");
  const { videoId } = req.query;

  if (!videoId) {
    return res.status(400).json({ error: "Missing videoId" });
  }

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
          const size = parseInt(headResponse.headers["content-length"]) ?? 0;

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
      let downloadLinks = {};

      results.forEach((result) => {
        Object.assign(downloadLinks, result);
      });

      if (JSON.stringify(downloadLinks) !== "{}") {
        res.status(200).json({ downloadLinks });
      } else {
        res.status(response.status).json({ error: "Links not available." });
      }
    } else {
      res.status(response.status).json({ error: "Unable to access URL" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}
