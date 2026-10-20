const SETTINGS = {
  strength: 0.065,
  zoneStart: 0.65,
  curve: 1.75,
  scrollBoost: 0.065,
  scrollLag: 5,
  verticalBend: 5,
  edgeReach: 0.29,
  edgeFalloff: 1.25,
  bottomNarrowing: 0.07,
  narrowStart: 0.82,
  narrowSmooth: 1,
};

const vertexSource = `
  precision highp float;
  attribute vec2 aPosition;
  attribute vec2 aUv;
  uniform vec2 uViewport;
  uniform vec4 uRect;
  uniform float uStrength;
  uniform float uZoneStart;
  uniform float uCurve;
  uniform float uVelocity;
  uniform float uScrollBoost;
  uniform float uScrollLag;
  uniform float uVerticalBend;
  uniform float uEdgeReach;
  uniform float uEdgeFalloff;
  uniform float uBottomNarrowing;
  uniform float uNarrowStart;
  uniform float uNarrowSmooth;
  uniform float uAppear;
  varying vec2 vUv;
  varying vec2 vLocalPx;
  varying float vViewportY;
  varying float vEdge;
  varying float vDistortion;

  float smootherstep(float value) {
    float t = clamp(value, 0.0, 1.0);
    return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
  }

  void main() {
    vec2 screen = uRect.xy + aPosition * uRect.zw;
    screen.y += 25.0 * (1.0 - uAppear);

    float vy = clamp(screen.y / max(uViewport.y, 1.0), 0.0, 1.0);
    float zone = pow(smoothstep(uZoneStart, 1.0, vy), uCurve);
    float ns = clamp(uNarrowStart, uZoneStart + 0.001, 0.995);
    float taperT = clamp((vy - ns) / max(1.0 - ns, 0.001), 0.0, 1.0);
    float taper = smootherstep(pow(taperT, mix(1.25, 2.6, uNarrowSmooth)));
    float dz = zone - taper * uBottomNarrowing;

    float xc = screen.x - uViewport.x * 0.5;
    float cx = clamp(screen.x, 0.0, uViewport.x);
    float edgeDist = min(cx, uViewport.x - cx);
    float edge = pow(
      smoothstep(0.0, 1.0, clamp(1.0 - edgeDist / max(uEdgeReach * uViewport.x, 1.0), 0.0, 1.0)),
      uEdgeFalloff
    );

    screen.x += xc * dz * (uStrength + abs(uVelocity) * uScrollBoost) * edge;
    screen.y += dz * edge * uVelocity * uScrollLag;
    screen.y += dz * edge * abs(xc / max(uViewport.x * 0.5, 1.0)) * uVerticalBend;

    vec2 clip = vec2(
      screen.x / uViewport.x * 2.0 - 1.0,
      1.0 - screen.y / uViewport.y * 2.0
    );
    gl_Position = vec4(clip, 0.0, 1.0);
    vUv = aUv;
    vLocalPx = aPosition * uRect.zw;
    vViewportY = vy;
    vEdge = edge;
    vDistortion = dz;
  }
`;

const fragmentSource = `
  precision highp float;
  uniform sampler2D uTexture;
  uniform vec2 uImageSize;
  uniform vec2 uBoxSize;
  uniform float uRadius;
  uniform float uOpacity;
  uniform float uHoverScale;
  varying vec2 vUv;
  varying vec2 vLocalPx;
  varying float vViewportY;
  varying float vEdge;
  varying float vDistortion;

  float roundedRectMask(vec2 point, vec2 size, float radius) {
    float safeRadius = min(radius, min(size.x, size.y) * 0.5);
    vec2 halfSize = size * 0.5;
    vec2 q = abs(point - halfSize) - (halfSize - vec2(safeRadius));
    float distanceToEdge = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - safeRadius;
    return 1.0 - smoothstep(-0.75, 0.75, distanceToEdge);
  }

  void main() {
    vec2 uv = vec2(0.5) + (vUv - vec2(0.5)) / max(uHoverScale, 1.0);
    float boxAspect = uBoxSize.x / max(uBoxSize.y, 1.0);
    float imageAspect = uImageSize.x / max(uImageSize.y, 1.0);
    vec2 visibleFraction = vec2(1.0);
    if (imageAspect > boxAspect) {
      visibleFraction.x = boxAspect / imageAspect;
    } else {
      visibleFraction.y = imageAspect / boxAspect;
    }
    uv = uv * visibleFraction + (vec2(1.0) - visibleFraction) * 0.5;

    vec4 pixel = texture2D(uTexture, uv);
    float glossPosition = (vViewportY - 0.82) / 0.38;
    float glossBand = smoothstep(0.0, 0.25, glossPosition) *
      (1.0 - smoothstep(0.75, 1.0, glossPosition));
    float gloss = glossBand * smoothstep(0.0, 0.2, vDistortion) * vEdge * 0.03;
    pixel.rgb = mix(pixel.rgb, vec3(1.0), gloss);
    pixel.a *= roundedRectMask(vLocalPx, uBoxSize, uRadius) * uOpacity;
    if (pixel.a <= 0.001) discard;
    gl_FragColor = pixel;
  }
`;

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function cubicCoordinate(t, p1, p2) {
  const inverse = 1 - t;
  return 3 * inverse * inverse * t * p1 + 3 * inverse * t * t * p2 + t * t * t;
}

