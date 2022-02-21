const { readFile, writeFile } = require("./util/fsPromises");

const makeSvgLine = (theta, r, yMax) => {
  const norm_r = (+r / yMax) * 250;
  // const norm_r = +r;
  const x = +norm_r * Math.cos(-1 * +theta);
  const y = +norm_r * Math.sin(-1 * +theta);

  const xCoord = 250 + x;
  const yCoord = 250 + y;

  return `<line x1="250" y1="250" x2="${xCoord}" y2="${yCoord}" style="stroke: green; stroke-width:2" />\n`;
};

module.exports = async (panoId, heading) => {
  const xValues = await readFile(`./data/${panoId}/values_x.txt`);
  const yValues = await readFile(`./data/${panoId}/values_y.txt`);

  //   console.log(xValues);
  const xValArray = xValues.split("\r\n");
  const yValArray = yValues.split("\r\n");
  console.log(yValArray);
  const yValInts = yValArray.map((x) => parseInt(x));
  console.log(yValInts);

  let maxValue = yValInts[0];
  for (let i = 1; i < yValInts.length; ++i) {
    if (yValInts[i] > maxValue) {
      maxValue = yValInts[i];
    }
  }
  console.log(maxValue);

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
    svg += makeSvgLine(shiftedXValues[idx], yValArray[idx], maxValue);
    // svg += makeSvgLine(xValArray[idx], yValArray[idx]);
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

  await writeFile(`./data/${panoId}/pano_svg.svg`, entireSvg);
};
