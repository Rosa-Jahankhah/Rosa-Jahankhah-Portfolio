import { Canvas } from '@react-three/fiber'
import { Html, Line, OrbitControls } from '@react-three/drei'
import { DoubleSide } from 'three'
import { layers, nodes } from '../data/stackData'
import { computeNodePositions } from '../utils/layout'
import NodeMesh from './NodeMesh'
import type { StackNode } from '../types'

interface SceneProps {
  selectedNode: StackNode | null
  onSelectNode: (node: StackNode) => void
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
    <Canvas camera={{ position: [11, 11, 15], fov: 50 }}>
      <color attach="background" args={['#0b0f19']} />
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 16, 10]} intensity={1.2} />
      <OrbitControls enableDamping dampingFactor={0.08} minDistance={6} maxDistance={30} />

      {layers.map((layer) => (
        <group key={layer.id} position={[0, layer.y, 0]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[3.3, 3.7, 64]} />
            <meshBasicMaterial color={layer.color} transparent opacity={0.25} side={DoubleSide} />
          </mesh>
          <Html position={[-5.8, 0, 0]} center distanceFactor={14}>
            <div className="layer-label" style={{ borderColor: layer.color }}>
              {layer.label}
            </div>
          </Html>
        </group>
      ))}

      {edges.map((edge) => (
        <Line key={edge.key} points={[edge.from, edge.to]} color="#94a3b8" lineWidth={1} transparent opacity={0.45} />
      ))}

      {nodes.map((node) => (
        <NodeMesh
          key={node.id}
          node={node}
          position={positions[node.id]}
          color={layerColorById.get(node.layerId) ?? '#ffffff'}
          isSelected={selectedNode?.id === node.id}
          onSelect={onSelectNode}
        />
      ))}
    </Canvas>
  )
}
