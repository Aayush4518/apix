import {promises as fs, write} from "fs"
import { getCurrentEnvironmentPath } from "./environment.js"

async function readEnvironment(){
    const file= await getCurrentEnvironmentPath()
    const data= await fs.readFile(file, "utf8")
    return JSON.parse(data)
}

async function writeEnvironment(environment){
    const file= await getCurrentEnvironmentPath()
    await fs.writeFile(file, JSON.stringify(environment, null, 2), "utf8")


}
export async function getVariable(key) {
    const environment = await readEnvironment()

    return environment.variables[key] ?? null
}

function validateKey(key) {
    const regex = /^[A-Z][A-Z0-9_]*$/;
    
    if (!regex.test(key)) {
        throw new Error(
            "Variable names should contain only uppercase letters, numbers and underscores."
        );
    }
}
export async function setVariable(key, value){
    validateKey(key)
    const environment= await readEnvironment()
    environment.variables[key]?? null;
    environment.variables[key]= value
    await writeEnvironment(environment)
    return true;

}
export async function listVariables() {
    const environment= await readEnvironment()
    return environment.variables
    
}

export async function deleteVariable(key) {
    const environment= await readEnvironment()

    if(!(key in environment.variables)){
        throw new Error(`Variables ${key} does not exist`)
    }
    delete environment.variables[key]
    await writeEnvironment(environment)
    return true;
}