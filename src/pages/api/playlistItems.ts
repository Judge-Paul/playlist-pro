// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

type Data = {
  message?: any;
  error?: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const apiKey = process.env.API_KEY;
  // const playlistId = "PLqkLaKB2GJhWXV9rcarwvn06ISlL_9mPQ&si=lvHKuJAnxBsIAlVp";

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: "Missing playlistId" });
  }

  try {
    // Make a request to the YouTube Data API
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${id}&key=${apiKey}`,
    );
    res.status(200).json(response.data);
    if (response.data.items.length === 0) {
      return res.status(400).json({ error: "Playlist Not Found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data" });
  }
}
