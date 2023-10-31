import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const apiKey = process.env.API_KEY;
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: "Missing playlistId" });
  }

  try {
    // Function to make requests recursively and accumulate items
    const fetchItems = async (pageToken = "") => {
      const response = await axios.get(
        `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${id}&key=${apiKey}&pageToken=${pageToken}`,
      );

      const { items, nextPageToken } = response.data;

      if (!items || items.length === 0) {
        return [];
      }

      const itemsArray = items;

      if (nextPageToken) {
        const nextItems = await fetchItems(nextPageToken);
        itemsArray.push(...nextItems);
      }

      return itemsArray;
    };

    const allItems = await fetchItems();

    if (allItems.length === 0) {
      return res.status(400).json({ error: "Playlist Not Found" });
    }

    res.status(200).json(allItems);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data" });
  }
}
