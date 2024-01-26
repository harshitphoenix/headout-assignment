const fs = require("fs");
const path = require("path");
const stream = require("stream");

const totalFiles = 50;
const maxFileSize = 100;
const charactersPerLine = 50;

const dataFolderPath = path.join(__dirname, "tmp", "data");


if (!fs.existsSync(dataFolderPath)) {
  fs.mkdirSync(dataFolderPath, { recursive: true });
}

for (let i = 1; i <= totalFiles; i++) {
  const filePath = path.join(dataFolderPath, `${i}.txt`);

  const writableStream = fs.createWriteStream(filePath);

  const fileContentStream = generateRandomContentStream(
    maxFileSize,
    charactersPerLine
  );

  fileContentStream.pipe(writableStream);

  writableStream.on("finish", () => {
    console.log(`File ${i}.txt created at ${filePath}`);
  });
}

const generateRandomContentStream=(sizeInMB, charactersPerLine) =>{
  const fileSizeInBytes = sizeInMB * 1024 * 1024;

  
  const randomStream = new stream.Readable({
    read(size) {
      const chunkSize = Math.min(size, fileSizeInBytes);
      const randomBuffer = Buffer.alloc(chunkSize);
      for (let i = 0; i < chunkSize; i++) {
        randomBuffer.writeUInt8(Math.floor(Math.random() * 256), i);
      }
      const contentWithNewLines = randomBuffer
        .toString("base64")
        .match(new RegExp(`.{1,${charactersPerLine}}`, "g"))
        .join("\n");
      this.push(contentWithNewLines);


      if (chunkSize === 0) {
        this.push(null);
      }
    },
  });
  return randomStream;
}
