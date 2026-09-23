import type { StackNode } from '../types'

interface DetailPanelProps {
  node: StackNode | null
  allNodes: StackNode[]
  onClose: () => void
}

const RADIUS = 40
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export default function DetailPanel({ node, allNodes, onClose }: DetailPanelProps) {
  const linkCount = (node?.connections.length ?? 0) + (node?.components?.length ?? 0)
  const ratio = allNodes.length > 0 ? linkCount / allNodes.length : 0
  const dashOffset = CIRCUMFERENCE * (1 - ratio)
  const connectedLabels = node
    ? node.connections
        .map((id) => allNodes.find((candidate) => candidate.id === id)?.label)
        .filter((label): label is string => Boolean(label))
    : []
  const componentLabels = node?.components
    ? node.components
        .map((id) => allNodes.find((candidate) => candidate.id === id)?.label)
        .filter((label): label is string => Boolean(label))
    : []
  const usedBy = node
    ? allNodes.filter((candidate) => candidate.components?.includes(node.id)).map((candidate) => candidate.label)
    : []

  return (
    <aside className={`detail-panel ${node ? 'detail-panel--open' : ''}`}>
      {node && (
        <>
          <button className="detail-panel__close" onClick={onClose} aria-label="Close">
            ×
          </button>
          <div className="detail-panel__title">
            <span className="detail-panel__icon">{node.icon}</span>
            <h2>{node.label}</h2>
          </div>
          <p className="detail-panel__description">{node.description}</p>

          {componentLabels.length > 0 && (
            <>
              <h3>Built from</h3>
              <ul className="detail-panel__components">
                {componentLabels.map((label) => (
                  <li key={label}>{label}</li>
                ))}
              </ul>
            </>
          )}

          {usedBy.length > 0 && (
            <>
              <h3>Used by</h3>
              <ul className="detail-panel__components">
                {usedBy.map((label) => (
                  <li key={label}>{label}</li>
                ))}
              </ul>
            </>
          )}

          {node.howItWorks && node.howItWorks.length > 0 && (
            <>
              <h3>How it works</h3>
              <div className="detail-panel__flow">
                {node.howItWorks.map((step, index) => (
                  <div key={step} className="detail-panel__flow-step-wrapper">
                    <div className="detail-panel__flow-step">{step}</div>
                    {index < node.howItWorks!.length - 1 && <div className="detail-panel__flow-arrow">↓</div>}
                  </div>
                ))}
              </div>
            </>
          )}

          <div className="detail-panel__gauge">
            <svg width="120" height="120" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r={RADIUS} stroke="#e5e7eb" strokeWidth="10" fill="none" />
              <circle
                className="detail-panel__gauge-ring"
                cx="60"
                cy="60"
                r={RADIUS}
                stroke="#38bdf8"
                strokeWidth="10"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={dashOffset}
                transform="rotate(-90 60 60)"
              />
            </svg>
            <span className="detail-panel__gauge-label">{linkCount} links</span>
          </div>

          <div className="detail-panel__tags">
            {node.tags.map((tag) => (
              <span key={tag} className="detail-panel__tag">
                {tag}
              </span>
            ))}
          </div>

          {node.companies.length > 0 && (
            <>
              <h3>Companies in this space</h3>
              <ul className="detail-panel__companies">
                {node.companies.map((company) => (
                  <li key={company}>{company}</li>
                ))}
              </ul>
            </>
          )}

          {connectedLabels.length > 0 && (
            <>
              <h3>Connects to</h3>
              <ul className="detail-panel__connections">
                {connectedLabels.map((label) => (
                  <li key={label}>{label}</li>
                ))}
              </ul>
            </>
          )}
        </>
      )}
    </aside>
  )
}
