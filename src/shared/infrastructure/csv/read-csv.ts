import csvParser from "csv-parser";
import { Readable } from "node:stream";

interface CSVRow {
  index: number;
  [key: string]: any;
}

export const readCSV = async (buffer: Buffer) => {
  return new Promise<CSVRow[]>((resolve, reject) => {
    const results: CSVRow[] = [];
    let index = 0;

    Readable.from(buffer)
      .pipe(csvParser())
      .on("data", (data) => {
        index += 1;
        results.push({ index, ...data });
      })
      .on("end", async () => {
        resolve(results);
      })
      .on("error", (error) => {
        reject(error);
      });
  });
};
