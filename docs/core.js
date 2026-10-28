export const REDS = ['#b5222a', '#cf3030', '#96212a'];
export function sealText(value, suffix = false) {
  const text = String(value).normalize('NFC').replace(/\s+/gu, '').trim();
  if (!text || Array.from(text).length > 12) throw new Error('nameLength');
  return text + (suffix ? '인' : '');
}
export function validateGlyphs(text, font) {
  const supported = new Set(font.codepoints);
  const missing = [...new Set(Array.from(text).filter(c => !supported.has(c.codePointAt(0))))];
  if (missing.length) { const error = new Error('unsupported'); error.characters = missing.join(' '); throw error; }
}
export function drawSeal(canvas, options, font) {
  const text = sealText(options.name, options.suffix);
  validateGlyphs(text, font);
  if (!['circle', 'oval', 'square', 'rounded'].includes(options.shape)) throw new Error('shape');
  if (!['grid', 'vertical', 'horizontal'].includes(options.layout)) throw new Error('layout');
  if (!REDS.includes(options.color)) throw new Error('color');
  const size = Number(options.size);
  if (![512, 1024, 2048].includes(size)) throw new Error('size');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, size, size);
  ctx.save(); ctx.scale(size / 1000, size / 1000);
  ctx.strokeStyle = ctx.fillStyle = options.color;
  ctx.lineWidth = Math.max(8, Math.min(30, Number(options.border) || 17));
  ctx.lineJoin = 'round'; ctx.beginPath();
  let box;
  if (options.shape === 'circle') { ctx.arc(500, 500, 425, 0, Math.PI * 2); box = [205, 205, 590, 590]; }
  else if (options.shape === 'oval') { ctx.ellipse(500, 500, 290, 425, 0, 0, Math.PI * 2); box = [333, 185, 334, 630]; }
  else { if (options.shape === 'rounded') ctx.roundRect(90, 90, 820, 820, 65); else ctx.rect(90, 90, 820, 820); box = [150, 150, 700, 700]; }
  ctx.stroke();
  const chars = Array.from(text);
  let cols = options.layout === 'vertical' ? 1 : options.layout === 'horizontal' ? chars.length : chars.length <= 2 ? 1 : chars.length <= 8 ? 2 : 3;
  const rows = Math.ceil(chars.length / cols), [x, y, w, h] = box, cw = w / cols, ch = h / rows;
  chars.forEach((char, index) => {
    const col = options.layout === 'horizontal' ? index : cols - 1 - Math.floor(index / rows);
    const row = options.layout === 'horizontal' ? 0 : index % rows;
    const cx = x + (col + .5) * cw, cy = y + (row + .5) * ch;
    let px = Math.min(cw, ch) * .90;
    ctx.font = `${px}px "${font.family || font.id}"`;
    let m = ctx.measureText(char);
    const inkWidth = m.actualBoundingBoxLeft + m.actualBoundingBoxRight || m.width;
    const inkHeight = m.actualBoundingBoxAscent + m.actualBoundingBoxDescent || px;
    px *= Math.min(1, cw * .92 / inkWidth, ch * .89 / inkHeight);
    ctx.font = `${px}px "${font.family || font.id}"`;
    m = ctx.measureText(char);
    ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
    const left = cx - ((m.actualBoundingBoxLeft + m.actualBoundingBoxRight) || m.width) / 2 + (m.actualBoundingBoxLeft || 0);
    const baseline = cy + ((m.actualBoundingBoxAscent || px * .8) - (m.actualBoundingBoxDescent || 0)) / 2;
    ctx.fillText(char, left, baseline);
  });
  ctx.restore();
  const texture = Math.max(0, Math.min(18, Number(options.texture) || 0));
  const image = ctx.getImageData(0, 0, size, size);
  const red = [1,3,5].map(i => parseInt(options.color.slice(i,i+2),16));
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const i = (y * size + x) * 4;
    if (!image.data[i+3]) continue;
    // Keep antialiased edge alpha, but never bake white matte pixels into PNG.
    for(let c=0;c<3;c++)image.data[i+c]=red[c];
    const hash = (((x >>> 1) * 374761393 ^ (y >>> 1) * 668265263) >>> 0) % 100;
    if (texture && hash < texture) image.data[i + 3] = 0;
  }
  ctx.putImageData(image, 0, 0);
  return {text, width:size, height:size};
}
