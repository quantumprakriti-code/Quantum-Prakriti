// src/components/secureConnection.jsx
import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  Suspense,
} from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Float, AdaptiveDpr } from '@react-three/drei';
import * as THREE from 'three';
import './secureConnection.css';

/* ------------------------------------------------------------------
   Palette
------------------------------------------------------------------ */
const C = {
  black:     '#04060B',
  black2:    '#070B14',
  deepBlue:  '#0B1630',
  deepBlue2: '#0F1E42',
  deepBlue3: '#16264E',
  gold:      '#D4AF37',
  goldSoft:  '#E8C766',
  goldDeep:  '#A8862A',
  white:     '#FFFFFF',
  textSec:   '#B8C0D0',
  textMuted: '#7A8499',
  burgundy:  '#641E35',
  burgundy2: '#7A2540',
  tomato:    '#FF6347',
};

/* ------------------------------------------------------------------
   Math helpers
------------------------------------------------------------------ */
const clamp01 = (v) => Math.min(1, Math.max(0, v));
const smoothstep = (a, b, x) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};

const _v1 = new THREE.Vector3();
const _v2 = new THREE.Vector3();
const _v3 = new THREE.Vector3();
const _v4 = new THREE.Vector3();
const _q1 = new THREE.Quaternion();
const _xAxis = new THREE.Vector3(1, 0, 0);

function useScrollProgress() {
  const containerRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const update = () => {
      const rect = container.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      if (total <= 0) return setProgress(0);
      const scrolled = Math.min(Math.max(-rect.top, 0), total);
      setProgress(scrolled / total);
    };

    const onScroll = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        update();
      });
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return { containerRef, progress };
}

function useWebGLSupport() {
  const [supported, setSupported] = useState(true);
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl =
        canvas.getContext('webgl2') ||
        canvas.getContext('webgl') ||
        canvas.getContext('experimental-webgl');
      setSupported(!!gl);
    } catch {
      setSupported(false);
    }
  }, []);
  return supported;
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const handler = (e) => setReduced(e.matches);
    mq.addEventListener?.('change', handler);
    return () => mq.removeEventListener?.('change', handler);
  }, []);
  return reduced;
}

function CpuTower({ position = [0, 0, 0], accent = C.deepBlue3 }) {
  const led = useRef();
  useFrame(({ clock }) => {
    if (led.current) {
      led.current.material.emissiveIntensity =
        1.2 + Math.sin(clock.elapsedTime * 4) * 0.5;
    }
  });
  return (
    <group position={position}>
      <mesh position={[0, 0.55, 0]} castShadow>
        <boxGeometry args={[0.5, 1.1, 0.55]} />
        <meshStandardMaterial color="#0b1424" metalness={0.9} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.55, 0.28]}>
        <boxGeometry args={[0.44, 1.0, 0.005]} />
        <meshStandardMaterial color="#060d18" metalness={0.95} roughness={0.2} />
      </mesh>
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[0, 0.85 - i * 0.28, 0.285]}>
          <planeGeometry args={[0.32, 0.12]} />
          <meshBasicMaterial color="#04070d" />
        </mesh>
      ))}
      <mesh ref={led} position={[0.14, 0.28, 0.29]}>
        <sphereGeometry args={[0.022, 8, 8]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={1.4} toneMapped={false} />
      </mesh>
    </group>
  );
}

