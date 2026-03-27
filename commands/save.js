import { Command } from "commander";
import { readData, writeData } from "../utils/storage.js";

const saveCommand= new Command('save')
    .description("Save API request configuration for future use")
    .argument('<method>')
    .argument('<url>')
    .action((method, url)=>{
        const data= readData() //read existing data

        const newRequest= {
            id: data.length +1,
            method,
            url,
        }
        data.push(newRequest) //add new request to existing data
        writeData(data) //write updated data back to file
        console.log(`Saved request: ${method} ${url} with id ${newRequest.id}`)
    }
    )
export default saveCommand