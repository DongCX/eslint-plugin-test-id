/**
 * @fileoverview Rule to check data-testid
 * @author Prashant Swami
 */

"use strict";

const { DATA_TEST_ID_KEY } = require('@dongcx0319/eslint-plugin-testid/lib/Enums')
const { isAttributePresent, getVModelKey, defineTemplateBodyVisitor } = require('@dongcx0319/eslint-plugin-testid/lib/utils')

function reportForVModel(context, node, firstToken, vModelKey) {
  context.report({
    node,
    loc: firstToken.loc,
    message: `Expected '${DATA_TEST_ID_KEY}' with v-model.`,
    fix: fixer => fixer.insertTextAfter(firstToken, ` ${DATA_TEST_ID_KEY}="${vModelKey}"`)
  })
}


//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------
module.exports = {
  meta: {
    type: "problem",

    docs: {
      description: `Add ${DATA_TEST_ID_KEY} for tag`,
      category: "Best Practices",
      recommended: true,
    },
    fixable: "code",
    schema: [
      {
        enum: ['always', 'never']
      }
    ]
  },

  create: function (context) {
    const template =
      context.parserServices.getTemplateBodyTokenStore &&
      context.parserServices.getTemplateBodyTokenStore()

    return defineTemplateBodyVisitor(context, {
      VElement(node) {
        const attributes = node.startTag.attributes;
        if (!attributes || Array.isArray(attributes) && attributes.length === 0) return
        if (isAttributePresent(attributes, DATA_TEST_ID_KEY)) return

        const firstToken = template.getFirstToken(node)

        /**
         * V-model check
         */

        const isModelPresent = isAttributePresent(attributes, 'model')
        if (!isModelPresent) return
        const vModelKey = getVModelKey(isModelPresent.value.expression)
        reportForVModel(context, node, firstToken, vModelKey)
      }
    })
  }
}
