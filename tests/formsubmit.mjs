import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';
const cache=new Map();
function load(file){file=path.resolve(file);if(cache.has(file))return cache.get(file);const module={exports:{}};cache.set(file,module.exports);const js=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;new Function('require','exports','module',js)((specifier)=>load(path.resolve(path.dirname(file),specifier+'.ts')),module.exports,module);return module.exports;}
const {formSubmitPayload,forwardSubmission,formSubmitEndpoint}=load('lib/formsubmit.ts');
assert.equal(formSubmitEndpoint,'https://formsubmit.co/ajax/prajapaticeramics@gmail.com');
const base={name:'LOCAL MOCK TEST',email:'customer@example.invalid',phone:'+977 9800000000',message:'A message for the studio.'};
for(const kind of ['booking','contact','business','personal','firing']){const payload=formSubmitPayload({...base,kind,experience:'two-hour',studio:'Thamel',date:'2099-02-01',time:'12:30',participants:3,details:{product:'Cups',quantity:20,logo:'Logo request',deliveryDate:'2099-03-01'}},'12345678-test-reference');assert.equal(payload._replyto,base.email);assert.equal(payload.email,base.email);assert.equal(payload.phone,base.phone);assert.equal(payload.Reference,'12345678-test-reference');assert(payload._subject.includes('Prajapati Ceramic'));assert(!Object.keys(payload).some(k=>/token|tracking/i.test(k)));assert(!Object.values(payload).some(v=>typeof v!=='string'));assert(payload['Status'].includes('not a confirmed'));if(kind==='booking'){assert.equal(payload.Experience,'Two-Hour Pottery Experience');assert.equal(payload['Preferred studio'],'Thamel');assert.equal(payload.Participants,'3');assert(payload['Preferred time'].includes('Nepal'));}assert.equal(payload.Quantity,'20');}
const s={...base,kind:'contact'};
for(const value of [true,'true'])assert.equal(await forwardSubmission(s,'ref',async(url,init)=>{assert.equal(url,formSubmitEndpoint);assert.equal(init.method,'POST');return Response.json({success:value,message:'Form successfully submitted'});}), 'accepted');
assert.equal(await forwardSubmission(s,'ref',async()=>Response.json({success:'false',message:'Please confirm your email address'})),'activation_required');
assert.equal(await forwardSubmission(s,'ref',async()=>Response.json({success:'false'})),'failed');
assert.equal(await forwardSubmission(s,'ref',async()=>new Response('denied',{status:403})),'failed');
assert.equal(await forwardSubmission(s,'ref',async()=>{throw new Error('Network failure');}),'failed');
assert.equal(await forwardSubmission(s,'ref',async()=>new Response('not JSON')),'failed');
console.log('PASS: fixed recipient, all five form payloads, booking/custom details, customer Reply-To, private-token exclusion, acceptance, activation-required and provider/network failures. No real emails sent by these tests.');
