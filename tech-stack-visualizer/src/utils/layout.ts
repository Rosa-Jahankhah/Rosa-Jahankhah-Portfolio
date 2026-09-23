import type { StackLayer, StackNode } from '../types'

export type NodePositions = Record<string, [number, number, number]>

const RADIUS = 3.5

export const CYLINDER_AXIS = { x: 7, z: 0 }
export const CYLINDER_RADIUS = 1.2

export function computeNodePositions(layers: StackLayer[], nodes: StackNode[]): NodePositions {
  const layerById = new Map(layers.map((layer) => [layer.id, layer]))
  const grouped = new Map<string, StackNode[]>()

  for (const node of nodes) {
    const group = grouped.get(node.layerId) ?? []
    group.push(node)
    grouped.set(node.layerId, group)
  }

  const positions: NodePositions = {}
  for (const [layerId, layerNodes] of grouped) {
    const layer = layerById.get(layerId)
    if (!layer) continue

    if (layer.shape === 'cylinder') {
      layerNodes.forEach((node, index) => {
        const angle = layerNodes.length > 1 ? (index / layerNodes.length) * Math.PI * 2 : 0
        positions[node.id] = [
          CYLINDER_AXIS.x + Math.cos(angle) * CYLINDER_RADIUS,
          layer.y,
          CYLINDER_AXIS.z + Math.sin(angle) * CYLINDER_RADIUS,
        ]
      })
    } else {
      layerNodes.forEach((node, index) => {
        const angle = (index / layerNodes.length) * Math.PI * 2
        positions[node.id] = [Math.cos(angle) * RADIUS, layer.y, Math.sin(angle) * RADIUS]
      })
    }
  }

  return positions
}
