import {
  OrthographicCamera as t,
  SRGBColorSpace as n,
  Scene as r,
  MeshBasicMaterial as i,
  CanvasTexture as a,
  PlaneGeometry as o,
  WebGLRenderer as s,
  Mesh as l,
} from "three";
import { createFilterPipeline as c } from "./filter-pipeline.js";
import { badgeConfig as e } from "$lib/config/badge.js";
function u(u) {
  let d = new s({ alpha: !0, antialias: !1 });
  d.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  let f = new r(),
    p = new t(-1, 1, 1, -1, 0, 2);
  p.position.z = 1;
  let m = new o(2, 2),
    h = new i({ transparent: !0 });
  f.add(new l(m, h));
  let g = c(d, f, p),
    _ = [];
  try {
    for (let { source: t, target: r } of u) {
      let i = t.getBoundingClientRect(),
        o = Math.ceil(i.width),
        s = Math.ceil(i.height);
      if (!o || !s) continue;
      let c = document.createElement(`canvas`),
        l = d.getPixelRatio();
      ((c.width = Math.ceil(o * l)), (c.height = Math.ceil(s * l)));
      let u = c.getContext(`2d`);
      (u.scale(l, l),
        (u.textBaseline = `alphabetic`),
        (u.fillStyle = `#080808`));
      for (let e of t.querySelectorAll(`[data-line]`)) {
        let t = getComputedStyle(e);
        (e.getBoundingClientRect(),
          (u.globalAlpha = Number(t.opacity)),
          (u.font = `${t.fontWeight} ${t.fontSize} Kyoto`),
          (u.letterSpacing = t.letterSpacing));
        let n = document.createTreeWalker(e, NodeFilter.SHOW_TEXT),
          r = new Map(),
          a;
        for (; (a = n.nextNode());)
          for (let e = 0; e < a.textContent.length; e++) {
            let t = document.createRange();
            (t.setStart(a, e), t.setEnd(a, e + 1));
            let n = t.getBoundingClientRect(),
              i = Math.round(n.top * 10);
            (r.has(i) ||
              r.set(i, { text: ``, x: n.left, y: n.top, height: n.height }),
              (r.get(i).text += a.textContent[e]));
          }
        for (let e of r.values()) {
          let n = u.measureText(e.text),
            r = n.fontBoundingBoxAscent ?? parseFloat(t.fontSize) * 0.8,
            a = n.fontBoundingBoxDescent ?? parseFloat(t.fontSize) * 0.2;
          u.fillText(
            e.text,
            e.x - i.left,
            e.y - i.top + (e.height - r - a) / 2 + r,
          );
        }
      }
      let f = new a(c);
      ((f.colorSpace = n),
        (h.map = f),
        (h.needsUpdate = !0),
        d.setSize(o, s, !1),
        g.resize(o, s));
      let p = [];
      for (let t = 0; t <= 16; t++) {
        let n = t / 16,
          r = { ...e.plotter, strokeWidth: 1 + n * 3.5, strength: n };
        (g.render(e.filters, r), t === 0 && g.render(e.filters, r));
        let i = document.createElement(`canvas`);
        ((i.width = d.domElement.width),
          (i.height = d.domElement.height),
          i.getContext(`2d`).drawImage(d.domElement, 0, 0),
          p.push(i));
      }
      ((r.width = p[0].width),
        (r.height = p[0].height),
        _.push({ target: r, frames: p, progress: 0, destination: 0 }),
        r.getContext(`2d`).drawImage(p[0], 0, 0),
        f.dispose());
    }
  } finally {
    (g.dispose(), m.dispose(), h.dispose(), d.dispose(), d.forceContextLoss());
  }
  let v = 0,
    y = 0,
    b = window.matchMedia(`(prefers-reduced-motion: reduce)`);
  function x(e) {
    let t = e.target.getContext(`2d`),
      n = e.progress * 16,
      r = Math.floor(n),
      i = Math.min(16, r + 1);
    (t.clearRect(0, 0, e.target.width, e.target.height),
      (t.globalCompositeOperation = `lighter`),
      (t.globalAlpha = 1 - (n - r)),
      t.drawImage(e.frames[r], 0, 0),
      (t.globalAlpha = n - r),
      t.drawImage(e.frames[i], 0, 0),
      (t.globalAlpha = 1),
      (t.globalCompositeOperation = `source-over`));
  }
  function S(e) {
    v = 0;
    let t = y ? (e - y) / 150 : 0;
    y = e;
    let n = !1;
    for (let e of _) {
      let r = e.destination - e.progress;
      ((e.progress += Math.sign(r) * Math.min(Math.abs(r), t)),
        x(e),
        (n ||= e.progress !== e.destination));
    }
    n ? (v = requestAnimationFrame(S)) : (y = 0);
  }
  return {
    setActive(e) {
      (_.forEach((t, n) => {
        ((t.destination = +(e !== null && e !== n)),
          b.matches && ((t.progress = t.destination), x(t)));
      }),
        !b.matches && !v && (v = requestAnimationFrame(S)));
    },
    dispose() {
      (cancelAnimationFrame(v),
        _.forEach((e) =>
          e.frames.forEach((e) => {
            e.width = e.height = 0;
          }),
        ));
    },
  };
}
export { u as renderPlotterLabels };
