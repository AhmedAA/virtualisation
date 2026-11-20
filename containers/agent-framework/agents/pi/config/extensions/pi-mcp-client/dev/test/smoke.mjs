import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
const originalHome = process.env.HOME;
const home = await mkdtemp(join(process.cwd(), '.smoke-home-'));
const configDir = join(home, '.pi', 'agent');
await import('node:fs/promises').then(fs => fs.mkdir(configDir, {recursive: true}));
await writeFile(join(configDir, 'mcps.json'), JSON.stringify({servers:{smoke:{name:'smoke',transport:'local',command:process.execPath,args:[join(process.cwd(),'test/stdio-server.mjs')],timeout:4000}}}));
process.env.HOME = home;
try {
  const {default: extensionFactory} = await import('../../mcp.mjs');
  const tools = new Map();
  let command;
  extensionFactory({ registerCommand(name, options) { if(name === 'mcp') command=options; }, registerTool(definition) { tools.set(definition.name, definition); }, on() {} });
  if (!command) throw Error('missing /mcp');
  const notices=[];
  const ctx={ui:{notify:(text,type)=>{notices.push([text,type]); console.log('notice:',text)},input:async()=>undefined}};
  await command.handler('connect smoke',ctx);
  console.log('tools:',Array.from(tools.keys()));
  if (!tools.has('smoke__ping')) throw Error('MCP tool not registered');
  const tool=tools.get('smoke__ping');
  const output=await tool.execute('1',{text:'hi'},undefined,undefined,ctx);
  if(output.content[0]?.text!=='pong')throw Error('wrong tool output');
  await command.handler('disconnect smoke',ctx);
  console.log('tool registration and invocation passed');
} finally { process.env.HOME=originalHome; await rm(home,{recursive:true,force:true}); }
