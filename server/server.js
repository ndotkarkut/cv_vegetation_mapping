const createSvg = require("./createSvg");
const { readFile, writeFile } = require("./util/fsPromises");

const axios = require("axios");
const path = require("path");
const spawn = require("child_process").spawn;

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

const PORT = process.env.PORT || 8888;

// The path to your python script
var myPythonScript = "py_server.py";
// Provide the path of the python executable, if python is available as environment variable then you can use only "python"
//var pythonExecutable = "python3.exe";
var pythonExecutable = "python";

async function base64_encode(file) {
  return "data:image/png;base64," + (await readFile(file, "base64"));
}

// Function to convert an Uint8Array to a string
var uint8arrayToString = function (data) {
  return String.fromCharCode.apply(null, data);
};

// app.use(express.static('public'));
app.use(cors("*"));
app.use(express.static("public"));
app.use(express.static("data"));

app.use(express.json());

app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`);
});

app.get("/:panoId", async (req, res, next) => {
  try {
    const panoId = req.params.panoId;
    const { lat, lng, heading, zoom } = req.query;
    console.log(lat, lng, heading, zoom);

    if (!lat || !lng || !heading) {
      return res.status(400).json({ message: "Invalid Request" });
    }

    const scriptExecution = spawn(pythonExecutable, [
      myPythonScript,
      lat,
      lng,
      heading,
      panoId,
      zoom,
    ]);

    // Handle normal output
    scriptExecution.stdout.on("data", (data) => {
      console.log(uint8arrayToString(data));
    });

    // Handle error output
    scriptExecution.stderr.on("data", (data) => {
      // As said before, convert the Uint8Array to a readable string.
      console.log(uint8arrayToString(data));
      return res.status(400).json({ message: "Invalid Request" });
    });

    scriptExecution.on("exit", async (code) => {
      console.log("Process quit with code : " + code);
      await createSvg(panoId, heading);
      console.log("SVG created. Thank you!");

      const svg = await readFile(`./data/${panoId}/pano_svg.svg`);
      const percentages = (await readFile("./data/img_percents.txt")).split(
        ","
      );
      const percent_obj = {
        sky: +percentages[0],
        green: +percentages[1],
        street: +percentages[2],
      };
      // const svg = await base64_encode("./data/pano.svg");
      // const figures = await readFile("./data/pano_figures.png");
      const figures_64 = await base64_encode(
        `./data/${panoId}/pano_figures.png`
      );
      const intensity = await base64_encode(
        `./data/${panoId}/pano_img_intensity.png`
      );
      // console.log(figures_64);

      return res.status(200).json({
        message: "completed",
        svg: svg,
        figures: figures_64,
        intensity: intensity,
        percents: percent_obj,
      });
    });
  } catch (err) {
    console.log(err);
    return res.status(200).json({
      message: "Error",
    });
  }
});
