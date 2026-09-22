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

const OVERVIEW_POSITION = new Vector3(13, 13, 18)
const OVERVIEW_TARGET = new Vector3(0, 6, 0)

function CameraRig({ focusPosition }: { focusPosition: [number, number, number] | null }) {
  const controlsRef = useRef<OrbitControlsImpl>(null)
  const desiredPosition = useRef(new Vector3())
  const desiredTarget = useRef(new Vector3())

  useFrame(({ camera }) => {
    const controls = controlsRef.current
    if (!controls) return

    if (focusPosition) {
      desiredPosition.current.set(focusPosition[0] * 1.6, focusPosition[1] + 3, focusPosition[2] * 1.6)
      desiredTarget.current.set(...focusPosition)
    } else {
      desiredPosition.current.copy(OVERVIEW_POSITION)
      desiredTarget.current.copy(OVERVIEW_TARGET)
    }

    camera.position.lerp(desiredPosition.current, 0.06)
    controls.target.lerp(desiredTarget.current, 0.06)
    controls.update()
  })

  return <OrbitControls ref={controlsRef} enableDamping dampingFactor={0.08} minDistance={4} maxDistance={30} />
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

      {nodes.map((node) => (
        <NodeMesh
          key={node.id}
          node={node}
          position={positions[node.id]}
          color={layerColorById.get(node.layerId) ?? '#334155'}
          isSelected={selectedNode?.id === node.id}
          onSelect={onSelectNode}
        />
      ))}
    </Canvas>
  )
}
