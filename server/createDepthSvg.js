const regression = require("regression")
//import regression from "regression"
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
  // const adjustedDepth = depth >= maxDepth*0.75 ? depth - maxDepth*0.35  : depth - maxDepth*0.15
  // return adjustedDepth

  return depth
} 

// const makeSvgBench = (depth, heading, yMax, maxBenchDepth) => {
//   const adjustedHeading = +heading - 90;
//   const theta = (adjustedHeading * Math.PI) / 180;
//   const norm_depth = (fakeDepthScaling(depth, maxBenchDepth) / (yMax+2)) * 240;
//   // console.log("yMax", yMax)
//   // console.log("depth", depth, "norm_depth", norm_depth)
//   const x = norm_depth * Math.cos(theta);
//   const y = norm_depth * Math.sin(theta);

//   const xCoord = 250 + x;
//   const yCoord = 250 + y;

//   console.log(adjustedHeading, theta, norm_depth, x, y, xCoord, yCoord);

//   return `<image x="${xCoord}" y="${yCoord}" width="${20}" height="${20}" style="stroke: #87ceeb" href="${"https://cdn-icons-png.flaticon.com/512/1024/1024639.png"}" />`;
//   return `<circle r="${15}" cx="${xCoord}" cy="${yCoord}" fill="#87ceeb" style="stroke: #87ceeb; stroke-width:1" />\n`;
// };

const makeSvgBench = (bench, color) => {

  const xCoord = 250 + bench.x;
  const yCoord = 250 + bench.y;

  //console.log(color || "#FF0000")
  return `<image x="${xCoord}" y="${yCoord}" width="${20}" height="${20}" style="color:${color || "#FF0000"} fill:${color || "#FF0000"}"  href="${"https://cdn-icons-png.flaticon.com/512/1024/1024639.png"}" />`;
};
const getBenchPositions = (bench, yMax, maxBenchDepth) => 
{
  const adjustedHeading = +bench.heading - 90;
  const theta = (adjustedHeading * Math.PI) / 180;
  const norm_depth = (fakeDepthScaling(bench.depth, maxBenchDepth) / (yMax+2)) * 240;

  const x = norm_depth * Math.cos(theta);
  const y = norm_depth * Math.sin(theta);

  return {...bench, x, y}
};

const bestLineFit = (benchArray) =>
{
  const pointsArray = [];

  for (let bench of benchArray) 
  {
    pointsArray.push([bench.x, bench.y])
  }

  const result = regression.linear(pointsArray);

  // console.log("gradient", result.equation[0])
  // console.log("yIntercept", result.equation[1])
  
  let temp

  benchArray.forEach((bench, index, benchArray) => {
    temp = result.predict(bench.x)
    console.log("previous x:", bench.x, "previous y:", bench.y, " new x,y:", temp)
    benchArray[index] = {...bench, x:temp[0], y:temp[1]}
  })

  return benchArray
}

const drawRoadLine = (heading) =>
{
  const length = 200

  const adjustedHeading = +heading - 90;
  const theta = (adjustedHeading * Math.PI) / 180;

  const x = length * Math.cos(theta);
  const y = length * Math.sin(theta);

  return `<line x1="${250+x}" y1="${250+y}" x2="${250-x}" y2="${250-y}" style="stroke: #FF0000 "></line>`
}

module.exports = async (panoId, heading) => {
  heading = +heading
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
  //console.log(yValArray);
  const yValInts = yValArray.map((x) => parseFloat(x));
  const greenValInts = greenValArray.map((x) => parseInt(x));
  //console.log(yValInts);

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

  let leftBenches = []
  let rightBenches = []

  const reverseHeading = (180 + +heading) > 360 ? (180 + heading)%360 : 180 + heading
  
  console.log("heading", heading)
  console.log("reverseHeading", reverseHeading)

  for (let bench of coordinates) 
  {
    bench = getBenchPositions(bench, maxValue, maxBenchDepth)

    if ( reverseHeading > heading)
    {    
      if ( bench.heading >= heading && bench.heading <= reverseHeading)
        leftBenches.push(bench)
      
      else
        rightBenches.push(bench)
    }
    else 
    {
      if ( bench.heading >= heading || bench.heading <= reverseHeading)
        leftBenches.push(bench)
      
      else
        rightBenches.push(bench)
    }
  }

  console.log("leftBenches.length: ", leftBenches.length)
  console.log("rightBenches.length: ", rightBenches.length)
  // const getAverage = (array) => array.reduce((a, b) => a.depth + b.depth) / array.length;
  // const leftBenchesAverageDepth = getAverage(leftBenches)
  // const rightBenchesAverageDepth = getAverage(rightBenches)

  leftBenches = bestLineFit(leftBenches)
  rightBenches = bestLineFit(rightBenches)
  //console.log(rightBenches)


  for (let bench of leftBenches) {
    //console.log("adding bench to svg", depth, heading, maxValue);
    //svg += makeSvgBench(depth, heading, maxValue, maxBenchDepth);
    svg += makeSvgBench(bench);
  }
  for (let bench of rightBenches) {
    svg += makeSvgBench(bench,"#0000FF");
  }

  svg += drawRoadLine(heading)

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
