import {promises as fs, read} from "fs"
import path from "path"
import os from "os"
import { error } from "console"

const APIX_DIR= path.join(os.homedir(), ".apix")
const ENV_DIR= path.join(APIX_DIR, "environments")
const CONFIG_PATH= path.join(APIX_DIR, "config.json")

function getEnvironmentPath(name){
    return path.join(ENV_DIR, `${name}.json`)
}

function validateName(name){
    const regex= /^[a-zA-Z0-9_-]+$/
    if(!regex.test(name)){
        throw new Error("Environment name can only contain letters, numbers, hyphens and underscores.")

    }
}

async function ensureDirectories(){
    await fs.mkdir(ENV_DIR, {recursive:true})
}

async function readConfig(){
    try{
        const data= await fs.readFile(CONFIG_PATH, "utf8")
        return JSON.parse(data);
    }
    catch{
        return {
            currentEnvironment: null,
            ai: "groq",
        }
    }
}

async function writeConfig(config) {
    await fs.mkdir(APIX_DIR, { recursive: true });

    await fs.writeFile(
        CONFIG_PATH,
        JSON.stringify(config, null, 2),
        "utf8"
    );
}

async function environmentExists(name){
    try{
        await fs.access(getEnvironmentPath(name))
        return true;
    }
    catch{
        return false;
    }
}



export async function createEnvironment(name) {
    validateName(name)

    await ensureDirectories();
    if(await environmentExists(name)){
        throw new Error(`Environment "${name}" already exists.`)
    }
    const environment= {
        name,
        variables:{},
        createdAt: new Date().toISOString()
    }
    await fs.writeFile(
        getEnvironmentPath(name),
        JSON.stringify(environment, null, 2), "utf8"
    )

    const config= await readConfig()
    if(!config.currentEnvironment){
        config.currentEnvironment= name
        await writeConfig(config)
    }
    return true;
    
}

export async function deleteEnvironment(name) {
    if(!(await environmentExists(name))){
        throw new Error(`Environment "${name}" does not exist.`)
    }
    const config= await readConfig();
    if(config.currentEnvironment===name){
        throw new Error("Cannot delete the active Environment. Switch to another env before deleting.")
    }
    await fs.unlink(getEnvironmentPath(name))
    return true;
}


export async function useEnvironment(name) {
    if(!(await environmentExists(name))){
        throw new Error(`Environment "${name}" does not exist.`)
    }
    const config= await readConfig()
    config.currentEnvironment=name
    await writeConfig(config)
    return true
}


export async function listEnvironments() {
    await ensureDirectories()
    const files= await fs.readdir(ENV_DIR)

    return files
        .filter(file=> file.endsWith(".json"))
        .map(file=> file.replace(".json", ""))
}


export async function getCurrentEnvironment() {
    const config= await readConfig()
    return config.currentEnvironment
}



export async function getCurrentEnvironmentPath(){
    const current = await getCurrentEnvironment()

    if(!current){
        throw new Error("No active envrionment")
    }
    return getEnvironmentPath(current)
}