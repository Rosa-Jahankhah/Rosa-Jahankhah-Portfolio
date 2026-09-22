export interface StackLayer {
  id: string
  label: string
  color: string
  y: number
}

export interface StackNode {
  id: string
  label: string
  layerId: string
  description: string
  tags: string[]
  connections: string[]
}
