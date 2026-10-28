import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import {drawSeal,sealText,validateGlyphs,REDS} from '../src/core.js';
const require=createRequire(import.meta.url);
const {createCanvas,GlobalFonts}=require(process.env.NANA_TEST_NODE_MODULES ? path.join(process.env.NANA_TEST_NODE_MODULES,'@napi-rs/canvas') : '@napi-rs/canvas');
const fonts=JSON.parse(fs.readFileSync(new URL('../src/fonts/manifest.json',import.meta.url)));
for(const font of fonts){font.family='Seal-'+font.id;assert.ok(GlobalFonts.registerFromPath(fileURLToPath(new URL('../src/fonts/'+font.file,import.meta.url)),font.family));}
const defaults={name:'홍길동',suffix:true,shape:'circle',layout:'grid',color:REDS[0],size:512,border:17,texture:0};
test('normalizes Korean names and refuses empty, excessive and unsupported text',()=>{
  assert.equal(sealText(' 홍 길 동 ',true),'홍길동인');
  assert.throws(()=>sealText(' '),/nameLength/);assert.throws(()=>sealText('가'.repeat(13)),/nameLength/);
  for(const font of fonts) {validateGlyphs('홍길동인ABC',font);assert.throws(()=>validateGlyphs('😀',font),/unsupported/);}
});
for(const font of fonts)for(const shape of ['circle','oval','square','rounded'])test(font.name+' / '+shape+' exports transparent red ink',()=>{
  const canvas=createCanvas(512,512);drawSeal(canvas,{...defaults,shape},font);
  const data=canvas.getContext('2d').getImageData(0,0,512,512).data;
  let clear=0,ink=0,partial=0;
  for(let i=0;i<data.length;i+=4){if(!data[i+3])clear++;else {ink++;assert.ok(data[i]>data[i+1]*1.6);assert.ok(data[i]>data[i+2]*1.5);if(data[i+3]<255)partial++;}}
  assert.ok(clear>512*512*.65);assert.ok(ink>4000);assert.ok(partial>0);assert.equal(data[3],0);
  if(shape==='circle'){fs.mkdirSync(new URL('../artifacts/',import.meta.url),{recursive:true});fs.writeFileSync(new URL('../artifacts/'+font.id+'.png',import.meta.url),canvas.toBuffer('image/png'));}
});
test('layout, size, color and texture produce real pixel changes',()=>{
  const a=createCanvas(512,512),b=createCanvas(512,512);
  drawSeal(a,defaults,fonts[0]);drawSeal(b,{...defaults,texture:18,layout:'vertical'},fonts[0]);
  assert.notDeepEqual(a.toBuffer('image/png'),b.toBuffer('image/png'));
  drawSeal(b,{...defaults,size:2048,name:'Alice',suffix:false},fonts[1]);assert.equal(b.width,2048);
  assert.throws(()=>drawSeal(b,{...defaults,color:'#0000ff'},fonts[0]),/color/);
});