function cubicDerivative(t, p1, p2) {
  const inverse = 1 - t;
  return 3 * inverse * inverse * p1 + 6 * inverse * t * (p2 - p1) + 3 * t * t * (1 - p2);
}

function solveBezier(x, x1, y1, x2, y2) {
  let t = x;
  for (let i = 0; i < 8; i += 1) {
    const error = cubicCoordinate(t, x1, x2) - x;
    const derivative = cubicDerivative(t, x1, x2);
    if (Math.abs(error) < 1e-6 || Math.abs(derivative) < 1e-6) break;
    t = clamp(t - error / derivative, 0, 1);
  }
  let low = 0;
  let high = 1;
  for (let i = 0; i < 12; i += 1) {
    const current = cubicCoordinate(t, x1, x2);
    if (Math.abs(current - x) < 1e-6) break;
    if (current < x) low = t;
    else high = t;
    t = (low + high) * 0.5;
  }
  return cubicCoordinate(t, y1, y2);
}

function compileShader(gl, type, source) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createProgram(gl) {
  const vertex = compileShader(gl, gl.VERTEX_SHADER, vertexSource);
  const fragment = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
  if (!vertex || !fragment) {
    if (vertex) gl.deleteShader(vertex);
    if (fragment) gl.deleteShader(fragment);
    return null;
  }
  const program = gl.createProgram();
  if (!program) {
    gl.deleteShader(vertex);
    gl.deleteShader(fragment);
    return null;
  }
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program);
    return null;
  }
  return program;
}

function createMesh() {
  const columns = 12;
  const rows = 60;
  const positions = [];
  const uvs = [];
  const indices = [];
  for (let y = 0; y <= rows; y += 1) {
    for (let x = 0; x <= columns; x += 1) {
      const px = x / columns;
      const py = y / rows;
      positions.push(px, py);
      uvs.push(px, py);
      if (x < columns && y < rows) {
        const i = y * (columns + 1) + x;
        indices.push(i, i + columns + 1, i + 1, i + 1, i + columns + 1, i + columns + 2);
      }
    }
  }
  return {
    positions: new Float32Array(positions),
    uvs: new Float32Array(uvs),
    indices: new Uint16Array(indices),
  };
}

