const { readFile, writeFile } = require("./util/fsPromises");

const makeSvgPoint = (theta, r, yMax, greenVal, maxGreenVal) => {
  const norm_r = (+r / (yMax + 2)) * 240;
  const norm_green_r = (+greenVal / maxGreenVal) * 50;
  // const norm_r = +r;
  const x = +norm_r * Math.cos(-1 * +theta);
  const y = +norm_r * Math.sin(-1 * +theta);

  const xCoord = 250 + x;
  const yCoord = 250 + y;

  return `<circle r="${norm_green_r}" cx="${xCoord}" cy="${yCoord}" fill="green" style="stroke: green; stroke-width:1" />\n`;
};

const fakeDepthScaling = (depth, maxDepth) =>
{  
  const adjustedDepth = depth >= maxDepth*0.75 ? depth - maxDepth*0.35  : depth - maxDepth*0.15
  console.log("depth",depth,"maxDepth", maxDepth,"adjustedDepth", adjustedDepth)
  return adjustedDepth / 1.3
} 

const makeSvgBench = (depth, heading, yMax, maxBenchDepth) => {
  const adjustedHeading = +heading - 90;
  const theta = (adjustedHeading * Math.PI) / 180;
  const norm_depth = (fakeDepthScaling(depth, maxBenchDepth) / (yMax+2)) * 240;
  console.log("yMax", yMax)
  console.log("depth", depth, "norm_depth", norm_depth)
  const x = norm_depth * Math.cos(theta);
  const y = norm_depth * Math.sin(theta);

  const xCoord = 250 + x;
  const yCoord = 250 + y;

  console.log(adjustedHeading, theta, norm_depth, x, y, xCoord, yCoord);

  return `<image x="${xCoord}" y="${yCoord}" width="${20}" height="${20}" href="${"https://cdn-icons-png.flaticon.com/512/1024/1024639.png"}" />`;
  return `<circle r="${15}" cx="${xCoord}" cy="${yCoord}" fill="#87ceeb" style="stroke: #87ceeb; stroke-width:1" />\n`;
};

module.exports = async (panoId, heading) => {
  const xValues = await readFile(`./data/${panoId}/values_x.txt`);
  const yValues = await readFile(`./data/${panoId}/depth_data.txt`);
  const greenValues = await readFile(`./data/${panoId}/values_y.txt`);
  const objectDetection = await readFile(
    `./data/${panoId}/processed/object_detection.json`
  );

  const {
    bench: { coordinates },
  } = JSON.parse(objectDetection);

  //   console.log(xValues);
  const xValArray = xValues.split("\r\n");
  const yValArray = yValues.split("\r\n");
  const greenValArray = greenValues.split("\r\n");
  console.log(yValArray);
  const yValInts = yValArray.map((x) => parseFloat(x));
  const greenValInts = greenValArray.map((x) => parseInt(x));
  console.log(yValInts);

  let maxValue = yValInts[0];
  for (let i = 1; i < yValInts.length; ++i) {
    if (yValInts[i] > maxValue) {
      maxValue = yValInts[i];
    }
  }
  console.log(maxValue);

  let maxGreenValue = greenValInts[0];
  for (let i = 1; i < greenValInts.length; ++i) {
    if (greenValInts[i] > maxGreenValue) {
      maxGreenValue = greenValInts[i];
    }
  }
  console.log(maxGreenValue);

  const numToShift = +(xValArray.length * ((+heading).toFixed(20) / 360));

  let numToSlice;
  if (+heading > 90) {
    numToSlice = xValArray.length - numToShift;
  } else {
    numToSlice = numToShift;
  }

  const newArrayBeginning = xValArray.slice(numToSlice);
  const slicedElsToBack = xValArray.slice(0, numToSlice);

  // console.log(slicedEls, newArrayBeginning, slicedEls + newArrayBeginning);

  const shiftedXValues = newArrayBeginning.concat(slicedElsToBack);

  console.log(shiftedXValues.length);

  let svg =
    '<svg height="500" width="500" xmlns="http://www.w3.org/2000/svg">\n';
  svg +=
    '<circle cx="250" cy="250" r="250" stroke="black" stroke-width="1" fill="none" />\n';

  for (let idx in shiftedXValues) {
    svg += makeSvgPoint(
      shiftedXValues[idx],
      yValArray[idx],
      maxValue,
      greenValArray[idx],
      maxGreenValue
    );
    // svg += makeSvgLine(xValArray[idx], yValArray[idx]);
  }

  const benchArrayDepth = []
  for (let { depth, heading } of coordinates) {
    benchArrayDepth.push(depth)
  }
  const maxBenchDepth = Math.max(...benchArrayDepth)
  console.log(maxBenchDepth)
  console.log(benchArrayDepth)
  for (let { depth, heading } of coordinates) {
    console.log("adding bench to svg", depth, heading, maxValue);
    svg += makeSvgBench(depth, heading, maxValue, maxBenchDepth);
  }

  let entireSvg = `
  ${svg}
    <line 
        x1="${250 + 250 * Math.cos((Math.PI / 180) * 0)}"
        y1="${250 + 250 * Math.sin((Math.PI / 180) * 0)}" 
        x2="${250 + 250 * Math.cos((Math.PI / 180) * 180)}"
        y2="${250 + 250 * Math.sin((Math.PI / 180) * 180)}"
        style="stroke: black; stroke-width:1"
    />
    <line 
        x1="${250 + 250 * Math.cos((Math.PI / 180) * 90)}"
        y1="${250 + 250 * Math.sin((Math.PI / 180) * 90)}" 
        x2="${250 + 250 * Math.cos((Math.PI / 180) * 270)}"
        y2="${250 + 250 * Math.sin((Math.PI / 180) * 270)}"
        style="stroke: black; stroke-width:1"
    />
    <line 
        x1="${250 + 250 * Math.cos((Math.PI / 180) * 45)}"
        y1="${250 + 250 * Math.sin((Math.PI / 180) * 45)}" 
        x2="${250 + 250 * Math.cos((Math.PI / 180) * 225)}"
        y2="${250 + 250 * Math.sin((Math.PI / 180) * 225)}"
        style="stroke: black; stroke-width:1"
    />
    <line 
        x1="${250 + 250 * Math.cos((Math.PI / 180) * 135)}"
        y1="${250 + 250 * Math.sin((Math.PI / 180) * 135)}" 
        x2="${250 + 250 * Math.cos((Math.PI / 180) * 315)}"
        y2="${250 + 250 * Math.sin((Math.PI / 180) * 315)}"
        style="stroke: black; stroke-width:1"
    />
    <circle cx="250" cy="250" r="62.5" stroke="black" stroke-width="1" fill="none" />
    <circle cx="250" cy="250" r="125" stroke="black" stroke-width="1" fill="none" />
    <circle cx="250" cy="250" r="187.5" stroke="black" stroke-width="1" fill="none" />
  </svg>
  `;

  await writeFile(`./data/${panoId}/depth_svg.svg`, entireSvg);
};
