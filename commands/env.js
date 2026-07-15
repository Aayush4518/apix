import { Command } from "commander";
import { createEnvironment, deleteEnvironment, useEnvironment, listEnvironments, getCurrentEnvironment } from "../utils/environment.js";

const env= new Command("env");

env
    .description("Managing environments")

env
    .command("create-env <name>")
    .description("Create a new environment")
    .action(async (name) => {
    try {
        await createEnvironment(name);
        console.log(`✔ Environment "${name}" created successfully.`);
    } catch (err) {
        console.error(`✖ Failed. ${err.message}`);
    }
})

env
    .command("use-env <name>")
    .description("Switch to an Environment")
    .action(async(name)=>{
        try{
        console.log(`Switching to ${name}`)
        await useEnvironment(name)
        console.log(`✔Switched to ${name}`)
    }catch(err){
        console.error(`✖Failed to switch. ${err.message}`)
    }
    })

//list all available environments

env
    .command("list-env")
    .description("List all the avalable envs")
    .action(async()=>{
        try {
      const environments = await listEnvironments();
      const current = await getCurrentEnvironment();

      if(environments.length === 0) {
        console.log("No environments found.")
        return;
      }

      console.log("\nEnvironments\n");

      environments.forEach((env) => {
        if(env === current) {
          console.log(`✔ ${env} (current)`)
        } 
        else{
          console.log(`  ${env}`)
        }
      });
    } catch(err) {
      console.error(`✖ ${err.message}`)
    }
    })

env
    .command("current-env")
    .description("Show the current Environment")
    .action(async()=>{
        try {
      const current = await getCurrentEnvironment();

      if (!current) {
        console.log("No active environment.");
        return;
      }

      console.log(`Current Environment: ${current}`);
    } catch (err) {
      console.error(`✖ ${err.message}`);
    }
    })

//delete
env
    .command("delete-env <name>")
    .description("delete an Environemnt")
    .action(async(name)=>{
        try {
      await deleteEnvironment(name);
      console.log(`Environment "${name}" deleted successfully.`);
    } catch (err) {
      console.error(`✖Failed. ${err.message}`);
    }
    })

export default env;