import { experiences, site } from "../content/site";
export type SubmissionKind="booking"|"contact"|"business"|"personal"|"firing";
export type FormSubmission={kind:SubmissionKind;name:string;email:string;phone:string;message?:string;experience?:string;studio?:string;date?:string;time?:string;participants?:number;details?:{product?:string;quantity?:number;logo?:string;deliveryDate?:string}};
const labels:Record<SubmissionKind,string>={booking:"Pottery booking request",contact:"Studio contact inquiry",business:"Custom business ceramics inquiry",personal:"Personalized ceramics inquiry",firing:"Glazing and firing inquiry"};
export const formSubmitEndpoint=`https://formsubmit.co/ajax/${site.email}`;
export function formSubmitPayload(submission:FormSubmission,reference:string){
 const page=submission.kind==='booking'?'/booking':submission.kind==='business'||submission.kind==='personal'?'/ceramics':submission.kind==='firing'?'/glazing-firing':'/contact';
 const payload:Record<string,string>={name:submission.name,email:submission.email,phone:submission.phone,"Request type":labels[submission.kind],"Reference":reference,"Status":"Pending studio review — not a confirmed booking or order",message:submission.message||"No additional requests.","Staff dashboard":`${site.url}/admin`,_subject:`Prajapati Ceramic — ${labels[submission.kind]} — ${reference.slice(0,8)}`,_replyto:submission.email,_template:"table",_captcha:"false",_url:site.url+page};
 if(submission.kind==='booking')Object.assign(payload,{"Experience":experiences.find(e=>e.id===submission.experience)?.formal??submission.experience??'',"Preferred studio":submission.studio??'',"Preferred date":submission.date??'',"Preferred time":`${submission.time??''} (Nepal time, UTC+05:45)`,"Participants":String(submission.participants??'')});
 if(submission.details){const d=submission.details;if(d.product)payload['Requested product / clay type']=d.product;if(d.quantity)payload['Quantity']=String(d.quantity);if(d.logo)payload['Logo / branding']=d.logo;if(d.deliveryDate)payload['Preferred delivery date']=d.deliveryDate;}
 return payload;
}
export type EmailForwarding="accepted"|"activation_required"|"failed";
// Standard FormSubmit AJAX integration runs in the browser after the request is saved.
// A provider acknowledgement is not proof of inbox delivery or account activation.
export async function forwardSubmission(submission:FormSubmission,reference:string,send:typeof fetch=fetch):Promise<EmailForwarding>{
 const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),10000);
 try{const response=await send(formSubmitEndpoint,{method:"POST",headers:{"Content-Type":"application/json",Accept:"application/json"},body:JSON.stringify(formSubmitPayload(submission,reference)),signal:controller.signal});if(!response.ok)return "failed";const result=await response.json() as {success?:unknown;message?:unknown};const message=typeof result.message==='string'?result.message:'';if(/activat|confirm your (email|form)|verif(y|ication)/i.test(message))return "activation_required";return result.success===true||result.success==='true'?"accepted":"failed";}catch{return "failed";}finally{clearTimeout(timeout);}
}
