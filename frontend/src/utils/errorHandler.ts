// Error handling utilities - Consistent error handling across app

export const handleApiError = (error: any, context: string = 'Operation') => {
  // Silently ignore authentication token errors (happens during logout)
  if (error?.message === 'No authentication token') {
    return;
  }

  // Log error for debugging
  console.error(`${context} error:`, error);

  // Show user-friendly message
  const errorMessage = error?.message || `${context} failed`;
  alert(errorMessage);
};

export const isAuthError = (error: any): boolean => {
  return error?.message === 'No authentication token';
};

export const getErrorMessage = (error: any, fallback: string = 'An error occurred'): string => {
  return error?.message || fallback;
};
