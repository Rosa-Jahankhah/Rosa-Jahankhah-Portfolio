import { useState } from 'react'
import Scene from './components/Scene'
import DetailPanel from './components/DetailPanel'
import { nodes } from './data/stackData'
import type { StackNode } from './types'
import './App.css'

export default function App() {
  const [selectedNode, setSelectedNode] = useState<StackNode | null>(null)

  return (
    <div className="app">
      <header className="app-header">
        <h1>Tech Stack Visualizer</h1>
        <p>Drag to orbit, scroll to zoom, click a node to explore it.</p>
      </header>
      <Scene selectedNode={selectedNode} onSelectNode={setSelectedNode} />
      <DetailPanel node={selectedNode} allNodes={nodes} onClose={() => setSelectedNode(null)} />
    </div>
  )
}
