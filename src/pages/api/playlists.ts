// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

type Data = {
  error: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const apiKey = "";
  const playlistId = "PLqkLaKB2GJhWXV9rcarwvn06ISlL_9mPQ&si=lvHKuJAnxBsIAlVp";

  // const { playlistId } = req.query;

  if (!playlistId) {
    return res.status(400).json({ error: "Missing playlistId" });
  }

  try {
    // Make a request to the YouTube Data API

    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&id=${playlistId}&key=${apiKey}`,
    );
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data" });
  }
}
