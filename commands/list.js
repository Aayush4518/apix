import { Command } from "commander";
import { readData } from "../utils/storage.js";


const listCommand= new Command('list')
    .description("List all saved API request configurations")
    .action(()=>{

        const data= readData()

        if(data.length===0){
            console.log("No saved requests found.")
            return
        }
        console.log("Saved API Requests:")
        data.forEach(element => {
            console.log(`ID: ${element.id} | Method: ${element.method} | URL: ${element.url}`)
        });
    })
export default listCommand