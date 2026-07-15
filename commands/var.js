import { Command } from "commander";
import { setVariable, getVariable, listVariables, deleteVariable } from "../utils/variable.js";



const variable = new Command("var")

variable.description("Manage environment variables");

//setting variables

variable
    .command("set <key> <value>")
    .description("Set a variable")
    .action(async (key, value) => {
        try {
            await setVariable(key, value);
            console.log(`✔ Variable "${key}" saved`)

        } catch (err) {
            console.error(`✖ ${err.message}`)
        }
    })

//getting

variable
    .command("get <key>")
    .description("Get your variable")
    .action(async (key) => {
        try {
            const value = await getVariable(key);

            if (value === null) {
                console.log(`Variable "${key}" not found.`);
                return;
            }

            console.log(`${key} = ${value}`);
        } catch (err) {
            console.error(`✖ ${err.message}`)
        }
    })

//listing
variable
    .command("list")
    .description("list all the variables")
    .action(async () => {
        try {
            const variables = await listVariables()
            if (Object.keys(variables).length === 0) {
                console.log("No variables found");
                return;
            }
            console.log("\nVariables\n")

            for (const [key, value] of Object.entries(variables)) {
                console.log(`${key} = ${value}`)
            }
        } catch (err) {
            console.error(`✖ ${err.message}`);
        }

    })

variable
    .command("delete <key>")
    .description("Delete a variable")
    .action(async (key) => {
        try {
            await deleteVariable(key);
            console.log(`✔ Variable "${key}" deleted.`);
        } catch (err) {
            console.error(`✖ ${err.message}`);
        }
    });

export default variable