import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import * as cheerio from "cheerio";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { videoId } = req.query;

  if (!videoId) {
    return res.status(400).json({ error: "Missing videoId" });
  }

  try {
    const qualityMap = ["high", "medium", "low"];

    // Make an HTTP GET request to the target URL using Axios
    const response = await axios.get(
      `https://dwntube.com/download?v=https://www.youtube.com/watch?v=${videoId}}`,
    ); // Replace with your target URL

    if (response.status === 200) {
      const $ = cheerio.load(response.data);
      let downloadLinks = {};

      // Select the table with class "downloadsTable" and iterate through its rows
      const firstTable = $(".downloadsTable").first();
      const rows = firstTable.find("tr:gt(0)"); // Skip the header row
      rows.each((i, row) => {
        const quality = $(row).find("td:nth-child(1)").text();
        const format = $(row).find("td:nth-child(2)").text();
        const link = $(row).find("a.downloadBtn").attr("href");

        if (quality && format && link) {
          downloadLinks = {
            ...downloadLinks,
            [qualityMap[i]]: { quality, format, link },
          };
        }
      });

      if (JSON.stringify(downloadLinks) !== "{}") {
        res.status(200).json({ downloadLinks });
      } else {
        res.status(response.status).json({ error: "Links not Available." });
      }
    } else {
      res.status(response.status).json({ error: "Failed to retrieve data" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}
