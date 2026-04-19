import fs from 'fs';
import os from 'os';
import path from 'path';

const dir = path.join(os.homedir(), '.apix');
const file = path.join(dir, 'requests.json');

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

if (!fs.existsSync(file)) {
  fs.writeFileSync(file, '[]', 'utf-8');
}

export const readData = () => {
  const data = fs.readFileSync(file, 'utf-8');
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
};

export const writeData = (data) => {
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf-8');
};