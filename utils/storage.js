import fs from 'fs';

const FILE = './data/requests.json';

export const readData = () => {
    const data = fs.readFileSync(FILE, 'utf-8'); //utf 8 is the encoding format to read the file
    return JSON.parse(data);
};

export const writeData = (data) => {
    fs.writeFileSync(FILE, JSON.stringify(data, null, 2)); //null and 2 are used to format the JSON with indentation for better readability
};