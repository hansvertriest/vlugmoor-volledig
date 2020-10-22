import Handlebars from 'handlebars';

export default (page, text, cssClass = '') => {
  const escapedPage = Handlebars.escapeExpression(page);
  const escapedText = Handlebars.escapeExpression(text);
  const escapedCssClass = !cssClass || typeof cssClass !== 'string' ? '' : Handlebars.escapeExpression(cssClass);
  return text !== '' ? new Handlebars.SafeString(`<a href="/${escapedPage}" ${escapedCssClass !== '' ? `class="${escapedCssClass}"` : ''} data-navigo>${escapedText}</a>`) : '';
};