export function createViewportDistortion({ root, items }) {
  const section = root ?? items[0]?.media.closest('#project-page');
  if (!section) return null;

  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  Object.assign(canvas.style, {
    position: 'fixed',
    inset: '0',
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    zIndex: '1',
  });
  const gl = canvas.getContext('webgl', {
    alpha: true,
    premultipliedAlpha: false,
    antialias: true,
  });
  if (!gl) return null;

  const program = createProgram(gl);
  if (!program) return null;

  section.appendChild(canvas);
  section.classList.add('gl');
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  gl.disable(gl.DEPTH_TEST);

  const mesh = createMesh();
  const positionBuffer = gl.createBuffer();
  const uvBuffer = gl.createBuffer();
  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, mesh.positions, gl.STATIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, mesh.uvs, gl.STATIC_DRAW);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, mesh.indices, gl.STATIC_DRAW);

  const locations = {
    position: gl.getAttribLocation(program, 'aPosition'),
    uv: gl.getAttribLocation(program, 'aUv'),
  };
  const uniforms = {};
  const uniformNames = [
    'uViewport',
    'uRect',
    'uStrength',
    'uZoneStart',
    'uCurve',
    'uVelocity',
    'uScrollBoost',
    'uScrollLag',
    'uVerticalBend',
    'uEdgeReach',
    'uEdgeFalloff',
    'uBottomNarrowing',
    'uNarrowStart',
    'uNarrowSmooth',
    'uAppear',
    'uTexture',
    'uImageSize',
    'uBoxSize',
    'uRadius',
    'uOpacity',
    'uHoverScale',
  ];
  for (const name of uniformNames) uniforms[name] = gl.getUniformLocation(program, name);

  const records = items.map((item) => ({
    ...item,
    texture: null,
    ready: false,
    hoverFrom: 0,
    hoverTo: 0,
    hoverStart: 0,
    hoverDuration: 650,
  }));
  let disposed = false;
  let contextLost = false;
  let frame = 0;
  let lastFrame = null;
  let lastY = window.scrollY;
  let velocity = 0;

  function viewportSize() {
    return {
      width: Math.max(1, canvas.clientWidth || document.documentElement.clientWidth),
      height: Math.max(1, canvas.clientHeight || document.documentElement.clientHeight),
    };
  }

  function resize() {
    const { width, height } = viewportSize();
    const dpr = Math.max(
      0.8,
      Math.min(window.devicePixelRatio || 1, 1.35, Math.sqrt(2.6e6 / (width * height)))
    );
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    gl.viewport(0, 0, canvas.width, canvas.height);
  }

  function setHover(record, target) {
    const now = performance.now();
    const elapsed = clamp((now - record.hoverStart) / record.hoverDuration, 0, 1);
    const progress = solveBezier(elapsed, 0.121, 1.054, 0.525, 1);
    record.hoverFrom = record.hoverFrom + (record.hoverTo - record.hoverFrom) * progress;
    record.hoverTo = target;
    record.hoverStart = now;
    record.hoverDuration = 650;
  }

  for (const record of records) {
    if (!record.hoverTarget) continue;
    record.onEnter = () => setHover(record, 1);
    record.onLeave = () => setHover(record, 0);
    record.hoverTarget.addEventListener('pointerenter', record.onEnter);
    record.hoverTarget.addEventListener('pointerleave', record.onLeave);
  }

  async function loadTexture(record) {
    try {
      await record.img.decode();
      if (disposed || contextLost) return;
      const texture = gl.createTexture();
      if (!texture) return;
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, record.img);
      record.texture = texture;
      record.ready = true;
      record.media.classList.add('gl-ready');
    } catch {
      record.ready = false;
    }
  }

  const textureLoads = records.map(loadTexture);

  function hoverProgress(record, now) {
    const elapsed = clamp((now - record.hoverStart) / record.hoverDuration, 0, 1);
    const eased = solveBezier(elapsed, 0.121, 1.054, 0.525, 1);
    if (elapsed >= 1) record.hoverFrom = record.hoverTo;
    return record.hoverFrom + (record.hoverTo - record.hoverFrom) * eased;
  }

  function draw(now) {
    frame = 0;
    if (disposed || contextLost) return;
    const dt = lastFrame === null ? 0 : now - lastFrame;
    const scrollY = window.scrollY;
    let target = 0;
    if (dt <= 0 || dt > 120 || document.hidden) {
      velocity = 0;
    } else {
      target = clamp((scrollY - lastY) / dt / 1.8, -1, 1);
      velocity += (target - velocity) * (1 - Math.exp(-Math.min(dt, 50) / (Math.abs(target) > Math.abs(velocity) ? 45 : 105)));
      if (Math.abs(target) < 0.002 && Math.abs(velocity) < 0.002) velocity = 0;
    }
    lastY = scrollY;
    lastFrame = now;

    const { width, height } = viewportSize();
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.enableVertexAttribArray(locations.position);
    gl.vertexAttribPointer(locations.position, 2, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
    gl.enableVertexAttribArray(locations.uv);
    gl.vertexAttribPointer(locations.uv, 2, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.uniform2f(uniforms.uViewport, width, height);
    gl.uniform1f(uniforms.uStrength, SETTINGS.strength);
    gl.uniform1f(uniforms.uZoneStart, SETTINGS.zoneStart);
    gl.uniform1f(uniforms.uCurve, SETTINGS.curve);
    gl.uniform1f(uniforms.uVelocity, velocity);
    gl.uniform1f(uniforms.uScrollBoost, SETTINGS.scrollBoost);
    gl.uniform1f(uniforms.uScrollLag, SETTINGS.scrollLag);
    gl.uniform1f(uniforms.uVerticalBend, SETTINGS.verticalBend);
    gl.uniform1f(uniforms.uEdgeReach, SETTINGS.edgeReach);
    gl.uniform1f(uniforms.uEdgeFalloff, SETTINGS.edgeFalloff);
    gl.uniform1f(uniforms.uBottomNarrowing, SETTINGS.bottomNarrowing);
    gl.uniform1f(uniforms.uNarrowStart, SETTINGS.narrowStart);
    gl.uniform1f(uniforms.uNarrowSmooth, SETTINGS.narrowSmooth);
    gl.uniform1i(uniforms.uTexture, 0);

    for (const record of records) {
      if (!record.ready || !record.texture) continue;
      const rect = record.media.getBoundingClientRect();
      if (
        rect.bottom < -160 ||
        rect.top > height + 160 ||
        rect.right < -160 ||
        rect.left > width + 160
      ) {
        continue;
      }
      const appearAt = Number(record.media.dataset.appearAt);
      const appearProgress = Number.isFinite(appearAt) ? clamp((now - appearAt) / 500, 0, 1) : 0;
      const appear = 1 - Math.pow(1 - appearProgress, 3);
      const hover = record.hoverTarget ? hoverProgress(record, now) : 0;
      gl.uniform4f(uniforms.uRect, rect.left, rect.top, rect.width, rect.height);
      gl.uniform1f(uniforms.uAppear, appear);
      gl.uniform1f(uniforms.uOpacity, appear);
      gl.uniform2f(uniforms.uImageSize, record.img.naturalWidth, record.img.naturalHeight);
      gl.uniform2f(uniforms.uBoxSize, rect.width, rect.height);
      gl.uniform1f(uniforms.uRadius, 7);
      gl.uniform1f(uniforms.uHoverScale, 1 + 0.06 * hover);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, record.texture);
      gl.drawElements(gl.TRIANGLES, mesh.indices.length, gl.UNSIGNED_SHORT, 0);
    }
    frame = requestAnimationFrame(draw);
  }

  function start() {
    if (disposed || contextLost || frame) return;
    lastFrame = null;
    lastY = window.scrollY;
    frame = requestAnimationFrame(draw);
  }

  function stop() {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    lastFrame = null;
    velocity = 0;
    lastY = window.scrollY;
  }

  const visibleRecords = new Set();
  const visibilityObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) visibleRecords.add(entry.target);
        else visibleRecords.delete(entry.target);
      }
      if (visibleRecords.size) start();
      else stop();
    },
    { rootMargin: '25% 0px' }
  );
  records.forEach((record) => visibilityObserver.observe(record.media));

  function onContextLost(event) {
    event.preventDefault();
    contextLost = true;
    section.classList.remove('gl');
    for (const record of records) record.media.classList.remove('gl-ready');
    stop();
    canvas.remove();
  }

  canvas.addEventListener('webglcontextlost', onContextLost, false);
  window.addEventListener('resize', resize);
  document.addEventListener('visibilitychange', onVisibilityChange);

  function onVisibilityChange() {
    if (document.hidden) velocity = 0;
  }

  resize();

  return {
    dispose() {
      if (disposed) return;
      disposed = true;
      stop();
      visibilityObserver.disconnect();
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      canvas.removeEventListener('webglcontextlost', onContextLost, false);
      for (const record of records) {
        if (record.hoverTarget) {
          record.hoverTarget.removeEventListener('pointerenter', record.onEnter);
          record.hoverTarget.removeEventListener('pointerleave', record.onLeave);
        }
        record.media.classList.remove('gl-ready');
        if (record.texture && !contextLost) gl.deleteTexture(record.texture);
      }
      void Promise.all(textureLoads);
      if (!contextLost) {
        gl.deleteBuffer(positionBuffer);
        gl.deleteBuffer(uvBuffer);
        gl.deleteBuffer(indexBuffer);
        gl.deleteProgram(program);
      }
      section.classList.remove('gl');
      canvas.remove();
    },
  };
}
