export interface StackLayer {
  id: string
  label: string
  color: string
  y: number
  shape?: 'ring' | 'cylinder'
}

export interface StackNode {
  id: string
  label: string
  icon: string
  layerId: string
  description: string
  tags: string[]
  companies: string[]
  howItWorks?: string[]
  connections: string[]
  components?: string[]
}