const _labelCache = new Map();
function Label({ position = [0, 0, 0], title = '', subtitle = '', opacity = 1 }) {
  const { texture, aspect } = useMemo(() => {
    const key = `${title}::${subtitle || ''}`;
    if (_labelCache.has(key)) return _labelCache.get(key);

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const titleFont = 'bold 58px "Inter", system-ui, sans-serif';
    const subFont = '400 34px "Inter", system-ui, sans-serif';

    ctx.font = titleFont;
    const titleW = ctx.measureText(title).width;
    ctx.font = subFont;
    const subW = subtitle ? ctx.measureText(subtitle).width : 0;

    const textW = Math.max(titleW, subW);
    const padding = 40;
    const canvasW = Math.max(256, Math.ceil(textW + padding * 2));
    const canvasH = 160;

    canvas.width = canvasW;
    canvas.height = canvasH;

    ctx.fillStyle = '#FFFFFF';
    ctx.font = titleFont;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(title, canvasW / 2, 52);

    if (subtitle) {
      ctx.fillStyle = '#B8C0D0';
      ctx.font = subFont;
      ctx.fillText(subtitle, canvasW / 2, 116);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.anisotropy = 2;
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.generateMipmaps = false;
    tex.needsUpdate = true;

    const aspect = canvasW / canvasH;
    const entry = { texture: tex, aspect };
    _labelCache.set(key, entry);
    return entry;
  }, [title, subtitle]);

  if (opacity <= 0.01) return null;

  const height = 0.5;
  const width = height * aspect;

  return (
    <mesh position={position}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial map={texture} transparent opacity={opacity} depthWrite={false} toneMapped={false} />
    </mesh>
  );
}

function Computer({
  position = [0, 0, 0],
  variant = 'client',
  glowColor = C.deepBlue3,
  screenIntensity = 1.2,
  screenType = 'code',
  withCpu = false,
  failed = 0,
}) {
  const screenRef = useRef();
  const ledRef = useRef();
  const atomRef = useRef();
  const orbitRefs = useRef([]);
  const failRefs = useRef([]);

  const palette = useMemo(() => {
    if (variant === 'hacker') return { base: '#1a0d14', trim: C.tomato, screen: '#3a0510' };
    if (variant === 'server') return { base: '#0b1424', trim: C.deepBlue3, screen: '#0a1f33' };
    if (variant === 'quantum') return { base: '#0b1424', trim: C.gold, screen: '#0a1730' };
    return { base: '#0d1626', trim: C.deepBlue3, screen: '#0b2238' };
  }, [variant]);

  const state = useRef({ failed: 0, screenIntensity, positionX: position[0] });
  state.current.failed = failed;
  state.current.screenIntensity = screenIntensity;

  useFrame((s) => {
    const t = s.clock.elapsedTime;
    const f = state.current.failed;
    const si = state.current.screenIntensity;

    if (screenRef.current) {
      const base = si * (0.88 + Math.sin(t * 2 + state.current.positionX) * 0.12);
      screenRef.current.material.emissiveIntensity = base * (1 - f * 0.6);
    }
    if (ledRef.current) {
      ledRef.current.material.emissiveIntensity = (1.5 + Math.sin(t * 5) * 0.5) * (1 - f * 0.7);
    }
    if (atomRef.current) {
      const stutter = f > 0.05 ? Math.sin(t * 18) * f * 0.4 : 0;
      atomRef.current.rotation.z = t * 0.7 * (1 - f * 0.85) + stutter;
    }
    const orbits = orbitRefs.current;
    for (let i = 0; i < orbits.length; i++) {
      const o = orbits[i];
      if (!o) continue;
      const spd = (0.6 + i * 0.15) * (1 - f * 0.9);
      o.rotation.z = t * spd + (f > 0.05 ? Math.sin(t * 14 + i) * f * 0.3 : 0);
    }
    const fails = failRefs.current;
    for (let i = 0; i < fails.length; i++) {
      const m = fails[i];
      if (!m) continue;
      m.material.opacity = f * (0.5 + 0.5 * Math.abs(Math.sin(t * 6 + i)));
    }
  });

  const SCREEN_Y = 0.85;
  const SCREEN_Z = 0.046;
  const SCREEN_W = 1.4;
  const SCREEN_H = 0.8;

  return (
    <group position={position}>
      <mesh position={[0, 0.02, 0]} receiveShadow>
        <cylinderGeometry args={[0.35, 0.4, 0.04, 24]} />
        <meshStandardMaterial color="#1a2233" metalness={0.9} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.25, 0]} castShadow>
        <boxGeometry args={[0.12, 0.5, 0.12]} />
        <meshStandardMaterial color="#1a2233" metalness={0.9} roughness={0.3} />
      </mesh>
      <mesh position={[0, SCREEN_Y, 0]} castShadow>
        <boxGeometry args={[1.6, 1.0, 0.08]} />
        <meshStandardMaterial color={palette.base} metalness={0.75} roughness={0.35} />
      </mesh>
      <mesh ref={screenRef} position={[0, SCREEN_Y, SCREEN_Z]}>
        <planeGeometry args={[SCREEN_W, SCREEN_H]} />
        <meshStandardMaterial color={palette.screen} emissive={glowColor} emissiveIntensity={screenIntensity} toneMapped={false} />
      </mesh>

      {screenType === 'code' &&
        [0, 1, 2, 3, 4].map((i) => {
          const barW = 0.55 - (i % 3) * 0.1;
          const barY = 0.28 - i * 0.14;
          return (
            <mesh key={i} position={[-SCREEN_W / 2 + barW / 2 + 0.12, SCREEN_Y + barY, SCREEN_Z + 0.002]}>
              <planeGeometry args={[barW, 0.045]} />
              <meshBasicMaterial color={i % 2 === 0 ? glowColor : '#7fb0ff'} transparent opacity={0.9} toneMapped={false} />
            </mesh>
          );
        })}

      {screenType === 'hacker' &&
        Array.from({ length: 12 }).map((_, i) => {
          const col = i % 4;
          const row = Math.floor(i / 4);
          const w = 0.18 + (i % 3) * 0.06;
          return (
            <mesh key={i} position={[-SCREEN_W / 2 + 0.18 + col * 0.32, SCREEN_Y + 0.28 - row * 0.22, SCREEN_Z + 0.002]}>
              <planeGeometry args={[w, 0.04]} />
              <meshBasicMaterial color={i % 2 === 0 ? C.tomato : C.burgundy2} transparent opacity={0.9} toneMapped={false} />
            </mesh>
          );
        })}

      {screenType === 'atom' && (
        <group position={[0, SCREEN_Y, SCREEN_Z + 0.01]}>
          <mesh ref={atomRef}>
            <sphereGeometry args={[0.045, 16, 16]} />
            <meshStandardMaterial color={C.gold} emissive={C.goldSoft} emissiveIntensity={2.2} toneMapped={false} />
          </mesh>
          {[0, 1, 2].map((i) => (
            <mesh key={i} ref={(el) => (orbitRefs.current[i] = el)} rotation={[0, 0, (i * Math.PI) / 3]}>
              <torusGeometry args={[0.22, 0.005, 8, 48]} />
              <meshStandardMaterial color={C.goldSoft} emissive={C.gold} emissiveIntensity={1.6} transparent opacity={0.95 * (1 - failed * 0.7)} toneMapped={false} />
            </mesh>
          ))}
          {[0, 1, 2].map((i) => (
            <mesh key={`e-${i}`} position={[Math.cos((i * Math.PI * 2) / 3) * 0.22, Math.sin((i * Math.PI * 2) / 3) * 0.22, 0]}>
              <sphereGeometry args={[0.014, 8, 8]} />
              <meshStandardMaterial color={C.gold} emissive={C.gold} emissiveIntensity={2.4 * (1 - failed * 0.8)} toneMapped={false} />
            </mesh>
          ))}
          {failed > 0.05 && (
            <>
              {Array.from({ length: 6 }).map((_, i) => (
                <mesh key={`fail-${i}`} ref={(el) => (failRefs.current[i] = el)} position={[-0.4 + (i % 3) * 0.4, 0.16 - Math.floor(i / 3) * 0.18, 0.004]}>
                  <planeGeometry args={[0.16, 0.05]} />
                  <meshBasicMaterial color={C.tomato} transparent opacity={0} toneMapped={false} />
                </mesh>
              ))}
            </>
          )}
        </group>
      )}

      <mesh ref={ledRef} position={[0.7, 0.4, 0.05]}>
        <sphereGeometry args={[0.025, 8, 8]} />
        <meshStandardMaterial color={glowColor} emissive={glowColor} emissiveIntensity={1.5} toneMapped={false} />
      </mesh>
      {variant !== 'server' && (
        <mesh position={[0, 0.05, 0.55]} castShadow>
          <boxGeometry args={[1.1, 0.04, 0.35]} />
          <meshStandardMaterial color={palette.base} metalness={0.6} roughness={0.5} />
        </mesh>
      )}
      {withCpu && <CpuTower position={[1.05, 0, 0]} accent={palette.trim} />}
      {variant === 'hacker' && (
        <group position={[0, 1.42, 0]}>
          <mesh position={[0, 0, 0.06]} castShadow>
            <cylinderGeometry args={[0.5, 0.5, 0.03, 24]} />
            <meshStandardMaterial color={C.black} metalness={0.7} roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.15, 0]} castShadow>
            <cylinderGeometry args={[0.32, 0.36, 0.28, 24]} />
            <meshStandardMaterial color={C.black} metalness={0.7} roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.06, 0]}>
            <torusGeometry args={[0.35, 0.018, 8, 32]} />
            <meshStandardMaterial color={C.burgundy2} emissive={C.burgundy} emissiveIntensity={0.7} toneMapped={false} />
          </mesh>
        </group>
      )}
    </group>
  );
}

