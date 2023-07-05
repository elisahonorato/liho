import theme from '../Theme/Theme';

const SetGuiStyles = (element) => {
  const styles = {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.fontSize,
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.text.primary,
  };

  Object.keys(styles).forEach((property) => {
    element.style[property] = styles[property];
  });

  const childElements = element.querySelectorAll('*');
  childElements.forEach((child) => {
    child.style.fontFamily = theme.typography.fontFamily;
    SetGuiStyles(child);
  });
};

export default SetGuiStyles;