import axios from "axios";
// import { program } from "commander";
import { Command } from "commander";



const runCommand= new Command('run')
    .description("Run API tests based on provided configurations")
    .argument('<method>', 'HTTP method (GET, POST, PUT, DELETE)')
    .argument('<url>', 'API endpoint URL')
    .usage('<command> [options]') 
    .action(async(method, url)=>{
        try{
            const response= await axios({
                method, url
            })
            console.log(`Status: ${response.status}`);
            console.log('Response data:', response.data);
        }
        catch(error){
            if(error.response){
                console.error(`Error: ${error.response.status} - ${error.response.statusText}`);
                console.error('Response data:', JSON.stringify(error.response.data, null, 2));
            }
            else{
                console.error('Error:', error.message);
            }
        }

    })

export default runCommand