/** Refresh the declared reference snapshot from a trusted, local core checkout.
 * Run from the docs repository: node scripts/sync-core-docs.mjs /path/to/artemiskit
 * Review the resulting diff before committing. No remote code is executed.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
if(!process.argv[2])throw new Error('Pass the absolute path to the core checkout.');
const source=path.resolve(process.argv[2]);
const manifestPath=path.join(root,'reference/source-manifest.json');
const manifest=JSON.parse(fs.readFileSync(manifestPath,'utf8'));
const sha=execFileSync('git',['-C',source,'rev-parse','HEAD'],{encoding:'utf8'}).trim();
const routes=new Map(Object.entries(manifest.pages).map(([route,file])=>[file,route]));
const date=new Date().toISOString().slice(0,10);
for(const [route,file] of Object.entries(manifest.pages)){
 const target=path.join(root,route+'.md');
 const current=fs.readFileSync(target,'utf8');const front=current.match(/^---\n[\s\S]*?\n---\n/)[0];
 // Read the committed source, so working-tree changes cannot silently alter provenance.
 let body=execFileSync('git',['-C',source,'show',`${sha}:${file}`],{encoding:'utf8'}).replace(/^# .+\n/,'');
 body=body.replace(/\[([^\]]+)\]\(([^\s)]+)\)/g,(all,label,url)=>{
  if(/^(https?:|mailto:|#|\/)/.test(url))return all;
  const [relative,...parts]=url.split('#');const resolved=path.posix.normalize(path.posix.join(path.posix.dirname(file),relative));
  const dest=routes.has(resolved)?`/docs/${routes.get(resolved)}/`:`https://github.com/code-sensei/artemiskit/blob/${sha}/${resolved}`;
  return `[${label}](${dest}${parts.length?'#'+parts.join('#'):''})`;
 });
 const note=`> Source: [core repository guide](https://github.com/code-sensei/artemiskit/blob/${sha}/${file}), snapshot \`${sha.slice(0,12)}\`. Synced ${date}. Package versions are independent of milestone labels.\n\n`;
 fs.writeFileSync(target,front+'\n'+note+body);
}
manifest.commit=sha;manifest.synced=date;fs.writeFileSync(manifestPath,JSON.stringify(manifest,null,2)+'\n');
console.log(`Refreshed ${routes.size} source-backed guides from ${sha}. Review and commit the diff.`);
