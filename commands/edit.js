//code to edit a saved api

import { Command } from "commander";
import { readData, writeData } from "../utils/storage.js";

const editCommand = new Command('edit')
    .description('Edit a saved request')
    .argument('<id>', 'ID of the request to edit')
    .option('-m, --method <method>', 'HTTP method')
    .option('-u, --url <url>', 'API endpoint URL')
    .option('-H, --header <header...>', 'Add custom header, e.g. -H "Content-Type: application/json"')
    .option('-d, --data <data...>', 'Add request body (JSON or key=value pairs)')
    .action((id, options)=>{
        const data= readData()
        const index= data.findIndex((r)=> String(r.id)=== String(id)) //find the index of the request to edit
        if(index=== -1){
            console.log(`Request with ID ${id} not found.`);
            return;
        }
        const req= data[index]
        req.method= options.method? options.method.toUpperCase() : req.method
        req.url= options.url || req.url
        if(options.header){
            req.header= parseHeaders(options.header)
        }   
        if(options.data){
            const parsedData= parseDataArg(options.data)
            req.body= typeof parsedData === 'string' ? tryParseJson(parsedData) : parsedData
        }
        data[index]= req
        writeData(data)
        console.log(`Request with ID ${id} updated.`);

    })
export default editCommand;

function tryParseJson(str){
    try {
        return JSON.parse(str);
    } catch {
        return str;
    }
}   