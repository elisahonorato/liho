import { useEffect } from 'react';
import theme from '../../../Theme/Theme';

const GuiStyleComponent = ({ element}) => {
  useEffect(() => {
    if (element && element.domElement) {
      element.domElement.style.setProperty('font-family', theme.typography.fontFamily);
      element.domElement.style.setProperty('line-height', theme.typography.p.lineHeight);
    }
  }, [element, theme]);

  return null;
};

export default GuiStyleComponent;



