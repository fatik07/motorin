import { COLORS } from '@constants/theme';

/**
 * Returns the color associated with a component status
 * @param status The status of the component ('good', 'warning', 'critical')
 * @returns Hex color string
 */
export const getStatusColor = (status: 'good' | 'warning' | 'critical') => {
  switch (status) {
    case 'good':
      return COLORS.success;
    case 'warning':
      return COLORS.warning;
    case 'critical':
      return COLORS.error;
    default:
      return COLORS.textSecondary;
  }
};

/**
 * Returns the text description for the remaining distance
 * @param remainingKm The remaining kilometers
 * @returns Formatted string
 */
export const getStatusText = (remainingKm: number) => {
  if (remainingKm <= 0) {
    return 'SEGERA GANTI';
  }
  
  // Format with dots for thousands separator (Indonesian style)
  const formattedKm = remainingKm.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${formattedKm} KM LAGI`;
};
