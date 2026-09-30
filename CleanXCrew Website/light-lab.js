(() => {
  'use strict';
  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];
  const ns = 'http://www.w3.org/2000/svg';
  const photoInput = $('#home-photo');
  const image = $('#lab-image');
  const stage = $('#lab-stage');
  const placeholder = $('#lab-placeholder');
  const svg = $('#lab-svg');
  const linesGroup = $('#lab-lines');
  const pendingGroup = $('#lab-pending');
  const instruction = $('#workspace-instruction');
  const count = $('#segment-count');
  const spacing = $('#bulb-spacing');
  const spacingValue = $('#spacing-value');
  const crosshair = $('#keyboard-crosshair');
  const dialog = $('#send-idea-dialog');
  let imageUrl = null;
  let segments = [];
  let pending = null;
  let style = 'warm';
  let zoom = 100;
  let keyboardPoint = { x: .5, y: .5 };

  const names = { warm: 'Warm white', classic: 'Classic Christmas', colour: 'Colourful' };
  function palette(index) {
    if (style === 'warm') return '#ffe2a1';
    if (style === 'classic') return index % 2 ? '#22d259' : '#f32735';
    return ['#f32735', '#f7cc49', '#22d259', '#4e9dff'][index % 4];
  }
  function svgElement(tag, attributes) {
    const el = document.createElementNS(ns, tag);
    Object.entries(attributes).forEach(([key, value]) => el.setAttribute(key, String(value)));
    return el;
  }
  function updateControls() {
    const hasPhoto = !image.hidden;
    const hasLines = segments.length > 0;
    $('#lab-undo').disabled = !pending && !hasLines;
    $('#lab-reset').disabled = !pending && !hasLines;
    $('#lab-save').disabled = !hasPhoto || !hasLines;
    $('#lab-send').disabled = !hasPhoto || !hasLines;
    $('#zoom-out').disabled = !hasPhoto || zoom <= 100;
    $('#zoom-in').disabled = !hasPhoto || zoom >= 200;
    $('#zoom-value').textContent = `${zoom}%`;
    count.textContent = `${segments.length} segment${segments.length === 1 ? '' : 's'}`;
    instruction.textContent = !hasPhoto ? 'Choose a photo to begin. Then tap one end of a roofline, and tap its other end.' : pending ? 'First point set. Tap the other end of this roofline segment.' : 'Tap one end of a roofline, then tap its other end. Add as many segments as you like.';
    const labels = { 2: 'Closer', 3: 'Close', 4: 'Regular', 5: 'Regular', 6: 'Wide', 7: 'Wider', 8: 'Widest' };
    spacingValue.textContent = labels[spacing.value];
  }
  function drawBulbs(group, a, b, onBulb) {
    const length = Math.hypot(b.x - a.x, b.y - a.y);
    const step = image.naturalWidth * Number(spacing.value) / 100;
    const bulbs = Math.min(140, Math.max(2, Math.round(length / step)));
    for (let i = 0; i <= bulbs; i++) {
      const t = i / bulbs;
      const x = a.x + (b.x - a.x) * t;
      const y = a.y + (b.y - a.y) * t;
      const colour = palette(i);
      if (onBulb) onBulb({ x, y, colour, radius: Math.max(5, image.naturalWidth * .005) });
      else {
        const bulb = svgElement('circle', { cx: x, cy: y, r: Math.max(5, image.naturalWidth * .005), fill: colour, class: 'light-bulb' });
        bulb.style.color = colour;
        group.appendChild(bulb);
      }
    }
  }
  function render() {
    linesGroup.replaceChildren(); pendingGroup.replaceChildren();
    if (image.hidden) { updateControls(); return; }
    const w = image.naturalWidth;
    for (const segment of segments) {
      linesGroup.appendChild(svgElement('line', { x1: segment.a.x, y1: segment.a.y, x2: segment.b.x, y2: segment.b.y, class: 'light-wire' }));
      drawBulbs(linesGroup, segment.a, segment.b);
      [segment.a, segment.b].forEach(point => linesGroup.appendChild(svgElement('circle', { cx: point.x, cy: point.y, r: Math.max(12, w * .012), class: 'endpoint' })));
    }
    if (pending) pendingGroup.appendChild(svgElement('circle', { cx: pending.x, cy: pending.y, r: Math.max(15, w * .014), class: 'pending-ring' }));
    updateControls();
  }
  function addPoint(point) {
    if (image.hidden) return;
    if (!pending) pending = point;
    else {
      if (Math.hypot(point.x - pending.x, point.y - pending.y) < image.naturalWidth * .015) return;
      segments.push({ a: pending, b: point });
      pending = null;
    }
    render();
  }
  stage.addEventListener('click', event => {
    if (image.hidden) return;
    const rect = stage.getBoundingClientRect();
    const point = { x: Math.max(0, Math.min(image.naturalWidth, (event.clientX - rect.left) / rect.width * image.naturalWidth)), y: Math.max(0, Math.min(image.naturalHeight, (event.clientY - rect.top) / rect.height * image.naturalHeight)) };
    addPoint(point);
  });
  stage.addEventListener('keydown', event => {
    if (image.hidden) return;
    const step = event.shiftKey ? .05 : .018;
    if (event.key === 'ArrowLeft') keyboardPoint.x = Math.max(0, keyboardPoint.x - step);
    else if (event.key === 'ArrowRight') keyboardPoint.x = Math.min(1, keyboardPoint.x + step);
    else if (event.key === 'ArrowUp') keyboardPoint.y = Math.max(0, keyboardPoint.y - step);
    else if (event.key === 'ArrowDown') keyboardPoint.y = Math.min(1, keyboardPoint.y + step);
    else if (event.key === 'Enter' || event.key === ' ') addPoint({ x: keyboardPoint.x * image.naturalWidth, y: keyboardPoint.y * image.naturalHeight });
    else if (event.key === 'Escape') { pending = null; render(); }
    else return;
    event.preventDefault();
    crosshair.hidden = false;
    crosshair.style.left = `${keyboardPoint.x * 100}%`;
    crosshair.style.top = `${keyboardPoint.y * 100}%`;
  });
  stage.addEventListener('pointerdown', () => { crosshair.hidden = true; });
  photoInput.addEventListener('change', () => {
    const file = photoInput.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { $('#file-name').textContent = 'Choose an image file.'; return; }
    if (file.size > 25 * 1024 * 1024) { $('#file-name').textContent = 'Choose an image smaller than 25 MB.'; return; }
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    imageUrl = URL.createObjectURL(file);
    image.onload = () => {
      stage.style.aspectRatio = `${image.naturalWidth} / ${image.naturalHeight}`;
      stage.style.minHeight = '0';
      svg.setAttribute('viewBox', `0 0 ${image.naturalWidth} ${image.naturalHeight}`);
      image.hidden = false; placeholder.hidden = true;
      segments = []; pending = null; zoom = 100; stage.style.width = '100%';
      $('#file-name').textContent = file.name;
      render();
    };
    image.onerror = () => { $('#file-name').textContent = 'This image could not be opened. Try a JPG or PNG.'; };
    image.src = imageUrl;
  });
  $$('.lab-style').forEach(button => button.addEventListener('click', () => {
    style = button.dataset.style;
    $$('.lab-style').forEach(other => { const active = other === button; other.classList.toggle('active', active); other.setAttribute('aria-pressed', String(active)); });
    render();
  }));
  spacing.addEventListener('input', render);
  $('#lab-undo').addEventListener('click', () => { if (pending) pending = null; else segments.pop(); render(); });
  $('#lab-reset').addEventListener('click', () => { segments = []; pending = null; render(); });
  function changeZoom(delta) {
    zoom = Math.min(200, Math.max(100, zoom + delta));
    stage.style.width = `${zoom}%`;
    updateControls();
  }
  $('#zoom-out').addEventListener('click', () => changeZoom(-25));
  $('#zoom-in').addEventListener('click', () => changeZoom(25));
  function conceptCanvas(maxSide) {
    const scale = Math.min(1, maxSide / Math.max(image.naturalWidth, image.naturalHeight));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(image.naturalWidth * scale);
    canvas.height = Math.round(image.naturalHeight * scale);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    for (const segment of segments) {
      ctx.beginPath(); ctx.moveTo(segment.a.x * scale, segment.a.y * scale); ctx.lineTo(segment.b.x * scale, segment.b.y * scale);
      ctx.lineWidth = Math.max(1, image.naturalWidth * .0015 * scale); ctx.strokeStyle = '#172319'; ctx.stroke();
      drawBulbs(null, segment.a, segment.b, bulb => {
        const x = bulb.x * scale, y = bulb.y * scale, radius = bulb.radius * scale;
        ctx.shadowBlur = Math.max(8, radius * 3); ctx.shadowColor = bulb.colour;
        ctx.beginPath(); ctx.arc(x, y, Math.max(2, radius), 0, Math.PI * 2); ctx.fillStyle = bulb.colour; ctx.fill();
        ctx.shadowBlur = 0;
      });
    }
    return canvas;
  }
  $('#lab-save').addEventListener('click', () => {
    if (image.hidden || !segments.length) return;
    const canvas = conceptCanvas(1800);
    canvas.toBlob(blob => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a'); link.href = url; link.download = 'outline-light-lab-concept.png';
      document.body.appendChild(link); link.click(); link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1500);
    }, 'image/png');
  });
  $('#lab-send').addEventListener('click', () => { if (segments.length) dialog.showModal(); });
  $('#send-idea-cancel').addEventListener('click', () => dialog.close());
  updateControls();
})();
