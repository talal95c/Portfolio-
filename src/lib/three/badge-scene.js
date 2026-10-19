// Ported from samfcheng.com production bundle (chunk C41mHjnf.js).
import {
  Plane as e,
  ShapeGeometry as t,
  RepeatWrapping as n,
  Vector2 as r,
  TextureLoader as i,
  SRGBColorSpace as a,
  Vector3 as o,
  Scene as s,
  Quaternion as c,
  Path as l,
  Raycaster as u,
  ShadowMaterial as d,
  MeshBasicMaterial as f,
  MeshStandardMaterial as p,
  TorusGeometry as m,
  SphereGeometry as h,
  TubeGeometry as g,
  Group as _,
  BoxGeometry as ee,
  MathUtils as v,
  CanvasTexture as y,
  CubicBezierCurve3 as b,
  ExtrudeGeometry as te,
  DirectionalLight as ne,
  AmbientLight as re,
  PlaneGeometry as ie,
  PerspectiveCamera as ae,
  CatmullRomCurve3 as oe,
  CylinderGeometry as se,
  PMREMGenerator as ce,
  BufferAttribute as le,
  CurvePath as ue,
  WebGLRenderer as de,
  BufferGeometry as fe,
  Color as me,
  MeshPhysicalMaterial as he,
  Mesh as ge,
  Shape as _e,
} from "three";
import { createFilterPipeline as pe } from "./filter-pipeline.js";
import Vr from "@dimforge/rapier3d-compat";
import { RoundedBoxGeometry as ve } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { RoomEnvironment as ye } from "three/examples/jsm/environments/RoomEnvironment.js";
var Hr = 65542,
  Ur = 131077,
  Wr = 524292,
  Gr = 262155,
  Z = (e = 0, t = 0, n = 0) => ({ x: e, y: t, z: n }),
  Kr = 0.15;
