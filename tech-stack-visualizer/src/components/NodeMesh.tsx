import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import type { Mesh } from 'three'
import type { StackNode } from '../types'

interface NodeMeshProps {
  node: StackNode
  position: [number, number, number]
  color: string
  isSelected: boolean
  isProduct: boolean
  onSelect: (node: StackNode) => void
}

export default function NodeMesh({ node, position, color, isSelected, isProduct, onSelect }: NodeMeshProps) {
  const meshRef = useRef<Mesh>(null)
  const [hovered, setHovered] = useState(false)

  useFrame(() => {
    const mesh = meshRef.current
    if (!mesh) return
    const targetScale = isSelected ? 1.5 : hovered ? 1.2 : 1
    mesh.scale.lerp({ x: targetScale, y: targetScale, z: targetScale } as never, 0.15)
  })

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onClick={(event) => {
          event.stopPropagation()
          onSelect(node)
        }}
        onPointerOver={(event) => {
          event.stopPropagation()
          setHovered(true)
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          setHovered(false)
          document.body.style.cursor = 'auto'
        }}
      >
        {isProduct ? <boxGeometry args={[0.65, 0.65, 0.65]} /> : <sphereGeometry args={[0.4, 32, 32]} />}
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isSelected ? 0.9 : hovered ? 0.5 : 0.2}
        />
      </mesh>
      <Html distanceFactor={12} position={[0, 0.7, 0]} center>
        <div className={`node-label ${isSelected ? 'node-label--active' : ''}`}>
          <span className="node-label__icon">{node.icon}</span>
          {node.label}
        </div>
      </Html>
      {node.companies.length > 0 && (
        <Html distanceFactor={12} position={[0, -0.7, 0]} center>
          <div className="company-cluster">
            {node.companies.map((company) => (
              <span key={company} className="company-pill">
                {company}
              </span>
            ))}
          </div>
        </Html>
      )}
    </group>
  )
}
