export const getBackgroundImage = (screenSize: 'desktop' | 'tablet' | 'mobile') => {
    switch (screenSize) {
      case 'desktop':
        return '/images/street-bg.svg';
      case 'tablet':
        return '/images/street-bg.svg';
      case 'mobile':
        return '/images/street-bg.svg';
      default:
        return '/images/street-bg.svg';
    }
  };
  