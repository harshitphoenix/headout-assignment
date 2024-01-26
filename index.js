const express = require("express");
const fs = require("fs");
const path = require("path");
const { readSpecificLine, readEntireFile } = require("./utils/fileReader");

const app = express();
const PORT = 3000;

const dataFolderPath = path.join(__dirname, "tmp", "data");

if (!fs.existsSync(dataFolderPath)) {
  fs.mkdirSync(dataFolderPath, { recursive: true });
}

//route
app.get("/data", (req, res) => {
  const { n, m } = req.query;

  if (n) {
    const filePath = path.join(dataFolderPath, `${n}.txt`);

    if (m) {
      readSpecificLine(filePath, parseInt(m), res);
    } else {
      readEntireFile(filePath, res);
    }
  } else {
    res.status(400).send('Bad Request: Parameter "n" is required.');
  }
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
