import fs from "fs"
import path from "path"
import axios from "axios"

import { Command } from "commander"
import {readChains, writeChains} from "../utils/chain-storage.js"

const variablePattern= /{{\s*([A-Za-z_][A-Za-z0-9_]*)\s*}}/g

function interpolate(value, variables){
  if(typeof value==="string" ){
    return value.replace(variablePattern, (match, key)=>{
      if(!(key in variables)){
        throw new Error(` Variable "${key}" is not avilable`)
      }
      return String(variables[key])
    })
  }

  if(Array.isArray(value)){
    return value.map((item)=> interpolate(item, variables))
  }

   if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [
        key,
        interpolate(item, variables),
      ])
    )
  }  
  return value
}

function extractValue(data, expression){
  const pathParts= expression
  .replace(/\[(\d+)\]/g, ".$1")
  .split(".")
  .filter(Boolean)
  return pathParts.reduce((value, key)=> value?.[key], data)
}

function validateChain(chain){
  if(!chain || !Array.isArray(chain.steps) || chain.steps.length===0){
    throw new Error("A chain must contain atleast one step")
  }

  chain.steps.forEach((step, index) => {
      if(!step.url){
        throw new Error(`Step ${index+1} is missing a URL`)
      }
      if(step.extract && (typeof step.extract !== "object" || Array.isArray(step.extract))){
        throw new Error(`Step ${index +1 } has an invalid extract mapping`)
      }
  })
}

function loadChainDefinition(name, options){
  const defintionPath= options.file || `${name}.json`

  if(!fs.existsSync(defintionPath)){
    throw new Error(`Chain definition not found: ${path.resolve(defintionPath)}. Use --file <path>`)
  }

  const chain= JSON.parse(fs.readFileSync(defintionPath, "utf8"))
  chain.name= name

  validateChain(chain)
  return chain
}

function formatRequestError(error){
  if(error.response){
    return{
      message: `${error.response.status} -  ${error.response.statusText}`,
      data: error.response.data,
    }
  }
  return { message: error.message}
}

const chainCommand= new Command("chain")
.description("Save and run API request chains")

chainCommand
.command("save <name>")
.description("Save a chain definition; defaults to <name>.json")
.option("-f, --file <path>", "Path to a chain JSON definition")
.action((name, options)=>{
  try{
    const chain= loadChainDefinition(name, options)
    const chains= readChains()
    const existingIndex= chains.findIndex((item)=> item.name=== name)

    if(existingIndex>=0){
      chains[existingIndex]= chain
    }else{
      chains.push(chain)
    }

    writeChains(chains)

    console.log(`Saved chain ${name} with ${chain.steps.length} step(s)`)
  }catch(error){
    console.error(`Failed to save chain: ${error.message}`)
  }
})

chainCommand
.command("run <name>")
.description("Run a saved chain and stop at the first failed step")
.action(async(name)=>{
  const chain= readChains().find((item)=> item.name ===name)

  if(!chain){
    console.error(`No saved chain found with name "${name}".`)
    return
  }
  const variables= {...(chain.variables || {})}
  console.log(`Running chain ${name} (${chain.steps.length} step(s))`)

  for(let index=0; index<chain.steps.length; index++){
    const step= chain.steps[index]
    const label= step.name || `Step ${index+1}`

    try{
      const method= step.method || "GET"
      const url= interpolate(step.url, variables)
      const headers= interpolate(step.headers || step.header || {}, variables)
      const body= interpolate(step.body, variables)

      const response= await axios({
        method: method.toLowerCase(),
        url,
        headers,
        data: body,
      })

      for(const [variable, responsePath] of Object.entries(step.extract || {})){
        const extractedValue = extractValue(response.data, responsePath);

          if (extractedValue === undefined) {
            throw new Error(
              `Could not extract "${variable}": response path "${responsePath}" was not found.`
            );
          }

          variables[variable] = extractedValue;
        }

        console.log(`✔ ${index + 1}. ${label} — ${response.status}`);
      } catch (error) {
        const details = formatRequestError(error);

        console.error(`✖ ${index + 1}. ${label} — ${details.message}`);

        if (details.data !== undefined) {
          console.error(`  Response: ${JSON.stringify(details.data)}`);
        }

        console.error(
          `Chain failed at step ${index + 1}; remaining steps were not run.`
        );

        process.exitCode = 1;
        return;
      }
    }

    console.log(`Chain "${name}" completed successfully.`);
  });

chainCommand
  .command("list")
  .description("List saved chains")
  .action(() => {
    const chains = readChains();

    if (chains.length === 0) {
      console.log("No saved chains found.");
      return;
    }

    chains.forEach((chain) => {
      console.log(`${chain.name} (${chain.steps.length} step(s))`);
    });
  });

export default chainCommand;
