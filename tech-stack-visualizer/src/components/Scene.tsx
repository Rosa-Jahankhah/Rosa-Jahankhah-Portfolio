import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Html, Line, OrbitControls } from '@react-three/drei'
import { DoubleSide, Vector3 } from 'three'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import { layers, nodes } from '../data/stackData'
import { computeNodePositions } from '../utils/layout'
import NodeMesh from './NodeMesh'
import type { StackNode } from '../types'

interface SceneProps {
  selectedNode: StackNode | null
  onSelectNode: (node: StackNode) => void
}

const OVERVIEW_POSITION = new Vector3(15, 16, 22)
const OVERVIEW_TARGET = new Vector3(0, 7.5, 0)

const FOCUS_ANIMATION_SECONDS = 0.8

function CameraRig({ focusPosition }: { focusPosition: [number, number, number] | null }) {
  const controlsRef = useRef<OrbitControlsImpl>(null)
  const focusKeyRef = useRef<string | null>('__initial__')
  const animationRef = useRef({
    active: false,
    startTime: 0,
    fromPosition: new Vector3(),
    fromTarget: new Vector3(),
    toPosition: new Vector3(),
    toTarget: new Vector3(),
  })

  useFrame(({ camera, clock }) => {
    const controls = controlsRef.current
    if (!controls) return

    const focusKey = focusPosition ? focusPosition.join(',') : 'overview'
    if (focusKey !== focusKeyRef.current) {
      focusKeyRef.current = focusKey
      const anim = animationRef.current
      anim.active = true
      anim.startTime = clock.getElapsedTime()
      anim.fromPosition.copy(camera.position)
      anim.fromTarget.copy(controls.target)
      if (focusPosition) {
        anim.toPosition.set(focusPosition[0] * 1.6, focusPosition[1] + 3, focusPosition[2] * 1.6)
        anim.toTarget.set(...focusPosition)
      } else {
        anim.toPosition.copy(OVERVIEW_POSITION)
        anim.toTarget.copy(OVERVIEW_TARGET)
      }
    }

    const anim = animationRef.current
    if (!anim.active) return

    const elapsed = clock.getElapsedTime() - anim.startTime
    const t = Math.min(elapsed / FOCUS_ANIMATION_SECONDS, 1)
    const eased = 1 - Math.pow(1 - t, 3)
    camera.position.lerpVectors(anim.fromPosition, anim.toPosition, eased)
    controls.target.lerpVectors(anim.fromTarget, anim.toTarget, eased)
    controls.update()
    if (t >= 1) anim.active = false
  })

  return <OrbitControls ref={controlsRef} enableDamping dampingFactor={0.08} minDistance={4} maxDistance={36} />
}

export default function Scene({ selectedNode, onSelectNode }: SceneProps) {
  const positions = computeNodePositions(layers, nodes)
  const layerColorById = new Map(layers.map((layer) => [layer.id, layer.color]))

  const edges: { key: string; from: [number, number, number]; to: [number, number, number] }[] = []
  const seenEdges = new Set<string>()
  for (const node of nodes) {
    for (const targetId of node.connections) {
      const key = [node.id, targetId].sort().join('__')
      if (seenEdges.has(key)) continue
      seenEdges.add(key)
      const from = positions[node.id]
      const to = positions[targetId]
      if (from && to) edges.push({ key, from, to })
    }
  }

  const componentEdges: { key: string; from: [number, number, number]; to: [number, number, number] }[] = []
  for (const node of nodes) {
    if (!node.components) continue
    for (const componentId of node.components) {
      const from = positions[node.id]
      const to = positions[componentId]
      if (from && to) componentEdges.push({ key: `${node.id}__${componentId}`, from, to })
    }
  }

  return (
    <Canvas camera={{ position: OVERVIEW_POSITION.toArray(), fov: 50 }}>
      <color attach="background" args={['#ffffff']} />
      <ambientLight intensity={0.9} />
      <pointLight position={[10, 18, 10]} intensity={1} />
      <CameraRig focusPosition={selectedNode ? positions[selectedNode.id] : null} />

      {layers.map((layer) => (
        <group key={layer.id} position={[0, layer.y, 0]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[3.3, 3.7, 64]} />
            <meshBasicMaterial color={layer.color} transparent opacity={0.35} side={DoubleSide} />
          </mesh>
          <Html position={[-5.8, 0, 0]} center distanceFactor={14}>
            <div className="layer-label" style={{ borderColor: layer.color }}>
              {layer.label}
            </div>
          </Html>
        </group>
      ))}

      {edges.map((edge) => (
        <Line key={edge.key} points={[edge.from, edge.to]} color="#64748b" lineWidth={1} transparent opacity={0.5} />
      ))}

      {componentEdges.map((edge) => (
        <Line
          key={edge.key}
          points={[edge.from, edge.to]}
          color="#0d9488"
          lineWidth={1.5}
          dashed
          dashSize={0.15}
          gapSize={0.1}
          transparent
          opacity={0.6}
        />
      ))}

      {nodes.map((node) => (
        <NodeMesh
          key={node.id}
          node={node}
          position={positions[node.id]}
          color={layerColorById.get(node.layerId) ?? '#334155'}
          isSelected={selectedNode?.id === node.id}
          isProduct={node.layerId === 'products'}
          onSelect={onSelectNode}
        />
      ))}
    </Canvas>
  )
}
