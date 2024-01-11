const express = require("express");
const axios = require("axios");
const JSZip = require("jszip");

const app = express();
const port = parseInt(process.env.PORT) || 8080;

app.get("/", (req, res) => {
  res.send(`Go to /createZip to get ZIP file`);
});

app.get("/createZip", async (req, res) => {
  try {
    // URLs of the two videos
    const videoURL1 =
      "https://rr1---sn-gjo-w43s.googlevideo.com/videoplayback?expire=1704961504&ei=gFGfZfn5Of21_9EP19Os-AI&ip=91.240.71.215&id=o-AHmp8vnNWEsd3aP4iKb9FF6xApu3VdUCeg-2WrU_dD1r&itag=18&source=youtube&requiressl=yes&xpc=EgVo2aDSNQ%3D%3D&mh=KK&mm=31%2C29&mn=sn-gjo-w43s%2Csn-ab5l6ndr&ms=au%2Crdu&mv=m&mvi=1&pl=24&initcwndbps=1115000&spc=UWF9f6dRmBB4buxoFN3jCUPgqt03GsKS3JQW&vprv=1&svpuc=1&mime=video%2Fmp4&cnr=14&ratebypass=yes&dur=99.149&lmt=1661552925533372&mt=1704939412&fvip=4&fexp=24007246&c=ANDROID&txp=5318224&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cxpc%2Cspc%2Cvprv%2Csvpuc%2Cmime%2Ccnr%2Cratebypass%2Cdur%2Clmt&sig=AJfQdSswRQIgaNBAEWCaNX8wB4pZPy8RuR_p2yyEYbz_bjvlhP1qE4sCIQCo_SV9oIhvzLECRt0fE5pKwJ0ipHkj5spUQdTnVNbmjA%3D%3D&lsparams=mh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl%2Cinitcwndbps&lsig=AAO5W4owRgIhAPqWwbV323dLD7YPuNueeV63ghffJUEZPD9tXCGTpHq-AiEA4DTeX0WgpBfk-1m7PTyaVFiTMxjkz1TtdjMbF4aZ66o%3D&title=The+Fastest+Arch+Install";
    const videoURL2 =
      "https://rr1---sn-gjo-w43s.googlevideo.com/videoplayback?expire=1704961504&ei=gFGfZfn5Of21_9EP19Os-AI&ip=91.240.71.215&id=o-AHmp8vnNWEsd3aP4iKb9FF6xApu3VdUCeg-2WrU_dD1r&itag=22&source=youtube&requiressl=yes&xpc=EgVo2aDSNQ%3D%3D&mh=KK&mm=31%2C29&mn=sn-gjo-w43s%2Csn-ab5l6ndr&ms=au%2Crdu&mv=m&mvi=1&pl=24&initcwndbps=1115000&spc=UWF9f6dRmBB4buxoFN3jCUPgqt03GsKS3JQW&vprv=1&svpuc=1&mime=video%2Fmp4&cnr=14&ratebypass=yes&dur=99.149&lmt=1630521212233313&mt=1704939412&fvip=4&fexp=24007246&c=ANDROID&txp=5311224&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cxpc%2Cspc%2Cvprv%2Csvpuc%2Cmime%2Ccnr%2Cratebypass%2Cdur%2Clmt&sig=AJfQdSswRgIhAJlnfj9Rk6bs29jaPjLGGURH-KxmHWF-aQlyvzsJIS_CAiEAq0a4j7WS8cbX02MTAWD7wZgEjHGs64ZsWEHQYVEy4kU%3D&lsparams=mh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl%2Cinitcwndbps&lsig=AAO5W4owRgIhAPqWwbV323dLD7YPuNueeV63ghffJUEZPD9tXCGTpHq-AiEA4DTeX0WgpBfk-1m7PTyaVFiTMxjkz1TtdjMbF4aZ66o%3D&title=The+Fastest+Arch+Install";

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
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
