"use client";

import * as THREE from "three";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import {
  Canvas,
  extend,
  useFrame,
  useThree,
  type ThreeElement,
} from "@react-three/fiber";
import {
  Environment,
  Lightformer,
  useGLTF,
  useTexture,
} from "@react-three/drei";
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
  type RapierRigidBody,
} from "@react-three/rapier";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";

extend({ MeshLineGeometry, MeshLineMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    meshLineGeometry: ThreeElement<typeof MeshLineGeometry>;
    meshLineMaterial: ThreeElement<typeof MeshLineMaterial>;
  }
}

const CARD_GLB = "/assets/kartu.glb";
const BAND_TEX = "/assets/bandd.png";

useGLTF.preload(CARD_GLB);
useTexture.preload(BAND_TEX);

/**
 * Texture thẻ: lấy texture gốc trong GLB (card-base.png) rồi vẽ đè
 * ảnh chân dung + tên của Hải lên đúng vị trí UV.
 */
function useCardTexture() {
  const [tex, setTex] = useState<THREE.CanvasTexture | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = (src: string) =>
      new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
      });

    Promise.all([load("/assets/card-base.png"), load("/profile.jpg")]).then(
      ([base, photo]) => {
        if (cancelled) return;
        const c = document.createElement("canvas");
        c.width = 512;
        c.height = 512;
        const ctx = c.getContext("2d")!;
        ctx.drawImage(base, 0, 0);

        // xóa chữ "RIFQI M.A" bằng cách vá vùng gradient sạch bên dưới
        ctx.drawImage(base, 258, 358, 250, 50, 258, 304, 250, 50);

        // xóa sạch toàn bộ mặt trước (ảnh gốc của người khác) trước khi vẽ đè —
        // tránh còn sót viền/bóng ảnh cũ khi đổi vị trí khung ảnh
        ctx.fillStyle = "#eeeeef";
        ctx.fillRect(0, 0, 256, 392);

        // ô ảnh mặt trước — canh giữa đúng tâm vùng mặt trước (đo từ UV thật),
        // viền mỏng hơn để ảnh chiếm phần lớn thẻ
        const regionW = 256,
          regionH = 388,
          pad = 9;
        const w = regionW - pad * 2,
          h = regionH - pad * 2,
          x = pad,
          y = 2 + pad,
          r = 14; // bo góc ảnh theo đúng bo góc của thẻ
        const frameAspect = w / h;

        // bỏ bớt khoảng nền xám thừa phía trên đầu, rồi crop theo tỉ lệ khung
        // sao cho ảnh không bị kéo giãn méo và mặt luôn nằm giữa
        const topPad = photo.height * 0.08;
        let sx = 0,
          sy = topPad,
          sw = photo.width,
          sh = photo.height - topPad;
        const cropAspect = sw / sh;
        if (cropAspect > frameAspect) {
          const targetW = sh * frameAspect;
          sx = (photo.width - targetW) / 2;
          sw = targetW;
        } else {
          sh = sw / frameAspect;
        }

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.arcTo(x + w, y, x + w, y + h, r);
        ctx.arcTo(x + w, y + h, x, y + h, r);
        ctx.arcTo(x, y + h, x, y, r);
        ctx.arcTo(x, y, x + w, y, r);
        ctx.closePath();
        ctx.clip();
        // giữ màu gốc, chỉ hạ nhẹ độ sáng/bão hòa cho hợp tông nền tối của web
        ctx.filter = "contrast(1.06) brightness(0.94) saturate(0.92)";
        ctx.drawImage(photo, sx, sy, sw, sh, x, y, w, h);
        ctx.filter = "none";

        // vignette nhẹ — tối dần ra mép để ảnh không bị chói giữa nền tối
        const vignette = ctx.createRadialGradient(
          x + w * 0.5,
          y + h * 0.42,
          w * 0.25,
          x + w * 0.5,
          y + h * 0.55,
          w * 0.95
        );
        vignette.addColorStop(0, "rgba(0,0,0,0)");
        vignette.addColorStop(0.7, "rgba(0,0,0,0.08)");
        vignette.addColorStop(1, "rgba(0,0,0,0.32)");
        ctx.globalCompositeOperation = "multiply";
        ctx.fillStyle = vignette;
        ctx.fillRect(x, y, w, h);

        ctx.globalCompositeOperation = "source-over";
        ctx.restore();

        // tên trên thẻ
        ctx.fillStyle = "#111113";
        ctx.font = "800 24px 'Space Grotesk', 'Arial', sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("TRẦN THANH HẢI", 384, 336);

        const t = new THREE.CanvasTexture(c);
        t.flipY = false; // texture GLTF gốc không lật trục Y
        t.colorSpace = THREE.SRGBColorSpace;
        t.anisotropy = 16;
        setTex(t);
      }
    );
    return () => {
      cancelled = true;
    };
  }, []);

  return tex;
}

