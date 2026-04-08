// Button style utilities - Reusable button styling logic

export const getButtonStyle = (variant: 'primary' | 'danger' = 'primary') => {
  const styles = {
    primary: {
      backgroundColor: '#2563eb',
      hoverBackgroundColor: '#1d4ed8',
      color: '#ffffff',
    },
    danger: {
      backgroundColor: '#ef4444',
      hoverBackgroundColor: '#dc2626',
      color: '#ffffff',
    },
  };

  return styles[variant];
};

export const getButtonMouseHandlers = (variant: 'primary' | 'danger' = 'primary') => {
  const style = getButtonStyle(variant);

  return {
    onMouseEnter: (e: React.MouseEvent<HTMLButtonElement>) => {
      if (e.currentTarget) {
        e.currentTarget.style.backgroundColor = style.hoverBackgroundColor;
      }
    },
    onMouseLeave: (e: React.MouseEvent<HTMLButtonElement>) => {
      if (e.currentTarget) {
        e.currentTarget.style.backgroundColor = style.backgroundColor;
      }
    },
  };
};
