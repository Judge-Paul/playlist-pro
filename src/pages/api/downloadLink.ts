import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import * as cheerio from "cheerio";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    // Make an HTTP GET request to the target URL using Axios
    const response = await axios.get(
      "https://dwntube.com/download?v=https://www.youtube.com/watch?v=zBPeGR48_vE",
    ); // Replace with your target URL

    if (response.status === 200) {
      const $ = cheerio.load(response.data);
      const downloadLinks: object[] = [];

      // Select the table with class "downloadsTable" and iterate through its rows
      const firstTable = $(".downloadsTable").first();
      const rows = firstTable.find("tr:gt(0)"); // Skip the header row
      rows.each((i, row) => {
        const quality = $(row).find("td:nth-child(1)").text();
        const format = $(row).find("td:nth-child(2)").text();
        const link = $(row).find("a.downloadBtn").attr("href");

        if (quality && format && link) {
          downloadLinks.push({ quality, format, link });
        }
      });

      if (downloadLinks.length > 0) {
        res.status(200).json(downloadLinks);
      } else {
        res.status(response.status).json({ error: "Failed to retrieve data" });
      }
    } else {
      // Handle the case when the HTTP request fails
      res.status(response.status).json({ error: "Failed to retrieve data" });
    }
  } catch (error) {
    // Handle any errors that may occur during the process
    res.status(500).json({ error: "Internal server error" });
  }
}
