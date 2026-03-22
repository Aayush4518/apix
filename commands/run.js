import axios from "axios";
// import { program } from "commander";
import { Command } from "commander";



const runCommand= new Command('run')
    .description("Run API tests based on provided configurations")
    .argument('<method>', 'HTTP method (GET, POST, PUT, DELETE)')
    .argument('<url>', 'API endpoint URL')
    .usage('<command> [options]') 
    .option('-H, --header <header...>', 'Add custom header to the request in double quotes, e.g. -H "Content-Type: application/json"')
    .option('-d, --data <data>', 'Add request body (JSON)') 
    .action(async(method, url, options)=>{
        try{
            let header= {} // Initialize header object
            if(options.header) //checks if header are provided
            {
                options.header.forEach(h => {
                    const [key, ...value]= h.split(':')
                    header[key.trim()]= value.join(':').trim() //header[content-type]= application/json
                });
            }
            //parse body
            let data= undefined
            if(options.data){
                try{
                    data= JSON.parse(options.data)
                }
                catch(error){
                    console.error('Invalid JSON data provided. Please ensure the data is in valid JSON format.');
                    return;
                }
            }
            const response= await axios({
                method: method.toLowerCase(), url, headers: header, data //because axios expects headers and not header
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