import fs from "fs/promises";

export async function readData(filePath) {
    try{
        const data = await fs.readFile(filePath, "utf-8");
        return JSON.parse(data);
    }
    catch (err){
        console.error(`Error reading data from ${filePath}:`, err);
        throw err;
    }
}

export async function writeData(filePath, data){
    try{
        const userData = JSON.stringify(data, null, 2);
        await fs.writeFile(filePath, userData, "utf-8");
        console.log(`Data successfully written to ${filePath}`);
        return true;
    }
    catch(err){
        console.error(`Error writing data to ${filePath}:`, err);
        throw err;
    }
}