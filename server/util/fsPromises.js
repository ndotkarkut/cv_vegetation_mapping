const fs = require("fs").promises;

const readFile = async (filePath, encoding = "utf-8") => {
  return await fs.readFile(filePath, encoding);
};

const writeFile = async (filePath, data) => {
  return await fs.writeFile(filePath, data, "utf-8");
};

module.exports = { readFile, writeFile };
