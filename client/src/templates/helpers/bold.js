import Handlebars from 'handlebars';

export default (text) => {
  const escapedText = Handlebars.escapeExpression(text);
  return text !== '' ? new Handlebars.SafeString(`<strong>${escapedText}</strong>`) : '';
};
