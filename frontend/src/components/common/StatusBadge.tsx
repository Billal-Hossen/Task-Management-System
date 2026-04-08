// Reusable StatusBadge component - Exact same styling and behavior as inline code
'use client';

import { getStatusBadgeStyle } from '@/utils/statusHelpers';

interface StatusBadgeProps {
  status?: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const badge = getStatusBadgeStyle(status || '');

  return (
    <span
      className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
      style={badge.style}
    >
      {badge.label || status || 'Unknown'}
    </span>
  );
}
