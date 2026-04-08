// Status helper utilities - Exact same logic, just extracted for reuse

import { STATUS_CONFIG, STATUS_LABELS, VALID_TRANSITIONS } from '@/constants/status';

export const getStatusLabel = (status: string): string => {
  return STATUS_LABELS[status] || status;
};

export const getStatusBadgeStyle = (status: string) => {
  const config = STATUS_CONFIG[status];
  if (!config) {
    return {
      label: status,
      style: {
        backgroundColor: '#e5e7eb',
        color: '#374151',
      },
    };
  }

  return {
    label: config.label,
    style: {
      backgroundColor: config.backgroundColor,
      color: config.color,
    },
  };
};

export const getValidTransitions = (currentStatus: string): Array<{ status: string; label: string }> => {
  const validStatuses = VALID_TRANSITIONS[currentStatus] || [];
  return validStatuses.map(status => ({
    status,
    label: STATUS_LABELS[status] || status,
  }));
};

export const canTransitionTo = (fromStatus: string, toStatus: string): boolean => {
  const validTransitions = VALID_TRANSITIONS[fromStatus] || [];
  return validTransitions.includes(toStatus);
};
