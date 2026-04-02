import { v4 as uuidv4 } from 'uuid';

export const initialApps = [
  {
    id: uuidv4(),
    name: 'AWS EC2',
    description: 'Scalable compute capacity in the AWS cloud.',
    category: 'Compute',
    version: '1.0.0',
    tags: ['aws', 'infrastructure', 'server'],
    dependencies: [],
    usageCount: 154,
    createdAt: new Date('2025-01-10').toISOString(),
  },
  {
    id: uuidv4(),
    name: 'Datadog',
    description: 'Monitoring service for cloud-scale applications.',
    category: 'Monitoring',
    version: '2.5.1',
    tags: ['logs', 'metrics', 'tracing'],
    dependencies: [],
    usageCount: 89,
    createdAt: new Date('2025-02-15').toISOString(),
  },
  {
    id: uuidv4(),
    name: 'Jira Software',
    description: 'Project and issue tracking software.',
    category: 'Productivity',
    version: '8.21.0',
    tags: ['agile', 'tickets', 'planning'],
    dependencies: [],
    usageCount: 420,
    createdAt: new Date('2024-11-05').toISOString(),
  },
  {
    id: uuidv4(),
    name: 'Slack',
    description: 'Business communication platform.',
    category: 'Productivity',
    version: '4.35',
    tags: ['chat', 'communication', 'team'],
    dependencies: [],
    usageCount: 500,
    createdAt: new Date('2024-10-12').toISOString(),
  },
  {
    id: uuidv4(),
    name: 'Terraform',
    description: 'Infrastructure as Code tool for building, changing, and versioning infrastructure.',
    category: 'Infrastructure',
    version: '1.3.0',
    tags: ['iac', 'deployment', 'automation'],
    dependencies: ['AWS EC2'], // Mock dependency reference
    usageCount: 75,
    createdAt: new Date('2025-03-01').toISOString(),
  },
  {
    id: uuidv4(),
    name: 'MongoDB Atlas',
    description: 'Multi-cloud database service.',
    category: 'Database',
    version: '6.0.4',
    tags: ['nosql', 'storage', 'document'],
    dependencies: [],
    usageCount: 112,
    createdAt: new Date('2025-01-20').toISOString(),
  },
  {
    id: uuidv4(),
    name: 'GitHub Enterprise',
    description: 'Version control and collaboration platform.',
    category: 'Development',
    version: '3.7.0',
    tags: ['git', 'vcs', 'code'],
    dependencies: [],
    usageCount: 380,
    createdAt: new Date('2024-09-10').toISOString(),
  }
];

export const CATEGORIES = [
  'Compute', 'Database', 'Storage', 'Monitoring', 'Productivity', 'Security', 'Development', 'Infrastructure', 'Other'
];
