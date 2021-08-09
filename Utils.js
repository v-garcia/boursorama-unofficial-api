import { fileURLToPath } from 'url';
import Papa from 'papaparse';
import path from 'path';
import fs from 'fs';

class Utils {
  static dirname() {
    const filename = fileURLToPath(import.meta.url);
    return path.dirname(filename);
  }

  static moneyStrToNumber(str) {
    return str && Number(str.replace(/\s|€/g, '').replace(',', '.'));
  }

  static waitForFile({ path, timeout = 240000, ...opts }, pred) {
    return new Promise((resolve, reject) => {
      const watcher = fs.watch(path, opts, (event, fileName) => {
        if (pred(event, fileName)) {
          watcher.close();
          resolve(fileName);
        }
      });
      setTimeout(() => {
        watcher.close();
        reject(new Error('Watcher timed out'));
      }, timeout);
    });
  }

  static readCsvFile = (filepath, options) => {
    return new Promise((resolve, reject) => {
      const file = fs.createReadStream(filepath);
      const csvData = [];
      Papa.parse(file, {
        ...options,
        step: function (result) {
          csvData.push(result.data);
        },
        complete: (results, file) => {
          resolve(csvData);
        },
        error: () => {
          reject(new Error(`Error reading file ${filepath}`));
        },
      });
    });
  };

  static unlink = (path) =>
    new Promise((resolve, reject) => {
      fs.unlink(path, (err) => {
        if (err) reject(err);
        resolve(path);
      });
    });
}

export default Utils;
