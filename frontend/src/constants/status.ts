// Status constants and mappings - NO logic changes, just organization

export const STATUS_LABELS: Record<string, string> = {
  TODO: 'Todo',
  PENDING: 'Pending',
  PROCESSING: 'In Progress',
  DONE: 'Done',
};

export const STATUS_CONFIG: Record<string, { label: string; color: string; backgroundColor: string }> = {
  TODO: {
    label: 'Todo',
    color: '#065f46',
    backgroundColor: '#d1fae5',
  },
  PENDING: {
    label: 'Pending',
    color: '#92400e',
    backgroundColor: '#fef3c7',
  },
  PROCESSING: {
    label: 'In Progress',
    color: '#1e40af',
    backgroundColor: '#bfdbfe',
  },
  DONE: {
    label: 'Done',
    color: '#065f46',
    backgroundColor: '#d1fae5',
  },
};

export const VALID_TRANSITIONS: Record<string, string[]> = {
  TODO: ['PROCESSING'],
  PROCESSING: ['DONE', 'TODO'],
  DONE: ['PROCESSING'],
  PENDING: ['TODO'],
};
