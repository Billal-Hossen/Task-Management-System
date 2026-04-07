/**
 * Global error handler for unhandled promise rejections
 */
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);

    // Prevent the default browser error handling
    event.preventDefault();

    // You can send this to an error tracking service here
    // For now, just log it
  });

  window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
  });
}

/**
 * Safe async wrapper that prevents unhandled rejections
 */
export function safeAsync<T>(
  promise: Promise<T>,
  fallback?: T
): Promise<T | undefined> {
  return promise.catch((error) => {
    console.error('Async error caught:', error);
    return fallback;
  });
}

/**
 * Safe function wrapper that prevents errors from propagating
 */
export function safeFn<T extends (...args: any[]) => any>(
  fn: T,
  fallback?: ReturnType<T>
): T {
  return ((...args: Parameters<T>) => {
    try {
      const result = fn(...args);
      // If it's a promise, catch any rejections
      if (result instanceof Promise) {
        return result.catch((error) => {
          console.error('Promise error caught in safeFn:', error);
          return fallback;
        });
      }
      return result;
    } catch (error) {
      console.error('Sync error caught in safeFn:', error);
      return fallback;
    }
  }) as T;
}