function Band({
  maxSpeed = 50,
  minSpeed = 10,
  onHover,
}: {
  maxSpeed?: number;
  minSpeed?: number;
  onHover?: (v: boolean) => void;
}) {
  const band = useRef<THREE.Mesh & { geometry: MeshLineGeometry }>(null!);
  const fixed = useRef<RapierRigidBody>(null!);
  const j1 = useRef<RapierRigidBody & { lerped?: THREE.Vector3 }>(null!);
  const j2 = useRef<RapierRigidBody & { lerped?: THREE.Vector3 }>(null!);
  const j3 = useRef<RapierRigidBody>(null!);
  const card = useRef<RapierRigidBody>(null!);

  const vec = useMemo(() => new THREE.Vector3(), []);
  const ang = useMemo(() => new THREE.Vector3(), []);
  const rot = useMemo(() => new THREE.Vector3(), []);
  const dir = useMemo(() => new THREE.Vector3(), []);

  const { nodes, materials } = useGLTF(CARD_GLB) as unknown as {
    nodes: Record<string, THREE.Mesh>;
    materials: Record<string, THREE.MeshPhysicalMaterial>;
  };
  const bandTexture = useTexture(BAND_TEX);
  const cardTexture = useCardTexture();

  const { width, height } = useThree((state) => state.size);
  const [curve] = useState(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
      ])
  );
  const [dragged, drag] = useState<THREE.Vector3 | false>(false);
  const [hovered, hover] = useState(false);

  const segmentProps = {
    type: "dynamic" as const,
    canSleep: true,
    colliders: false as const,
    angularDamping: 4,
    linearDamping: 4,
  };

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]);
  useSphericalJoint(j3, card, [[0, 0, 0], [0, 1.45, 0]]);

  useEffect(() => {
    onHover?.(hovered);
  }, [hovered, onHover]);

  useFrame((state, delta) => {
    if (dragged && card.current) {
      // giữ pointer trong biên khung hình 3D — nhờ setPointerCapture, kéo
      // chuột ra ngoài canvas vẫn báo tọa độ vượt [-1,1], làm thẻ lọt ra
      // ngoài vùng vẽ và bị "cắt". Kẹp lại để thẻ luôn hiện trọn trong khung.
      const px = Math.max(-0.96, Math.min(0.96, state.pointer.x));
      const py = Math.max(-0.85, Math.min(0.92, state.pointer.y));
      vec.set(px, py, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp());
      const ny = vec.y - dragged.y;
      card.current.setNextKinematicTranslation({
        x: vec.x - dragged.x,
        y: ny,
        z: vec.z - dragged.z,
      });
    }
    if (
      fixed.current &&
      j1.current &&
      j2.current &&
      j3.current &&
      card.current
    ) {
      // làm mượt 2 khớp giữa để dây không giật khi kéo căng
      [j1, j2].forEach((ref) => {
        const b = ref.current!;
        if (!b.lerped) b.lerped = new THREE.Vector3().copy(b.translation());
        const clamped = Math.max(
          0.1,
          Math.min(1, b.lerped.distanceTo(b.translation()))
        );
        b.lerped.lerp(
          b.translation(),
          delta * (minSpeed + clamped * (maxSpeed - minSpeed))
        );
      });
      curve.points[0].copy(j3.current.translation());
      curve.points[1].copy(j2.current.lerped!);
      curve.points[2].copy(j1.current.lerped!);
      curve.points[3].copy(fixed.current.translation());
      band.current?.geometry?.setPoints(curve.getPoints(32));
      // kéo thẻ quay mặt về phía màn hình
      ang.copy(card.current.angvel());
      rot.copy(card.current.rotation());
      card.current.setAngvel(
        { x: ang.x, y: ang.y - rot.y * 0.45, z: ang.z },
        true
      );
    }
  });

  curve.curveType = "chordal";
  bandTexture.wrapS = bandTexture.wrapT = THREE.RepeatWrapping;

  return (
    <>
      {/* dịch cả bộ dây+thẻ sang phải vì khung 3D giờ trải toàn màn hình,
          giữ vị trí nghỉ của thẻ nằm bên phải như thiết kế ban đầu */}
      <group position={[2.6, 4, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        <RigidBody position={[0.5, 0, 0]} ref={j1} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1, 0, 0]} ref={j2} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1.5, 0, 0]} ref={j3} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>

        <RigidBody
          position={[2, 0, 0]}
          ref={card}
          {...segmentProps}
          type={dragged ? "kinematicPosition" : "dynamic"}
        >
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
          <group
            scale={2.25}
            position={[0, -1.2, -0.05]}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={(e) => {
              (e.target as Element).releasePointerCapture(e.pointerId);
              drag(false);
            }}
            onPointerDown={(e) => {
              (e.target as Element).setPointerCapture(e.pointerId);
              drag(
                new THREE.Vector3()
                  .copy(e.point)
                  .sub(vec.copy(card.current.translation()))
              );
            }}
          >
            <mesh geometry={nodes.card.geometry}>
              <meshPhysicalMaterial
                map={cardTexture ?? materials.base.map}
                map-anisotropy={16}
                clearcoat={1}
                clearcoatRoughness={0.15}
                roughness={0.3}
                metalness={0.5}
              />
            </mesh>
            <mesh geometry={nodes.clip.geometry} material={materials.metal} />
            <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
          </group>
        </RigidBody>
      </group>

      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial
          args={[{ resolution: new THREE.Vector2(width, height) }]}
          transparent
          opacity={0.9}
          color="white"
          depthTest={false}
          resolution={[width, height]}
          useMap={1}
          map={bandTexture}
          repeat={[-4, 1]}
          lineWidth={1}
        />
      </mesh>
    </>
  );
}

