export const readSpecificLine = (filePath, lineNumber, res) => {
  const stream = fs.createReadStream(filePath);

  let currentLineNumber = 1;
  let content = "";

  stream.on("data", (chunk) => {
    content += chunk.toString();

    const lines = content.split("\n");

    while (lines.length > 1) {
      if (currentLineNumber === lineNumber) {
        res.status(200).send(lines[0]);
        stream.destroy();
        return;
      }

      lines.shift();
      currentLineNumber++;
    }

    content = lines[0];
  });

  stream.on("end", () => {
    res.status(404).send("Line not found");
  });

  stream.on("error", (err) => {
    res.status(500).send(`Internal Server Error: ${err.message}`);
  });
}

export const readEntireFile = (filePath, res) => {
  const stream = fs.createReadStream(filePath);

  stream.on("open", () => {
    res.status(200);
    stream.pipe(res);
  });

  stream.on("error", (err) => {
    res.status(500).send(`Internal Server Error: ${err.message}`);
  });
}
