import type { StackLayer, StackNode } from '../types'

export type NodePositions = Record<string, [number, number, number]>

const RADIUS = 3.5

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
    layerNodes.forEach((node, index) => {
      const angle = (index / layerNodes.length) * Math.PI * 2
      positions[node.id] = [Math.cos(angle) * RADIUS, layer.y, Math.sin(angle) * RADIUS]
    })
  }

  return positions
}