export default function Lanyard3D() {
  const wrapRef = useRef<HTMLDivElement>(null);
  return (
    <div ref={wrapRef} className="relative h-full w-full">
      <Canvas
        camera={{ position: [0, 1.3, 13], fov: 25 }}
        gl={{ alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={Math.PI} />
        <Suspense fallback={null}>
          <Physics interpolate gravity={[0, -40, 0]} timeStep={1 / 60}>
            <Band
              onHover={(v) => {
                if (!wrapRef.current) return;
                if (v) wrapRef.current.setAttribute("data-cursor", "hover");
                else wrapRef.current.removeAttribute("data-cursor");
              }}
            />
          </Physics>
          <Environment blur={0.75}>
            <Lightformer
              intensity={2}
              color="white"
              position={[0, -1, 5]}
              rotation={[0, 0, Math.PI / 3]}
              scale={[100, 0.1, 1]}
            />
            <Lightformer
              intensity={3}
              color="white"
              position={[-1, -1, 1]}
              rotation={[0, 0, Math.PI / 3]}
              scale={[100, 0.1, 1]}
            />
            <Lightformer
              intensity={3}
              color="white"
              position={[1, 1, 1]}
              rotation={[0, 0, Math.PI / 3]}
              scale={[100, 0.1, 1]}
            />
            <Lightformer
              intensity={10}
              color="white"
              position={[-10, 0, 14]}
              rotation={[0, Math.PI / 2, Math.PI / 3]}
              scale={[100, 10, 1]}
            />
          </Environment>
        </Suspense>
      </Canvas>
    </div>
  );
}
