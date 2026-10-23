import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
const config=JSON.parse(readFileSync(new URL('../vercel.json',import.meta.url),'utf8'));
const output=new URL('../.vercel-gateway/',import.meta.url);
if(config.framework!==null||config.outputDirectory!=='.vercel-gateway')throw new Error('Vercel must use the gateway configuration, not the Next.js preset.');
mkdirSync(output,{recursive:true});
writeFileSync(new URL('index.html',output),'<!doctype html><html lang="en"><meta charset="utf-8"><title>Prajapati Ceramic</title><p>Prajapati Ceramic</p></html>\n');
console.log('Vercel gateway built. All page, asset and API paths are served by the existing application origin.');
