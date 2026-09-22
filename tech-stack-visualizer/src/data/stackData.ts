import type { StackLayer, StackNode } from '../types'

export const layers: StackLayer[] = [
  { id: 'infra', label: 'Infrastructure', color: '#4b5563', y: 0 },
  { id: 'data', label: 'Data & Storage', color: '#2563eb', y: 3 },
  { id: 'backend', label: 'Backend & APIs', color: '#7c3aed', y: 6 },
  { id: 'frontend', label: 'Frontend & Product', color: '#db2777', y: 9 },
  { id: 'users', label: 'Users & Market', color: '#f59e0b', y: 12 },
]

export const nodes: StackNode[] = [
  {
    id: 'cloud',
    label: 'Cloud Hosting',
    layerId: 'infra',
    description: 'Compute, networking, and deployment target for every service above it.',
    tags: ['AWS', 'GCP', 'Kubernetes'],
    connections: ['database', 'api'],
  },
  {
    id: 'cicd',
    label: 'CI/CD',
    layerId: 'infra',
    description: 'Automates build, test, and deploy pipelines for the whole stack.',
    tags: ['GitHub Actions', 'Docker'],
    connections: ['api', 'webapp'],
  },
  {
    id: 'database',
    label: 'Database',
    layerId: 'data',
    description: 'Persists structured application state and business data.',
    tags: ['Postgres', 'Redis'],
    connections: ['api', 'pipeline'],
  },
  {
    id: 'pipeline',
    label: 'Data Pipeline',
    layerId: 'data',
    description: 'Moves and transforms data between sources, storage, and models.',
    tags: ['ETL', 'Airflow'],
    connections: ['ml', 'database'],
  },
  {
    id: 'api',
    label: 'API Layer',
    layerId: 'backend',
    description: 'Business logic and service boundary between data and product.',
    tags: ['REST', 'GraphQL'],
    connections: ['webapp', 'database', 'ml'],
  },
  {
    id: 'ml',
    label: 'ML Services',
    layerId: 'backend',
    description: 'Model inference and training jobs consumed by the API layer.',
    tags: ['PyTorch', 'MLOps'],
    connections: ['api', 'pipeline'],
  },
  {
    id: 'webapp',
    label: 'Web App',
    layerId: 'frontend',
    description: 'Customer-facing interface that talks to the API layer.',
    tags: ['React', 'TypeScript'],
    connections: ['api', 'customers'],
  },
  {
    id: 'mobile',
    label: 'Mobile App',
    layerId: 'frontend',
    description: 'Native client sharing the same API surface as the web app.',
    tags: ['iOS', 'Android'],
    connections: ['api', 'customers'],
  },
  {
    id: 'customers',
    label: 'Customers',
    layerId: 'users',
    description: 'The market segment the product is built for, generating usage and revenue signal back into the stack.',
    tags: ['B2B', 'B2C'],
    connections: ['webapp', 'mobile'],
  },
]
