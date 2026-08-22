import fs from "fs"
import os from "os"
import path from "path"

const directory= path.join(os.homedir(), ".apix")
const file= path.join(directory, "chains.json")

const ensureStore= ()=>{
    if(!fs.existsSync(directory)){
        fs.mkdirSync(directory, {recursive: true})
    }

    if(!fs.existsSync(file)){
        fs.writeFileSync(file, "[]", "utf8")

    }
}

export const readChains= ()=>{
    ensureStore()
    try{
        const chains= JSON.parse(fs.readFileSync(file, "utf8"))
        return Array.isArray(chains)?chains:[]
    }catch{
        return []
    }
}

export const writeChains= (chains)=>{
    ensureStore()
    fs.writeFileSync(file, JSON.stringify(chains, null, 2), "utf8")
}
