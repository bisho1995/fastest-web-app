import { getFiles, setupPrecaching, setupRouting } from "preact-cli/sw/";

setupRouting();

const filesToCache = getFiles();
console.log(filesToCache);
setupPrecaching(filesToCache);