function DataStream({
  from = [-3, 1, 0], to = [3, 1, 0], color = C.deepBlue3, count = 14, speed = 0.4,
  progress = 1, scramble = false, branch = null, branchCount = 4, blocked = false,
  stallAt = 0, beamOpacity = 1,
}) {
  const meshRefs = useRef([]);
  const branchMeshRefs = useRef([]);
  const beamRef = useRef();

  const positions = useMemo(
    () => Array.from({ length: count }, (_, i) => ({ offset: i / count, jitter: (Math.random() - 0.5) * 0.12, yJitter: (Math.random() - 0.5) * 0.12 })),
    [count]
  );

  const fromV = useMemo(() => new THREE.Vector3(...from), [from]);
  const toV   = useMemo(() => new THREE.Vector3(...to),   [to]);
  const dir   = useMemo(() => new THREE.Vector3().subVectors(toV, fromV), [fromV, toV]);
  const dirLen = dir.length();

  useEffect(() => {
    if (!beamRef.current) return;
    _v1.addVectors(fromV, toV).multiplyScalar(0.5);
    beamRef.current.position.copy(_v1);
    _v2.copy(dir).normalize();
    _q1.setFromUnitVectors(_xAxis, _v2);
    beamRef.current.quaternion.copy(_q1);
  }, [fromV, toV, dir]);

  const snap = useRef({});
  snap.current = { fromV, toV, dir, positions, scramble, blocked, stallAt, speed, progress, branch };

  useFrame((s) => {
    const t = s.clock.elapsedTime;
    const { fromV: fV, dir: dV, positions: pos, scramble: scr, blocked: blk, stallAt: stall, speed: spd, progress: prg } = snap.current;

    const meshes = meshRefs.current;
    for (let i = 0; i < meshes.length; i++) {
      const mesh = meshes[i];
      if (!mesh) continue;
      const p = pos[i];
      let raw = (t * spd * (0.6 + prg) + p.offset) % 1;
      if (stall > 0.05 && raw > stall) raw = stall;

      _v3.copy(fV).addScaledVector(dV, raw);
      const jAmt = scr ? 0.1 : 0;
      _v3.x += Math.sin(t * 8 + i) * jAmt;
      _v3.y += Math.cos(t * 7 + i) * jAmt + p.yJitter * 0.08;
      _v3.z += p.jitter * 0.08;
      mesh.position.copy(_v3);

      let stallFade = 1;
      if (stall > 0.05 && raw > stall - 0.05) {
        stallFade = Math.max(0, (stall - raw) / 0.05) * 0.6 + 0.4;
      }
      const midDist = Math.abs(raw - 0.5);
      const blockFade = blk ? Math.max(0, midDist * 2 - 0.2) : 1;
      mesh.material.opacity = blockFade * stallFade * (0.75 + Math.sin(t * 4 + i) * 0.25);
      mesh.material.emissiveIntensity = (1.8 + Math.sin(t * 6 + i) * 0.8) * (0.6 + prg * 0.6) * stallFade;
    }

    const br = snap.current.branch;
    if (br) {
      const bT = br._target || (br._target = new THREE.Vector3(...br.target));
      const bMeshes = branchMeshRefs.current;
      for (let i = 0; i < bMeshes.length; i++) {
        const mesh = bMeshes[i];
        if (!mesh) continue;
        const p = pos[i % pos.length];
        const raw = (t * spd * 0.7 + p.offset) % 1;
        _v4.copy(fV).addScaledVector(dV, 0.5);
        _v3.copy(bT).sub(_v4);
        _v4.addScaledVector(_v3, raw);
        mesh.position.copy(_v4);
        mesh.material.opacity = (1 - raw) * 0.9;
      }
    }
  });

  return (
    <group>
      <mesh ref={beamRef}>
        <boxGeometry args={[dirLen, 0.03, 0.03]} />
        <meshBasicMaterial color={color} transparent opacity={0.32 * beamOpacity} toneMapped={false} />
      </mesh>
      {positions.map((_, i) => (
        <mesh key={`main-${i}`} ref={(el) => (meshRefs.current[i] = el)}>
          <sphereGeometry args={[0.055, 8, 8]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.8} transparent opacity={0.95} toneMapped={false} />
        </mesh>
      ))}
      <line>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={2} array={new Float32Array([...from, ...to])} itemSize={3} />
        </bufferGeometry>
        <lineBasicMaterial color={color} transparent opacity={0.22 * progress * beamOpacity} />
      </line>
      {branch && Array.from({ length: branchCount }).map((_, i) => (
        <mesh key={`branch-${i}`} ref={(el) => (branchMeshRefs.current[i] = el)}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshStandardMaterial color={C.tomato} emissive={C.tomato} emissiveIntensity={1.8} transparent opacity={0.95} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

function SecurityShield({ position = [0, 1, 0], activation = 1, color = C.gold, radius = 1.4 }) {
  const groupRef = useRef();
  const ringRef = useRef();
  const lockRef = useRef();
  const geo = useMemo(() => new THREE.IcosahedronGeometry(radius, 1), [radius]);
  const snap = useRef({ a: 0 });
  snap.current.a = Math.max(activation, 0.001);

  useFrame((s) => {
    const t = s.clock.elapsedTime;
    const a = snap.current.a;
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.25;
      groupRef.current.scale.setScalar(0.7 + a * 0.3);
    }
    if (ringRef.current) {
      ringRef.current.material.emissiveIntensity = (0.8 + Math.sin(t * 3) * 0.4) * a;
      ringRef.current.material.opacity = 0.5 * a;
    }
    if (lockRef.current) {
      lockRef.current.position.y = 0.2 + Math.sin(t * 1.5) * 0.05;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      <mesh geometry={geo}>
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8 * activation} wireframe transparent opacity={0.32 * activation} toneMapped={false} />
      </mesh>
      <mesh>
        <sphereGeometry args={[radius * 0.85, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.06 * activation} side={THREE.BackSide} toneMapped={false} />
      </mesh>
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius * 1.05, 0.015, 6, 48]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1} transparent opacity={0.5 * activation} toneMapped={false} />
      </mesh>
      <group ref={lockRef} position={[0, 0.2, radius * 1.05]}>
        <mesh>
          <boxGeometry args={[0.22, 0.18, 0.08]} />
          <meshStandardMaterial color={C.black2} emissive={color} emissiveIntensity={0.5 * activation} metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.14, 0]}>
          <torusGeometry args={[0.06, 0.02, 8, 16, Math.PI]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.2 * activation} metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0, 0.045]}>
          <circleGeometry args={[0.02, 12]} />
          <meshBasicMaterial color={color} toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
}

function SceneContents({ progress }) {
  const { camera, size } = useThree();
  
  // Calculate the aspect ratio of the current canvas column
  const aspect = size.width / size.height;

  // Spread the computers out. (Narrower screen = closer together)
  const spreadX = aspect < 1.0 ? 2.2 : (aspect < 1.5 ? 3.0 : 4.6);
  const spreadZ = 1.4;
  const baseY = -1.0;

  const clientPos  = [-spreadX, 0, 0];
  const serverPos  = [ spreadX, 0, 0];
  const hackerPos  = [-spreadX * 0.45, baseY, spreadZ];
  const quantumPos = [ spreadX * 0.45, baseY, spreadZ];

  // --- DYNAMIC CAMERA MATH ---
  // Calculate the exact bounding width of the computers + shields
  const boundingWidth = spreadX * 2 + 3.2;
  
  // Calculate how far back the camera needs to be to fit that width
  const fov = 42;
  const tanFov = Math.tan((fov * Math.PI / 180) / 2);
  const camZ = (boundingWidth * 1.1) / (2 * tanFov * Math.max(aspect, 0.5));
  
  // Clamp the distance so it doesn't get ridiculously far
  const finalCamZ = Math.max(8, Math.min(camZ, 20));

  useEffect(() => {
    // Set the camera position dynamically
    camera.position.set(0, 2.0, finalCamZ);
    // Look slightly up (0.4) so the labels at the bottom are well within frame
    camera.lookAt(0, 0.4, 0);
    camera.updateProjectionMatrix();
  }, [camera, finalCamZ]);

  // ... (keep all the progress logic: hackerAppear, quantumAppear, etc.) ...
  const hackerAppear  = smoothstep(0.18, 0.38, progress);
  const quantumAppear = smoothstep(0.38, 0.58, progress);
  const protection    = smoothstep(0.58, 0.78, progress);
  const blocked       = smoothstep(0.78, 1.0,  progress);
  const scramble      = clamp01(hackerAppear - protection);

  const endpointGlow    = protection > 0.5 ? C.gold : C.deepBlue3;
  const mainStreamColor = protection > 0.5 ? C.gold : C.deepBlue3;

  const quantumFail = clamp01(protection * 0.4 + blocked * 0.6);
  const linkStall   = clamp01(blocked * 0.85);
  const linkOpacity = quantumAppear * (1 - blocked * 0.85);

  return (
    <>
      <ambientLight intensity={0.35} color={C.deepBlue2} />
      <directionalLight position={[5, 8, 5]} intensity={0.7} color={C.textSec} />
      <directionalLight position={[-5, 4, 5]} intensity={0.3} color={C.deepBlue3} />

      <pointLight position={clientPos} color={endpointGlow} intensity={1.2} distance={6} />
      <pointLight position={serverPos} color={endpointGlow} intensity={1.2} distance={6} />
      <pointLight position={[0, 4, -2]} color={C.deepBlue} intensity={0.7} distance={12} />

      {hackerAppear > 0.05 && (
        <pointLight position={[hackerPos[0], hackerPos[1] + 1.6, hackerPos[2]]} color={C.tomato} intensity={1.4 * hackerAppear * (1 - blocked * 0.8)} distance={5} />
      )}
      {quantumAppear > 0.05 && (
        <pointLight position={[quantumPos[0], quantumPos[1] + 1.6, quantumPos[2]]} color={C.gold} intensity={1.6 * quantumAppear * (1 - quantumFail * 0.7)} distance={6} />
      )}

      <Environment preset="night" />

      {/* Client */}
      <Float speed={1.2} rotationIntensity={0} floatIntensity={0.15}>
        <Computer position={clientPos} variant="client" glowColor={endpointGlow} screenType="code" screenIntensity={1.2} />
      </Float>
      <Label position={[clientPos[0], clientPos[1] - 0.55, clientPos[2] + 0.1]} title="Client" subtitle="Endpoint" opacity={1} />

      {/* Server */}
      <Float speed={1.4} rotationIntensity={0} floatIntensity={0.15}>
        <Computer position={serverPos} variant="server" glowColor={endpointGlow} screenType="code" screenIntensity={1.1} withCpu />
      </Float>
      <Label position={[serverPos[0], serverPos[1] - 0.55, serverPos[2] + 0.1]} title="Server" subtitle="Critical system" opacity={1} />

      {/* Hacker */}
      {hackerAppear > 0.01 && (
        <group scale={hackerAppear}>
          <Computer position={hackerPos} variant="hacker" glowColor={C.tomato} screenType="hacker" screenIntensity={1.0} />
        </group>
      )}
      {hackerAppear > 0.4 && (
        <Label position={[hackerPos[0], hackerPos[1] - 0.55, hackerPos[2] + 0.1]} title="Hacker" subtitle="Harvest now" opacity={smoothstep(0.4, 0.55, hackerAppear)} />
      )}

      {/* Quantum Computer */}
      {quantumAppear > 0.01 && (
        <group scale={quantumAppear}>
          <Computer position={quantumPos} variant="quantum" glowColor={C.deepBlue3} screenType="atom" screenIntensity={1.0} failed={quantumFail} />
        </group>
      )}
      {quantumAppear > 0.4 && (
        <Label position={[quantumPos[0], quantumPos[1] - 0.55, quantumPos[2] + 0.1]} title="Quantum Computer" subtitle={quantumFail > 0.5 ? 'Cannot decrypt' : 'Decrypt later'} opacity={smoothstep(0.4, 0.55, quantumAppear)} />
      )}

      {/* Main stream */}
      <DataStream from={[clientPos[0] + 0.9, 1.0, 0]} to={[serverPos[0] - 0.9, 1.0, 0]} color={mainStreamColor} count={14} speed={0.42} progress={1} scramble={scramble > 0.5} beamOpacity={1} />

      {/* Hacker tap */}
      {hackerAppear > 0.3 && (
        <DataStream from={[clientPos[0] + 0.9, 1.0, 0]} to={[serverPos[0] - 0.9, 1.0, 0]} color={C.tomato} count={6} speed={0.5} progress={hackerAppear * (1 - protection)} branch={{ target: [hackerPos[0], hackerPos[1] + 1.3, hackerPos[2]] }} branchCount={Math.round(4 * hackerAppear * (1 - protection))} beamOpacity={0.5} />
      )}

      {/* Hacker → Quantum */}
      {quantumAppear > 0.3 && (
        <DataStream from={[hackerPos[0] + 0.6, hackerPos[1] + 1.3, hackerPos[2]]} to={[quantumPos[0] - 0.6, quantumPos[1] + 1.3, quantumPos[2]]} color={C.burgundy2} count={6} speed={0.6} progress={quantumAppear} scramble={blocked > 0.5} stallAt={linkStall} beamOpacity={linkOpacity} />
      )}

      {/* Shields */}
      {protection > 0.01 && (
        <>
          <SecurityShield position={[clientPos[0], clientPos[1] + 1.0, clientPos[2]]} activation={protection} color={C.gold} radius={1.5} />
          <SecurityShield position={[serverPos[0], serverPos[1] + 1.0, serverPos[2]]} activation={protection} color={C.gold} radius={1.5} />
        </>
      )}

      {/* Removed the ground plane to prevent the dark box from clipping */}
    </>
  );
}

function QuantumSecurityScene({ progress }) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, premultipliedAlpha: false, powerPreference: 'high-performance' }}
      camera={{ position: [0, 2.0, 9.0], fov: 42, near: 0.1, far: 100 }}
      onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
      style={{ width: '100%', height: '100%', background: 'transparent' }}
    >
      <SceneContents progress={progress} />
      <AdaptiveDpr pixelated />
    </Canvas>
  );
}



export default function QuantumSecurityStory() {
  const { containerRef, progress } = useScrollProgress();
  const webgl = useWebGLSupport();
  const reducedMotion = useReducedMotion();
  const [sceneReady, setSceneReady] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setSceneReady(true), 50);
    return () => clearTimeout(id);
  }, []);

  const use3D = webgl && !reducedMotion;
  const activeStage = progress < 0.8 ? 3 : 4;

  return (
    <section className="qp-story" ref={containerRef}>
      <div className="qp-story__track">
        <div className="qp-story__canvas">
          {use3D ? (
            <Suspense fallback={<div className="qp-story__fallback">Loading...</div>}>
              <QuantumSecurityScene progress={progress} />
            </Suspense>
          ) : (
            <div className="qp-story__fallback">
              <div className="qp-story__eyebrow">Q-Prakriti</div>
              <h2 className="qp-story__title">Quantum-Safe Communication</h2>
              <p className="qp-story__body" style={{ maxWidth: 520 }}>
                Your device does not support the full 3D visualization.
              </p>
            </div>
          )}
        </div>
        
      </div>
    </section>
  );
}