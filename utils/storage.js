import fs from 'fs';

const FILE = './data/requests.json';

export const readData = () => {
    const data = fs.readFileSync(FILE, 'utf-8');
    return JSON.parse(data);
};

export const writeData = (data) => {
    fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
};