function qr(e, t, n, r) {
  if (n === 0) return 0;
  let i = -n * e * (1 + r * (Math.abs(e) / Math.PI) ** 2);
  return Math.max(-18, Math.min(18, i - 0.65 * Math.sqrt(n) * t));
}
function Jr(e) {
  let t = new Vr.World(Z(0, -9.81, 0));
  ((t.timestep = 1 / 120), (t.numSolverIterations = 32));
  let n = [],
    r = t.createCollider(
      Vr.ColliderDesc.cuboid(50, 50, 0.2)
        .setTranslation(0, 0, -1.2)
        .setCollisionGroups(Gr)
        .setFriction(0.4),
    );
  function i(e, r, i, a = 0.5, o = Wr) {
    let s = t.createRigidBody(
        Vr.RigidBodyDesc.dynamic()
          .setTranslation(e.x, e.y, e.z)
          .setLinearDamping(a)
          .setAngularDamping(0.6)
          .setCcdEnabled(!0)
          .setCanSleep(!1),
      ),
      c = t.createCollider(
        Vr.ColliderDesc.cuboid(...r)
          .setMass(i)
          .setCollisionGroups(o)
          .setFriction(0.45)
          .setRestitution(0),
        s,
      );
    return (n.push({ body: s, position: e }), { body: s, collider: c });
  }
  let { body: a, collider: s } = i(
      Z(0, Kr, 0),
      [1.4, 2.22, 0.105],
      e.mass,
      0.5,
      Hr,
    ),
    l = i(Z(0, 2.35, 0.03), [0.21, 0.33, 0.13], 0.09).body,
    u = i(Z(0, 2.79, 0.03), [0.22, 0.21, 0.09], 0.055).body,
    d = i(Z(0, 3.08, 0.03), [0.1, 0.22, 0.08], 0.045, 0.5, Ur).body,
    f = t.createImpulseJoint(
      Vr.JointData.spherical(Z(0, 2.025, 0.03), Z(0, -0.175, 0)),
      a,
      l,
      !0,
    ),
    p = t.createImpulseJoint(
      Vr.JointData.revolute(Z(0, 0.26, 0), Z(0, -0.18, 0), Z(0, 1, 0)),
      l,
      u,
      !0,
    ),
    m = t.createImpulseJoint(
      Vr.JointData.revolute(Z(0, 0.13, 0), Z(0, -0.16, 0), Z(1, 0, 0)),
      u,
      d,
      !0,
    );
  m.setLimits(-1.15, 1.15);
  let h = [];
  for (let e of [-1, 1]) {
    let n = Z(e * 2.6, 9.5, -0.25),
      r = Z(0, 0.04, e * 0.061),
      a = Z(e * 0.015, 0.04, 0),
      o = Z(a.x, 3.08 + a.y, 0.03),
      s = o.x - n.x,
      c = o.y - n.y,
      l = o.z - n.z,
      u = Math.hypot(s, c, l) / 12,
      f = t.createRigidBody(
        Vr.RigidBodyDesc.fixed().setTranslation(n.x, n.y, n.z),
      ),
      p = [],
      m = [];
    for (let e = 1; e <= 12; e++) {
      let r = i(
          Z(n.x + (s * e) / 12, n.y + (c * e) / 12, n.z + (l * e) / 12),
          [0.025, 0.025, 0.018],
          0.0125,
          1.6,
          Ur,
        ),
        a = r.body;
      (a.setEnabledRotations(!1, !1, !1, !0),
        r.collider.setShape(new Vr.Capsule(u / 2, 0.11)),
        m.push(r.collider),
        t.createImpulseJoint(
          Vr.JointData.rope(u, Z(), Z()),
          p.at(-1) || f,
          a,
          !0,
        ),
        p.push(a));
    }
    (t.createImpulseJoint(Vr.JointData.spherical(Z(), a), p.at(-1), d, !0),
      h.push({
        anchor: f,
        anchorPosition: n,
        links: p,
        attachment: r,
        segment: u,
        segments: m,
      }));
  }
  let g = new o(),
    _ = new c(),
    ee = new o(0, 1, 0);
  function v() {
    for (let e of h)
      e.links.forEach((t, n) => {
        let r = t.translation(),
          i = (n ? e.links[n - 1] : e.anchor).translation();
        (g.set(i.x - r.x, i.y - r.y, i.z - r.z),
          e.segments[n].setTranslationWrtParent(Z(g.x / 2, g.y / 2, g.z / 2)),
          g.lengthSq() > 1e-10 &&
            (_.setFromUnitVectors(ee, g.normalize()),
            e.segments[n].setRotationWrtParent(_)));
      });
  }
  v();
  let y = -1,
    b = e.mass,
    te = [];
  function ne(e, n = !1) {
    if (
      (v(),
      (t.gravity.y = -e.gravity),
      a.setLinearDamping(e.damping + (n ? 2 : 0)),
      a.setAngularDamping(e.damping + 0.2 + (n ? 2 : 0)),
      b !== e.mass &&
        ((b = e.mass), s.setMass(b), a.recomputeMassPropertiesFromColliders()),
      y !== e.strapStiffness)
    ) {
      ((y = e.strapStiffness),
        te.forEach((e) => t.removeImpulseJoint(e, !0)),
        (te.length = 0));
      for (let e of h) {
        let n = [e.anchor, ...e.links];
        for (let r of [1, 2, 3])
          for (let i = r; i < n.length; i++) {
            let a = y * (r === 1 ? 0.6 : r === 2 ? 1 : 0.45);
            te.push(
              t.createImpulseJoint(
                Vr.JointData.spring(
                  e.segment * r,
                  a,
                  1.4 * Math.sqrt(a * 0.0125),
                  Z(),
                  Z(),
                ),
                n[i - r],
                n[i],
                !0,
              ),
            );
          }
      }
    }
    function r(e, n, r, i, a) {
      let o = n.rotation(),
        s = 2 * (o.y * r.z - o.z * r.y),
        c = 2 * (o.z * r.x - o.x * r.z),
        l = 2 * (o.x * r.y - o.y * r.x),
        u = Z(
          r.x + o.w * s + o.y * l - o.z * c,
          r.y + o.w * c + o.z * s - o.x * l,
          r.z + o.w * l + o.x * c - o.y * s,
        ),
        d = e.angvel(),
        f = n.angvel(),
        p =
          -((d.x - f.x) * u.x + (d.y - f.y) * u.y + (d.z - f.z) * u.z) *
          a *
          (1 - Math.exp(-i * 10 * t.timestep));
      (e.applyTorqueImpulse(Z(u.x * p, u.y * p, u.z * p), !0),
        n.applyTorqueImpulse(Z(-u.x * p, -u.y * p, -u.z * p), !0));
    }
    (r(l, u, Z(0, 1, 0), e.swivelDamping, 369e-6),
      r(u, d, Z(1, 0, 0), 0.08 + e.swivelDamping * 0.4, 199e-6));
    let i = d.rotation(),
      o = Math.atan2(
        2 * (i.x * i.z + i.w * i.y),
        1 - 2 * (i.x * i.x + i.y * i.y),
      ),
      c = 0.001,
      f = 0.12,
      p = t.timestep,
      m =
        (-(2 * o + f * d.angvel().y) * p) / (1 + (f * p) / c + (2 * p * p) / c);
    d.applyTorqueImpulse(Z(0, m, 0), !0);
    let g = a.rotation(),
      _ = 2 * (g.x * g.z + g.w * g.y),
      ee = 1 - 2 * (g.x * g.x + g.y * g.y),
      ne = Math.atan2(_, ee);
    a.applyTorqueImpulse(
      Z(
        0,
        qr(ne, a.angvel().y, e.antiTwist, e.twistProgression) * t.timestep,
        0,
      ),
      !0,
    );
  }
  function re() {
    for (let { body: e, position: t } of n)
      (e.setTranslation(t, !0),
        e.setRotation({ x: 0, y: 0, z: 0, w: 1 }, !0),
        e.setLinvel(Z(), !0),
        e.setAngvel(Z(), !0),
        e.resetForces(!0),
        e.resetTorques(!0));
    v();
  }
  return (
    ne(e),
    {
      world: t,
      body: a,
      collider: s,
      wall: r,
      clasp: l,
      eye: u,
      yoke: d,
      straps: h,
      restY: Kr,
      update: ne,
      reset: re,
      badgeJoint: f,
      swivel: p,
      foldJoint: m,
    }
  );
}
var Yr = () => new o();
function Xr(e, t = 80, n = 0.085) {
  let r = new Float32Array((t + 1) * 13 * 3),
    i = r.slice(),
    a = new Float32Array((t + 1) * 13 * 2),
    o = [];
  for (let e = 0; e <= t; e++)
    for (let n = 0; n <= 12; n++) {
      let r = e * 13 + n;
      ((a[r * 2] = n / 12),
        (a[r * 2 + 1] = e / t),
        e < t && n < 12 && o.push(r, r + 1, r + 13, r + 1, r + 13 + 1, r + 13));
    }
  let s = new fe();
  (s.setAttribute(`position`, new le(r, 3)),
    s.setAttribute(`normal`, new le(i, 3)),
    s.setAttribute(`uv`, new le(a, 2)),
    s.setIndex(o));
  let l = new ge(s, e);
  ((l.castShadow = !0), (l.frustumCulled = !1));
  let u = Array.from({ length: t + 1 }, Yr),
    d = Array.from({ length: t + 1 }, Yr),
    f = Array.from({ length: t + 1 }, Yr),
    p = new c(),
    m = Yr(),
    h = Yr(),
    g = Yr(),
    _ = Yr(),
    ee = 0;
  function y(e, a, o = 1 / 60, c) {
    for (let n = 0; n <= t; n++)
      (e.getPoint(n / t, f[n]), e.getTangent(n / t, u[n]).normalize());
    if (c) {
      let e = !1;
      for (let t of f) e = c(t) || e;
      if (e)
        for (let e = 0; e <= t; e++)
          u[e]
            .copy(f[Math.min(t, e + 1)])
            .sub(f[Math.max(0, e - 1)])
            .normalize();
    }
    d[0].set(1, 0, 0).addScaledVector(u[0], -u[0].x).normalize();
    for (let e = 1; e <= t; e++)
      (p.setFromUnitVectors(u[e - 1], u[e]),
        d[e].copy(d[e - 1]).applyQuaternion(p),
        d[e].addScaledVector(u[e], -d[e].dot(u[e])).normalize());
    let l = g.copy(a).addScaledVector(u[t], -a.dot(u[t])).normalize(),
      y = Math.atan2(m.crossVectors(d[t], l).dot(u[t]), d[t].dot(l)),
      b = 0.5 * Math.atan2(Math.sin(2 * y), Math.cos(2 * y));
    ((ee += (b - ee) * (1 - Math.exp(-14 * o))), (y = ee));
    for (let e = 0; e <= t; e++) {
      (g.copy(d[e]).applyAxisAngle(u[e], y * v.smoothstep(e / t, 0, 1)),
        h.crossVectors(g, u[e]).normalize());
      let a = n,
        o = 0.012;
      for (let t = 0; t <= 12; t++) {
        let n = (t / 12) * Math.PI * 2,
          s = Math.cos(n),
          c = Math.sin(n),
          l = (e * 13 + t) * 3;
        (_.copy(f[e])
          .addScaledVector(g, s * a)
          .addScaledVector(h, c * o),
          _.toArray(r, l),
          _.copy(g)
            .multiplyScalar(s / a)
            .addScaledVector(h, c / o)
            .normalize()
            .toArray(i, l));
      }
    }
    ((s.attributes.position.needsUpdate = !0),
      (s.attributes.normal.needsUpdate = !0));
  }
  return {
    mesh: l,
    update: y,
    getTwist() {
      return ee;
    },
    reset() {
      ee = 0;
    },
  };
}
var Q = (e = 0, t = 0, n = 0) => new o(e, t, n);
function Zr(e, t) {
  let n = new _(),
    r = new _(),
    i = new _(),
    a = new _();
  ((a.rotation.y = Math.PI / 2), n.add(a));
  function o(e, t, n, r = Q()) {
    let i = new ge(e, t);
    return (i.position.copy(r), (i.castShadow = !0), n.add(i), i);
  }
  function s(t, n, r, i = a) {
    let s = n.clone().sub(t),
      c = o(
        new se(r, r, s.length(), 20),
        e,
        i,
        t.clone().add(n).multiplyScalar(0.5),
      );
    return (c.quaternion.setFromUnitVectors(Q(0, 1, 0), s.normalize()), c);
  }
  function c(t, n, r = a) {
    return o(new g(new oe(t), 64, n, 12, !1), e, r);
  }
  let l = new _e();
  (l.moveTo(-0.052, 0.245),
    l.lineTo(0.052, 0.245),
    l.bezierCurveTo(0.062, 0.17, 0.075, 0.06, 0.105, -0.09),
    l.quadraticCurveTo(0.075, -0.08, 0.04, -0.035),
    l.quadraticCurveTo(-0.025, 0.045, -0.11, 0.018),
    l.quadraticCurveTo(-0.07, 0.11, -0.052, 0.245));
  let u = new te(l, {
    depth: 0.047,
    bevelEnabled: !0,
    bevelSegments: 4,
    bevelSize: 0.012,
    bevelThickness: 0.012,
    curveSegments: 20,
  });
  (u.translate(0, 0, -0.0235), o(u, e, a));
  let d = new ue();
  (d.add(new b(Q(0.075, 0.015), Q(0.14, -0.1), Q(0.13, -0.3), Q(0, -0.32))),
    d.add(new b(Q(0, -0.32), Q(-0.15, -0.34), Q(-0.19, -0.2), Q(-0.15, -0.1))),
    o(new g(d, 80, 0.025, 16, !1), e, a));
  let f = new _();
  a.add(f);
  let v = new b(
      Q(-0.03, 0.069),
      Q(-0.09, 0.075),
      Q(-0.13, -0.05),
      Q(-0.15, -0.1),
    ),
    y = o(new g(v, 40, 0.024, 16, !1), e, f);
  ((y.scale.z = 0.75),
    c(
      [
        Q(0.073, 0.07, -0.01),
        Q(0.178, 0.015, -0.01),
        Q(0.182, -0.027, -0.01),
        Q(0.13, -0.047, -0.01),
      ],
      0.011,
    ));
  let ne = o(new se(0.028, 0.028, 0.075, 24), e, a, Q(-0.03, 0.069, 0));
  ne.rotation.x = Math.PI / 2;
  for (let t of [-1, 1])
    (o(new m(0.022, 0.0038, 8, 24), e, a, Q(-0.03, 0.069, t * 0.04)),
      (o(new h(0.012, 16, 10), e, a, Q(-0.03, 0.069, t * 0.04)).scale.z =
        0.25));
  (s(Q(0, 0.225, 0), Q(0, 0.285, 0), 0.042, n),
    o(new se(0.069, 0.058, 0.085, 32), e, r, Q(0, -0.146, 0)),
    o(new se(0.084, 0.084, 0.019, 32), e, r, Q(0, -0.115, 0)));
  let re = new oe(
    [
      Q(-0.115, 0.13),
      Q(-0.125, 0.04),
      Q(-0.115, -0.07),
      Q(0, -0.1),
      Q(0.115, -0.07),
      Q(0.125, 0.04),
      Q(0.115, 0.13),
    ],
    !1,
  );
  (o(new g(re, 80, 0.027, 12, !1), e, r),
    s(Q(-0.115, 0.13), Q(0.115, 0.13), 0.027, r));
  let ie = new p({ color: `#777d68`, roughness: 1 }),
    ae = new oe([
      Q(0, 0.04, 0.061),
      Q(0, -0.06, 0.061),
      Q(0, -0.16, 0.061),
      Q(0, -0.22, 0),
      Q(0, -0.16, -0.061),
      Q(0, -0.06, -0.061),
      Q(0, 0.04, -0.061),
    ]),
    ce = Xr(t, 64, 0.085);
  (ce.update(ae, Q(1, 0, 0), 1), i.add(ce.mesh));
  for (let e of [-1, 1])
    for (let t of [-0.04, 0])
      for (let n = 0; n < 6; n++)
        o(
          new ee(0.01, 0.003, 0.002),
          ie,
          i,
          Q(-0.06 + n * 0.024, t, e * 0.073),
        );
  return { clasp: n, eye: r, yoke: i };
}
var Qr = `/assets/badge2.png`,
  $ = (e = 0, t = 0, n = 0) => new o(e, t, n);
