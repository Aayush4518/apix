//to delete from the list 
import { Command } from "commander";
import { readData, writeData } from "../utils/storage.js";

const deleteCommand = new Command('delete')
    .description('Delete a saved request')
    .argument('<id>', 'ID of the request to delete')
    .action((id) => {
        const storedData = readData();
        const updatedData = storedData.filter((r) => String(r.id) !== String(id));
        writeData(updatedData);
        console.log(`Request with ID ${id} deleted.`);
    });
export default deleteCommand;