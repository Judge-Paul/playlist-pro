import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import JSZip from "jszip";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const videoURL =
      "https://rr1---sn-gjo-w43s.googlevideo.com/videoplayback?expire=1704753382&ei=hiScZejPIs2d_9EP3JuI-AU&ip=193.176.237.185&id=o-AAsnI04OGbueXSWGlsBtCVLU7q_OgE8IGd80hqkL9bKB&itag=22&source=youtube&requiressl=yes&xpc=EgVo2aDSNQ%3D%3D&mh=Vs&mm=31%2C29&mn=sn-gjo-w43s%2Csn-ab5sznld&ms=au%2Crdu&mv=m&mvi=1&pl=24&initcwndbps=1228750&spc=UWF9f_FczwfOqtqN_RZKytjflA8W2sI&vprv=1&svpuc=1&mime=video%2Fmp4&cnr=14&ratebypass=yes&dur=2158.085&lmt=1592822102893446&mt=1704731578&fvip=5&fexp=24007246&c=ANDROID&txp=5432432&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cxpc%2Cspc%2Cvprv%2Csvpuc%2Cmime%2Ccnr%2Cratebypass%2Cdur%2Clmt&sig=AJfQdSswRgIhAKn-imeWKl61mEFLKqDpV0jae9q0Bc6F1iknVgkSdVhSAiEAgjuNqwtzH9dp29KvDKQ_GXS3YmPevhGrYV9x1Y1Wmuk%3D&lsparams=mh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl%2Cinitcwndbps&lsig=AAO5W4owRgIhAPYMETNmFsKSsuMoSGX9HMs6YVQ1SneeHTRX-dE0sd6PAiEApbvMx1SwpWdJ-uWSIQdoMVJnV3Su_XEGm0Z1_BXZF6o%3D&title=Node.js+Crash+Course+Tutorial+#7+-+View+Engines";

    const response = await axios.get(videoURL, { responseType: "stream" });

    const zip = new JSZip();
    zip.file("Video.mp4", response.data, { binary: true });

    res.setHeader("Content-Type", "application/zip");
    res.setHeader("Content-Disposition", "attachment; filename=Videos.zip");

    zip.generateNodeStream({ streamFiles: true }).pipe(res);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
}
