import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const baseURL = process.env.BASE_URL;
  try {
    const response = await axios.get(
      `${baseURL}/api/downloadLinks?videoId=zBPeGR48_vE`,
    );
    const { data } = response;
    return res.status(200).json({ data });
  } catch (error) {
    // Handle any errors that may occur during the process
    res.status(500).json({ error: "Internal server error" });
  }
}
