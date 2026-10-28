import {drawSeal} from './core.js';
const $ = id => document.getElementById(id);
const status = $('status'), download = $('download'), canvas = $('canvas');
let fonts, lastGood=false, generation=0;
const errors = {nameLength:'이름은 공백 제외 1–12자로 입력해 주세요.',unsupported:'이 폰트가 지원하지 않는 문자가 있습니다.',color:'빨간 인주 색을 선택해 주세요.',shape:'모양을 선택해 주세요.',layout:'글자 배치를 선택해 주세요.',size:'지원하는 PNG 크기를 선택해 주세요.'};
function options() { return {name:$('name').value,suffix:$('suffix').checked,font:$('font').value,shape:$('shape').value,layout:$('layout').value,color:document.querySelector('[name=color]:checked').value,border:$('border').value,texture:$('texture').value,size:$('size').value}; }
async function update() {
  if (!fonts) return;
  const current=++generation;
  download.disabled=true; lastGood=false;
  try {
    const opts=options(), font=fonts.find(f=>f.id===opts.font);
    await document.fonts.load(`30px "${font.family}"`);
    if(current!==generation)return;
    const result=drawSeal(canvas,opts,font);
    $('dimensions').textContent=`${result.width} × ${result.height}`;
    status.textContent='준비됐습니다. 투명 PNG로 저장하세요.';
    status.classList.remove('error'); download.disabled=false; lastGood=true;
  } catch(error) {
    canvas.getContext('2d').clearRect(0,0,canvas.width,canvas.height);
    status.textContent=(errors[error.message] || '도장을 만들지 못했습니다. 설정을 확인해 주세요.')+(error.characters ? ' '+error.characters : '');
    status.classList.add('error');
  }
}
for(const input of document.querySelectorAll('.controls input,.controls select'))input.addEventListener('input',update);
$('previewBg').addEventListener('change',()=>{$('preview').className='preview-bg '+$('previewBg').value;});
download.addEventListener('click',()=>{
  if(!lastGood)return;
  download.disabled=true;
  canvas.toBlob(blob=>{
    if(!blob){status.textContent='PNG 저장에 실패했습니다. 다시 시도해 주세요.';download.disabled=false;return;}
    const url=URL.createObjectURL(blob),a=document.createElement('a');
    a.href=url;a.download='red-seal.png';a.setAttribute('data-google-vignette','false');a.setAttribute('data-google-interstitial','false');document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);
    status.textContent='투명 PNG를 만들었습니다. 브라우저 다운로드 목록을 확인하세요.';download.disabled=false;
  },'image/png');
});
try {
  const response=await fetch('./fonts/manifest.json');
  if(!response.ok)throw new Error('fonts');
  fonts=await response.json();
  await Promise.all(fonts.map(async font=>{
    font.family='Seal-'+font.id;
    const face=new FontFace(font.family,`url("./fonts/${font.file}")`);
    document.fonts.add(await face.load());
  }));
  await update();
}catch(error){status.textContent='무료 폰트를 불러오지 못했습니다. 새로고침해 주세요.';status.classList.add('error');}
