function isAttributePresent(arrAttributes, attributeName) {
  if (!arrAttributes || (Array.isArray(arrAttributes) && arrAttributes.length === 0)) {
    return false;
  }
  return arrAttributes.find((attribute) =>{
    if (attribute.directive) {
      return attribute.key.name.name === attributeName || (attribute.key.argument && attribute.key.argument.name === attributeName)
    }
    return attribute.key.name === attributeName
  }
  );
}

function getWholeObjectName(nodeObject, modelName) {

  if (nodeObject.object) {
    modelName = getWholeObjectName(nodeObject.object, modelName);
    modelName = `${modelName}.${nodeObject.property.name || nodeObject.property.value}`;
    return modelName;
  }

  modelName = `${nodeObject.name}`;
  return modelName;
}

function getVModelKey(modelExpression) {
  if (modelExpression.object) {
    return `${getWholeObjectName(modelExpression.object, '')}.${modelExpression.property.name || modelExpression.property.value}`;
  }
  return modelExpression.name;
}

function defineTemplateBodyVisitor(
  context,
  templateBodyVisitor,
  scriptVisitor
) {
  if (context.parserServices.defineTemplateBodyVisitor == null) {
    const filename = context.getFilename()
    if (path.extname(filename) === '.vue') {
      context.report({
        loc: { line: 1, column: 0 },
        message:
          'Use the latest vue-eslint-parser. See also https://eslint.vuejs.org/user-guide/#what-is-the-use-the-latest-vue-eslint-parser-error.'
      })
    }
    return {}
  }
  return context.parserServices.defineTemplateBodyVisitor(
    templateBodyVisitor,
    scriptVisitor
  )
}

module.exports = {
  isAttributePresent,
  getVModelKey,
  defineTemplateBodyVisitor,
}
