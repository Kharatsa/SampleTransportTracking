export const getDisplayName = Component => {
  if (Component) {
    return Component.displayName || Component.name || 'Component';
  }
  return 'UndefinedComponent';
};

export const NullComponent = () => null;
