import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { data } from "@/lib/data";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const totalData = await performExpensiveCalculation();

  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "s-maxage=1, stale-while-revalidate");

  res.write(JSON.stringify({ status: "processing", progress: 0 }));

  const chunkSize = 5; // Adjust the chunk size based on your needs
  for (let i = 0; i < totalData.length; i += chunkSize) {
    const chunk = totalData.slice(i, i + chunkSize);

    // Simulate asynchronous processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    res.write(
      JSON.stringify({
        status: "processing",
        progress: i / totalData.length,
        data: chunk,
      }),
    );
  }

  res.end(JSON.stringify({ status: "complete", progress: 1, data: totalData }));
}

async function performExpensiveCalculation() {
  // Simulate an expensive calculation with dummy data
  // Simulate some delay for demonstration purposes
  await new Promise((resolve) => setTimeout(resolve, 3000));

  return Array.from({ length: 20 }, (_, index) => ({
    id: index,
    value: Math.random(),
  }));
}
