import {createHash} from 'node:crypto';
import {finalizePublicSite} from './publisher-tracking.mjs';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const source=path.join(root,'src'),dist=path.join(root,'docs');
if(path.dirname(dist)!==root||path.basename(dist)!=='docs')throw new Error('Invalid build target');
await fs.mkdir(dist,{recursive:true});
await fs.cp(source,dist,{recursive:true});
const version=createHash('sha256').update(await fs.readFile(path.join(source,'app.js'))).digest('hex').slice(0,12);
await fs.writeFile(path.join(dist,'index.html'),(await fs.readFile(path.join(dist,'index.html'),'utf8')).replace('src="app.js"','src="app.js?v='+version+'"'));
const app=JSON.parse(await fs.readFile(path.join(root,'APP.json'),'utf8'));
await fs.writeFile(path.join(dist,'robots.txt'),'User-agent: *\nAllow: /\n');
await fs.writeFile(path.join(dist,'sitemap.xml'),'<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>'+app.origin+'/</loc></url></urlset>\n');
console.log(JSON.stringify({status:'built',app:app.slug,origin:app.origin}));

console.log(JSON.stringify({publisher_pages:await finalizePublicSite(dist,app)}));
