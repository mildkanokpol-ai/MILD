const fs=require('fs'),path=require('path');
const files=JSON.parse(fs.readFileSync('project-sources.json','utf8'));
for(const [name,text] of Object.entries(files)){
 if(name.startsWith('/')||name.includes('..')||name.includes('\\'))throw Error('Invalid source path');
 const output=path.resolve('android',name);fs.mkdirSync(path.dirname(output),{recursive:true});fs.writeFileSync(output,text);
}
console.log('Extracted Android project into android/');
