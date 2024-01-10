import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import JSZip from "jszip";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    // URLs of the two videos
    const videoURL1 =
      "https://rr2---sn-gjo-w43s.googlevideo.com/videoplayback?expire=1704905309&ei=_XWeZaXAM5Wa_9EPkZKokA0&ip=193.135.13.161&id=o-ANCeGib1U8PaiduOLEF3vKRgCtUBAKcuCJZokxnz7fIX&itag=22&source=youtube&requiressl=yes&xpc=EgVo2aDSNQ%3D%3D&mh=XI&mm=31%2C29&mn=sn-gjo-w43s%2Csn-ab5l6nrk&ms=au%2Crdu&mv=m&mvi=2&pcm2cms=yes&pl=24&initcwndbps=3873750&spc=UWF9f1w2PFhGCNbXbrN2DZHOc6JinRQXpOPK&vprv=1&svpuc=1&mime=video%2Fmp4&cnr=14&ratebypass=yes&dur=626.869&lmt=1666062007562121&mt=1704883256&fvip=1&fexp=24007246&c=ANDROID&txp=5318224&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cxpc%2Cspc%2Cvprv%2Csvpuc%2Cmime%2Ccnr%2Cratebypass%2Cdur%2Clmt&sig=AJfQdSswRgIhAOn6j0CY82zLQ-jLdT-vBS3miB8KfqcPhJdlzQnWIFZVAiEArJ18NkVjzIoHHLF4etA1O1NWtHiCVp-gvZFtebtSq1o%3D&lsparams=mh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpcm2cms%2Cpl%2Cinitcwndbps&lsig=AAO5W4owRQIgEP_NCTl2jySAyze2B4qtQZg3ENijGObVvfW64GYi26wCIQDRZZrOPGWOmrN0SM1fLC9jeiFWAMqLThhCDshKw_u8ag%3D%3D&title=#10+How+Request+&+Response+works+|+Fundamentals+of+NODE+JS+|+A+Complete+NODE+JS+Course";
    const videoURL2 =
      "https://rr1---sn-gjo-w43s.googlevideo.com/videoplayback?expire=1704905310&ei=_nWeZea1C5bB_9EPuZGVyAE&ip=194.105.159.161&id=o-ANwHKF-FQ32cqdmfBHciEsLHFzZ8-8AE0Xs9-BXyQhe-&itag=22&source=youtube&requiressl=yes&xpc=EgVo2aDSNQ%3D%3D&mh=aX&mm=31%2C29&mn=sn-gjo-w43s%2Csn-ab5l6nrr&ms=au%2Crdu&mv=m&mvi=1&pl=23&initcwndbps=1243750&spc=UWF9f3qf9kmQ2IpvFUhB3q4yUMJ4hE-Go9ck&vprv=1&svpuc=1&mime=video%2Fmp4&cnr=14&ratebypass=yes&dur=571.791&lmt=1666214426546898&mt=1704883494&fvip=1&fexp=24007246&c=ANDROID&txp=5318224&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cxpc%2Cspc%2Cvprv%2Csvpuc%2Cmime%2Ccnr%2Cratebypass%2Cdur%2Clmt&sig=AJfQdSswRAIgKwRzDdow1UnVUeCTlHbIUDc3xukfSH9O9EQGeGNh_xMCIEE_J3X7uOIQ_c7kpLr4ds_Zno9_NJ-tGldi1Gc-9BFr&lsparams=mh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl%2Cinitcwndbps&lsig=AAO5W4owRgIhALrgZvjh2KTkYvMRY67Sy-drFpAdhXGSIsZ0xpxsB9HGAiEAvbEuUm25FBON61DVQCc2n7RVqdhTjnufaBCvK4sroh0%3D&title=#12+Creating+Routes+in+Node+JS+|+Fundamentals+of+NODE+JS+|+A+Complete+NODE+JS+Course";

    // Make requests to fetch the videos
    const response1 = await axios.get(videoURL1, { responseType: "stream" });
    const response2 = await axios.get(videoURL2, { responseType: "stream" });

    // Create a new JSZip instance
    const zip = new JSZip();

    // Add the first video to the zip file
    zip.file("Video1.mp4", response1.data, { binary: true });

    // Add the second video to the zip file
    zip.file("Video2.mp4", response2.data, { binary: true });

    // Set headers for the zip file
    res.setHeader("Content-Type", "application/zip");
    res.setHeader("Content-Disposition", "attachment; filename=Videos.zip");

    // Stream the zip file to the response
    zip.generateNodeStream({ streamFiles: true }).pipe(res);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
}