function $r(e, t, n) {
  let r = new _e(),
    i = -e / 2,
    a = -t / 2;
  return (
    r.moveTo(i + n, a),
    r.lineTo(i + e - n, a),
    r.quadraticCurveTo(i + e, a, i + e, a + n),
    r.lineTo(i + e, a + t - n),
    r.quadraticCurveTo(i + e, a + t, i + e - n, a + t),
    r.lineTo(i + n, a + t),
    r.quadraticCurveTo(i, a + t, i, a + t - n),
    r.lineTo(i, a + n),
    r.quadraticCurveTo(i, a, i + n, a),
    r
  );
}
function ei(e) {
  let t = document.createElement(`canvas`);
  t.width = t.height = 256;
  let r = t.getContext(`2d`),
    i = r.createImageData(256, 256),
    a = 23,
    o = () => (a = (a * 1664525 + 1013904223) >>> 0) / 4294967296;
  for (let t = 0; t < i.data.length; t += 4) {
    let n = (t / 4) % 256,
      r = Math.floor(t / 1024),
      a =
        e === `fabric`
          ? 110 +
            50 * Math.sin((n * Math.PI) / 2) * Math.sin((r * Math.PI) / 2) +
            o() * 25
          : 180 + o() * 50;
    ((i.data[t] = i.data[t + 1] = i.data[t + 2] = a), (i.data[t + 3] = 255));
  }
  if ((r.putImageData(i, 0, 0), e === `plastic`)) {
    ((r.strokeStyle = `rgba(80,80,80,.14)`), (r.lineWidth = 0.4));
    for (let e = 0; e < 45; e++) {
      let e = o() * 256,
        t = o() * 256;
      (r.beginPath(),
        r.moveTo(e, t),
        r.lineTo(e + o() * 40, t + o() * 5),
        r.stroke());
    }
  }
  let s = new y(t);
  return (
    (s.wrapS = s.wrapT = n),
    s.repeat.set(e === `fabric` ? 4 : 1, e === `fabric` ? 30 : 1),
    s
  );
}
function ti() {
  let e = document.createElement(`canvas`);
  ((e.width = 1024), (e.height = 1536));
  let t = e.getContext(`2d`),
    n = 617,
    r = () => (n = (n * 1664525 + 1013904223) >>> 0) / 4294967296;
  for (let e = 0; e < 950; e++) {
    let e = r() * 1024,
      n = r() * 1536;
    if (
      Math.min(e, 1024 - e, n, 1536 - n) > 60 &&
      !(n > 165 && n < 244) &&
      r() > 0.09
    )
      continue;
    let i = 0.3 + r() * 2.1;
    ((t.fillStyle = `rgba(${r() > 0.55 ? `70,66,53` : `255,255,246`},${0.12 + r() * 0.38})`),
      t.beginPath(),
      t.ellipse(e, n, i, i * (0.45 + r()), r() * Math.PI, 0, Math.PI * 2),
      t.fill());
  }
  for (let e = 0; e < 28; e++) {
    let e = r() > 0.5 ? 25 + r() * 45 : 954 + r() * 40,
      n = 250 + r() * 1220;
    ((t.strokeStyle = `rgba(240,242,230,${0.1 + r() * 0.2})`),
      (t.lineWidth = 0.35 + r() * 0.55),
      t.beginPath(),
      t.moveTo(e, n),
      t.quadraticCurveTo(e + r() * 5, n + 12, e + r() * 7, n + 15 + r() * 38),
      t.stroke());
  }
  let i = new y(e);
  return ((i.colorSpace = a), i);
}
async function ni(n, o, b, se = Qr) {
  await Vr.init();
  let le = !1,
    ue = 0,
    fe = !1,
    _e = !1,
    x = null,
    be = 0,
    xe = 0,
    S = !0,
    Se = window.matchMedia(`(prefers-reduced-motion: reduce)`).matches,
    Ce = window.matchMedia(`(prefers-reduced-motion: reduce)`),
    we = () => {
      Se = Ce.matches;
    };
  Ce.addEventListener(`change`, we);
  let C = new s();
  C.background = new me(`#efeee7`);
  let w = new de({
      canvas: n,
      antialias: !0,
      alpha: !0,
      powerPreference: `high-performance`,
    }),
    Te = o().material.unlitArtwork === !0;
  (w.setPixelRatio(Math.min(window.devicePixelRatio, Te ? 2 : 1.5)),
    w.setClearColor(0, 0),
    (w.shadowMap.enabled = !0),
    (w.shadowMap.type = 2),
    (w.toneMapping = 4));
  let T = new ae(36, 1, 0.1, 60);
  (T.position.set(0, 0.8, 13.8), T.lookAt(0, 0.8, 0));
  let Ee = pe(w, C, T),
    De = new ce(w),
    E = new ye();
  for (let [e, t, n, r, i, a] of [
    [-3, 3, 1, 7, 5, 0.55],
    [3, 3, 1.5, 7, 0.015, -0.55],
    [0.8, 4, 0.28, 6, 7, -0.2],
  ]) {
    let o = new ge(
      new ee(n, r, 0.03),
      new f({ color: new me().setRGB(i, i, i) }),
    );
    (o.position.set(e, 1, t), (o.rotation.y = a), E.add(o));
  }
  let Oe = De.fromScene(E, 0.015);
  ((C.environment = Oe.texture),
    (C.environmentIntensity = 0.65),
    E.dispose(),
    De.dispose());
  let D = new ne(`#fff7e6`, 4.5);
  (D.position.set(-3, 6, 7),
    (D.castShadow = !0),
    D.shadow.mapSize.set(1024, 1024),
    Object.assign(D.shadow.camera, {
      left: -8,
      right: 8,
      top: 9,
      bottom: -7,
      near: 0.1,
      far: 25,
    }),
    (D.shadow.bias = -5e-4),
    (D.shadow.normalBias = 0.03),
    (D.shadow.radius = 5),
    C.add(D));
  let ke = new ne(`#e8f0ff`, 0.7);
  (ke.position.set(5, 2, 4), C.add(ke), C.add(new re(`#ffffff`, 0.35)));
  let Ae = new ge(new ie(100, 100), new d({ opacity: 0.13 }));
  ((Ae.position.z = -1), (Ae.receiveShadow = !0), C.add(Ae));
  let O = new _();
  C.add(O);
  let je = ei(`plastic`),
    Me = ei(`fabric`),
    k = ti(),
    Ne = {
      filtered: { value: !1 },
      clarity: { value: 1 },
      thickness: { value: 0.006 },
      damage: { value: 0.55 },
    };
  function Pe(e, t = !1) {
    let n = new he({
      color: `#ffffff`,
      metalness: 1,
      roughness: e,
      transparent: !0,
      depthWrite: !1,
      side: 0,
      envMapIntensity: 1,
    });
    return (
      (n.onBeforeCompile = (e) => {
        ((e.uniforms.filmClarity = Ne.clarity),
          (e.uniforms.filteredCapture = Ne.filtered),
          (e.uniforms.filmEdgeDamage = Ne.damage),
          (e.vertexShader =
            `varying vec3 vFilmPosition; uniform float filmEdgeDamage;
` + e.vertexShader),
          (e.vertexShader = e.vertexShader.replace(
            `#include <begin_vertex>`,
            `#include <begin_vertex>
        vFilmPosition=position;
        ${
          t
            ? `float edgeMask=smoothstep(1.20,1.30,abs(position.x));
        float nick=exp(-pow((position.y+1.72)*19.0,2.0)) + .6*exp(-pow((position.y-.7)*28.0,2.0));
        transformed.x -= sign(position.x)*nick*edgeMask*.014*filmEdgeDamage;`
            : ``
        }
      `,
          )),
          (e.uniforms.filmThickness = Ne.thickness),
          (e.fragmentShader =
            `uniform bool filteredCapture; varying vec3 vFilmPosition; uniform float filmClarity; uniform float filmThickness;
` + e.fragmentShader),
          t ||
            (e.fragmentShader = e.fragmentShader.replace(
              `#include <normal_fragment_maps>`,
              `#include <normal_fragment_maps>
        normal=normalize(normal + vec3(.018*sin(vFilmPosition.y*3.1 + vFilmPosition.x*1.4), .011*cos(vFilmPosition.x*4.2-vFilmPosition.y*1.3),0.0));
      `,
            )),
          (e.fragmentShader = e.fragmentShader.replace(
            `#include <opaque_fragment>`,
            `#include <opaque_fragment>
        float facing = clamp(abs(dot(normalize(normal), normalize(vViewPosition))), 0.0, 1.0);
        float reflection = ${t ? `0.18 + 0.82` : `0.035 + 0.965`} * pow(1.0 - facing, 5.0);
        reflection = max(reflection, ${t ? `0.18` : `0.035`});
        reflection = clamp(reflection * (1.0 + filmThickness * 3.0), 0.0, 1.0);
        // Preserve bright strip-light highlights when compositing HDR
        // reflections onto an optically thin, transparent film.
        float energy=max(max(outgoingLight.r,outgoingLight.g),outgoingLight.b);
        reflection=max(reflection,smoothstep(.9,4.0,energy)*${t ? `.65` : `.34`});
        gl_FragColor.a = mix(1.0, reflection, filmClarity);
        // Bound the film's reflection before HDR compositing. Otherwise a
        // bright studio light overwhelms the card before output tone mapping.
        if(filteredCapture) gl_FragColor.rgb=min(gl_FragColor.rgb,vec3(1.0));
      `,
          )));
      }),
      (n.customProgramCacheKey = () => `thin-vinyl-fresnel-v3-` + t),
      n
    );
  }
  let Fe = Pe(0.008),
    Ie = Pe(0.018, !0);
  Ie.color.set(`#858c88`);
  let Le = new p({
    color: `#d5d9d6`,
    metalness: 1,
    roughness: 0.16,
    bumpMap: je,
    bumpScale: 12e-5,
  });
  function Re(e, t, n = O, r = 0, i = 0, a = 0) {
    let o = new ge(e, t);
    return (o.position.set(r, i, a), n.add(o), o);
  }
  let ze = $r(2.72, 4.36, 0.19);
  for (let e of [-0.88, 0.88]) {
    let t = new l();
    (t.absarc(e, 1.89, 0.104, 0, Math.PI * 2, !0), ze.holes.push(t));
  }
  let A = $r(0.66, 0.13, 0.064),
    j = new l();
  (A.getPoints(16)
    .reverse()
    .forEach((e, t) =>
      t ? j.lineTo(e.x, e.y + 1.88) : j.moveTo(e.x, e.y + 1.88),
    ),
    ze.holes.push(j));
  let Be = Re(
    new te(ze, {
      depth: 0.008,
      bevelEnabled: !0,
      bevelSegments: 3,
      steps: 1,
      bevelSize: 0.005,
      bevelThickness: 0.004,
      curveSegments: 16,
    }),
    Fe,
    O,
    0,
    0,
    0.045,
  );
  Be.renderOrder = 3;
  let M = Re(new t(ze, 16), Fe, O, 0, 0, 0.005);
  ((M.rotation.y = Math.PI), (M.renderOrder = 2));
  let Ve = new f({
      map: k,
      transparent: !0,
      opacity: 0.65,
      depthWrite: !1,
      polygonOffset: !0,
      polygonOffsetFactor: -1,
    }),
    He = Re(new ie(2.52, 3.87), Ve, O, 0, -0.12, 0.061);
  He.renderOrder = 4;
  function N(e, t, n, r, i = 0.015, a = Ie, o = 0) {
    let s = $r(e, t, n)
      .getPoints(24)
      .map((e) => $(e.x, e.y + o, r));
    return (
      s[0].distanceTo(s.at(-1)) < 1e-4 && s.pop(),
      s.forEach((e, t) => {
        e.z += 0.002 * Math.sin(t * 1.7) + 0.0015 * Math.sin(t * 0.47);
      }),
      Re(new g(new oe(s, !0), 220, i, 10, !0), a)
    );
  }
  (N(2.72, 4.36, 0.19, 0.032, 0.012),
    N(2.58, 4.2, 0.15, 0.05, 0.007),
    N(0.66, 0.13, 0.064, 0.053, 0.006, Ie, 1.88));
  for (let e of [-0.88, 0.88])
    Re(new m(0.109, 0.013, 8, 40), Ie, O, e, 1.89, 0.053);
  for (let e = 0; e < 4; e++) {
    let t = Array.from({ length: 38 }, (t, n) =>
      $(
        -1.275 + (n / 37) * 2.55,
        1.55 + e * 0.032 + 0.002 * Math.sin(n * 0.81 + e),
        0.056 + 0.002 * Math.sin(n * 0.69 + e * 2),
      ),
    );
    Re(new g(new oe(t), 90, 0.01 + e * 8e-4, 8, !1), Ie);
  }
  let Ue = new he({
    color: `#ffffff`,
    roughness: 0.015,
    transmission: 1,
    thickness: 0.008,
    ior: 1.1,
  });
  for (let e = 0; e < 19; e++) {
    let t = Math.sin(e * 47.31) * 1.17,
      n = 1.565 + (0.5 + 0.5 * Math.sin(e * 29.9)) * 0.083;
    Re(new h(0.004 + (e % 5) * 0.0017, 10, 6), Ue, O, t, n, 0.065).scale.set(
      1.8,
      0.65,
      0.4,
    );
  }
  let P = new p({ color: `#efebdf`, roughness: 0.88 }),
    We = Re(new ve(2.4, 3.52, 0.025, 3, 0.019), P, O, 0, -0.3, 0.025);
  We.castShadow = !0;
  let Ge = Te
    ? new f({ toneMapped: !1 })
    : new p({ roughness: 0.84, metalness: 0, bumpMap: je, bumpScale: 15e-5 });
  Re(new ie(2.39, 3.505), Ge, O, 0, -0.3, 0.04);
  let Ke = new p({ color: `#eeeadf`, roughness: 0.9 }),
    qe = Re(new ie(2.39, 3.505), Ke, O, 0, -0.3, 0.009);
  qe.rotation.y = Math.PI;
  let Je = new p({
      color: `#30382d`,
      roughness: 0.9,
      bumpMap: Me,
      bumpScale: 0.003,
    }),
    Ye = Zr(Le, Je);
  C.add(Ye.clasp, Ye.eye, Ye.yoke);
  let Xe = Jr(o().physics),
    { world: Ze, body: Qe, restY: $e } = Xe,
    et = Xe.straps.map((e) => {
      let t = Xr(Je);
      return (
        C.add(t.mesh),
        { ...t, points: Array.from({ length: e.links.length + 2 }, () => $()) }
      );
    }),
    tt = new u(),
    nt = new r(10, 10),
    rt = new e($(0, 0, 1), 0),
    it = $(),
    at = $(),
    ot = $(),
    st = $(),
    ct = !1,
    lt = 0,
    ut = 0,
    dt = new i();
  async function ft(e) {
    let t = ++ut,
      n = await dt.loadAsync(e);
    if (le || t !== ut) {
      n.dispose();
      return;
    }
    let r = n.image,
      i = document.createElement(`canvas`);
    ((i.width = r.width), (i.height = r.height));
    let o = i.getContext(`2d`, { willReadFrequently: !0 });
    o.drawImage(r, 0, 0);
    let s = o.getImageData(0, 0, r.width, r.height).data,
      c = r.width,
      l = r.height,
      u = -1,
      d = -1;
    for (let e = 0; e < r.height; e++)
      for (let t = 0; t < r.width; t++)
        s[(e * r.width + t) * 4 + 3] > 0 &&
          ((c = Math.min(c, t)),
          (u = Math.max(u, t)),
          (l = Math.min(l, e)),
          (d = Math.max(d, e)));
    (u < c && ((c = 0), (l = 0), (u = r.width - 1), (d = r.height - 1)),
      (i.width = u - c + 1),
      (i.height = d - l + 1),
      (o.fillStyle = `#ffffff`),
      o.fillRect(0, 0, i.width, i.height),
      o.drawImage(r, c, l, i.width, i.height, 0, 0, i.width, i.height),
      n.dispose(),
      (n = new y(i)));
    let f = i.width / i.height,
      p = 2.39 / 3.505;
    (f > p ? (n.repeat.x = p / f) : (n.repeat.y = f / p),
      n.offset.set((1 - n.repeat.x) / 2, (1 - n.repeat.y) / 2),
      (n.colorSpace = a),
      (n.anisotropy = w.capabilities.getMaxAnisotropy()),
      Ge.map?.dispose(),
      (Ge.map = n),
      (Ge.needsUpdate = !0));
  }
  try {
    await ft(se);
  } catch (e) {
    throw (w.dispose(), Ze.free(), e);
  }
  function pt(e) {
    let t = n.getBoundingClientRect();
    (nt.set(
      ((e.clientX - t.left) / t.width) * 2 - 1,
      (-(e.clientY - t.top) / t.height) * 2 + 1,
    ),
      tt.setFromCamera(nt, T));
  }
  function mt() {
    return tt.intersectObject(We, !1)[0];
  }
  function ht(e) {
    if (e.button !== 0 || fe) return;
    pt(e);
    let t = mt();
    t &&
      ((_e = !0),
      (x = e.pointerId),
      n.setPointerCapture(e.pointerId),
      rt.setFromNormalAndCoplanarPoint(T.getWorldDirection($()), t.point),
      tt.ray.intersectPlane(rt, it),
      at.copy(O.worldToLocal(t.point.clone())),
      (n.style.cursor = `grabbing`),
      b(`dragging`));
  }
  function gt(e) {
    if (x !== null && e.pointerId !== x) return;
    if ((pt(e), tt.ray.intersectPlane(rt, st), _e)) {
      (it.copy(st),
        (it.x = v.clamp(it.x, -4.5, 4.5)),
        (it.y = v.clamp(it.y, -3.5, 5)));
      return;
    }
    let t = mt();
    n.style.cursor = t && !fe ? `grab` : `default`;
    let r = performance.now();
    if (t && ct && !fe && !Se && e.pointerType !== `touch`) {
      let e = Math.max((r - lt) / 1e3, 0.016),
        n = o(),
        i = v.clamp((st.x - ot.x) / e, -12, 12),
        a = v.clamp((st.y - ot.y) / e, -8, 8);
      Qe.applyImpulseAtPoint(
        $(
          i * 0.008 * n.physics.mouseForce,
          a * 0.004 * n.physics.mouseForce,
          0,
        ),
        t.point,
        !0,
      );
    }
    (ot.copy(st), (lt = r), (ct = !0));
  }
  function _t(e) {
    (x !== null && e && e.pointerId !== x) ||
      ((_e = !1),
      x !== null && n.hasPointerCapture(x) && n.releasePointerCapture(x),
      (x = null),
      (n.style.cursor = `grab`),
      b(fe ? `paused` : `live`));
  }
  function vt() {
    ((ct = !1), _e || (n.style.cursor = `default`));
  }
  (n.addEventListener(`pointerdown`, ht),
    n.addEventListener(`pointermove`, gt),
    n.addEventListener(`pointerup`, _t),
    n.addEventListener(`pointercancel`, _t),
    n.addEventListener(`lostpointercapture`, _t),
    n.addEventListener(`pointerleave`, vt));
  function yt() {
    let { width: e, height: t } = n.getBoundingClientRect();
    !e ||
      !t ||
      (w.setSize(e, t, !1),
      Ee.resize(e, t),
      (T.aspect = e / t),
      (T.fov = e < 700 ? 43 : 36),
      (T.position.z = e < 700 ? Math.max(13.8, 6.4 / T.aspect) : 13.8),
      T.updateProjectionMatrix());
  }
  let bt = new ResizeObserver(yt);
  (bt.observe(n), yt());
  let xt = new c(),
    St = $(),
    Ct = $(),
    wt = $(),
    F = $();
  function I(e) {
    Xe.update(e.physics, Se);
    let t = e.physics.mass;
    if (_e) {
      (xt.copy(Qe.rotation()), Ct.copy(at).applyQuaternion(xt));
      let n = Qe.translation();
      (wt.copy(Qe.linvel()), F.copy(Qe.angvel()), wt.add(F.cross(Ct)));
      let r = t / (1 + Ct.lengthSq() / 0.65),
        i = e.physics.grip * r,
        a = 2 * Math.sqrt(e.physics.grip) * r,
        o = 1 + (a * Ze.timestep + i * Ze.timestep ** 2) / r;
      (St.copy(it)
        .sub($(n.x, n.y, n.z).add(Ct))
        .multiplyScalar(i)
        .addScaledVector(wt, -a)
        .divideScalar(o),
        St.clampLength(0, 110 * t),
        Qe.applyImpulseAtPoint(
          St.multiplyScalar(Ze.timestep),
          $(n.x, n.y, n.z).add(Ct),
          !0,
        ));
    }
    Ze.step();
  }
  let L = $(),
    Tt = new c();
  function Et(e) {
    let t = !1;
    L.copy(e).sub(O.position).applyQuaternion(Tt);
    let n = [1.47, 2.3, 0.18],
      r = [`x`, `y`, `z`];
    if (r.every((e, t) => Math.abs(L[e]) < n[t])) {
      let i = 0;
      for (let e = 1; e < 3; e++)
        n[e] - Math.abs(L[r[e]]) < n[i] - Math.abs(L[r[i]]) && (i = e);
      let a = r[i];
      ((L[a] = (Math.sign(L[a]) || 1) * n[i]),
        e.copy(L).applyQuaternion(O.quaternion).add(O.position),
        (t = !0));
    }
    return (e.z < -0.88 && ((e.z = -0.88), (t = !0)), t);
  }
  function Dt(e) {
    if (((ue = 0), le || document.hidden || !S)) return;
    ue = requestAnimationFrame(Dt);
    let t = o();
    fe !== t.paused && R(t.paused);
    let r = Math.min((e - (xe || e)) / 1e3, 0.05);
    if (((xe = e), !fe))
      for (be += r; be >= Ze.timestep;) (I(t), (be -= Ze.timestep));
    (O.position.copy(Qe.translation()),
      O.quaternion.copy(Qe.rotation()),
      O.updateMatrixWorld(!0));
    for (let e of [`clasp`, `eye`, `yoke`])
      (Ye[e].position.copy(Xe[e].translation()),
        Ye[e].quaternion.copy(Xe[e].rotation()),
        Ye[e].updateMatrixWorld(!0));
    (Tt.copy(O.quaternion).invert(),
      Xe.straps.forEach((e, t) => {
        let n = et[t],
          i = n.points,
          a = e.links.length;
        (i[0].copy(e.anchorPosition),
          e.links
            .slice(0, -1)
            .forEach((e, t) => i[t + 1].copy(e.translation())),
          i[a].copy(
            Ye.yoke.localToWorld(
              $(
                e.attachment.x + Math.sign(e.anchorPosition.x) * 0.025,
                e.attachment.y + 0.055,
                e.attachment.z,
              ),
            ),
          ),
          i[a + 1].copy(Ye.yoke.localToWorld($().copy(e.attachment))),
          n.update(
            new oe(i),
            $(1, 0, 0).applyQuaternion(Ye.yoke.quaternion),
            r,
            Et,
          ));
      }),
      (Ve.opacity = t.material.wear),
      (Ne.damage.value = t.material.edgeDamage),
      (Fe.roughness = t.material.roughness),
      (Ne.clarity.value = t.material.transmission),
      (Ne.thickness.value = t.material.thickness),
      (Fe.envMapIntensity = t.lighting.reflections),
      (Ie.envMapIntensity = t.lighting.reflections),
      Je.color.set(t.material.strapColor),
      (Le.roughness = t.material.metalRoughness),
      (w.toneMappingExposure = t.lighting.exposure),
      (D.intensity = t.lighting.keyLight),
      (Ae.material.opacity = t.lighting.shadow));
    let i = v.degToRad(t.view.angle),
      a =
        (n.clientWidth < 700 ? Math.max(13.8, 6.4 / T.aspect) : 13.8) /
        t.view.zoom;
    (T.position.set(Math.sin(i) * a, 0.8, Math.cos(i) * a),
      T.lookAt(0, 0.8, 0));
    let s = t.background;
    ((n.style.backgroundColor = s.transparent ? `transparent` : s.color),
      s.filterBackground && !s.transparent
        ? ((C.background ||= new me()), C.background.set(s.color))
        : (C.background = null),
      (Ne.filtered.value = t.filters.enabled || t.plotter.enabled),
      Ee.render(t.filters, t.plotter));
  }
  function Ot() {
    (_t(), Xe.reset(), et.forEach((e) => e.reset()), (be = 0));
  }
  function kt() {
    fe ||
      Qe.applyImpulseAtPoint(
        $(Se ? 0.3 : 1.4, 0, 0.1),
        $(0, $e - 0.7, 0.06),
        !0,
      );
  }
  function R(e) {
    ((fe = e), _t(), (xe = 0), (be = 0), b(fe ? `paused` : `live`));
  }
  function At() {
    ((xe = 0),
      (be = 0),
      document.hidden || !S
        ? (cancelAnimationFrame(ue), (ue = 0), _t())
        : !ue && !le && (ue = requestAnimationFrame(Dt)));
  }
  let jt = new IntersectionObserver(([e]) => {
    ((S = e.isIntersecting), At());
  });
  return (
    jt.observe(n),
    document.addEventListener(`visibilitychange`, At),
    Se || Qe.applyImpulseAtPoint($(0.4, 0, 0.04), $(0, $e - 0.7, 0), !0),
    (ue = requestAnimationFrame(Dt)),
    b(`live`),
    {
      setCard: ft,
      reset: Ot,
      nudge: kt,
      setPaused: R,
      dispose() {
        ((le = !0),
          ut++,
          cancelAnimationFrame(ue),
          bt.disconnect(),
          jt.disconnect(),
          Ce.removeEventListener(`change`, we),
          document.removeEventListener(`visibilitychange`, At));
        for (let [e, t] of [
          [`pointerdown`, ht],
          [`pointermove`, gt],
          [`pointerup`, _t],
          [`pointercancel`, _t],
          [`lostpointercapture`, _t],
          [`pointerleave`, vt],
        ])
          n.removeEventListener(e, t);
        let e = new Set(),
          t = new Set();
        (C.traverse((n) => {
          (n.geometry && e.add(n.geometry), n.material && t.add(n.material));
        }),
          e.forEach((e) => e.dispose()),
          t.forEach((e) => e.dispose()),
          Ge.map?.dispose(),
          je.dispose(),
          Me.dispose(),
          k.dispose(),
          D.shadow.dispose(),
          Oe.dispose(),
          Ze.free(),
          Ee.dispose(),
          w.dispose());
      },
    }
  );
}
export { ni as createBadgeScene };
