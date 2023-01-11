/**
 * @fileoverview Rule to check data-testid
 * @author dongcx0319
*/

"use strict";

const path = require('path')
const { DATA_TEST_ID_KEY } = require('@dongcx0319/eslint-plugin-testid/lib/Enums')
const { isAttributePresent, defineTemplateBodyVisitor } = require('@dongcx0319/eslint-plugin-testid/lib/utils')

function reportForComponentDeclare(context, node, firstToken, reportFixValue) {
  context.report({
    node,
    loc: firstToken.loc,
    message: `Expected '${DATA_TEST_ID_KEY}' with component declare`,
    fix: fixer => fixer.insertTextAfter(firstToken, ` ${DATA_TEST_ID_KEY}="${reportFixValue}"`)
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
        const parentName = node.parent && node.parent.name
        if (parentName !== 'template') return

        const attributes = node.startTag.attributes;
        if (!attributes || Array.isArray(attributes) && attributes.length === 0) return

        if (isAttributePresent(attributes, DATA_TEST_ID_KEY)) return

        const firstToken = template.getFirstToken(node)
        const filename = context.getFilename()
        const basename = path.basename(filename)
        reportForComponentDeclare(context, node, firstToken, basename)
      }
    })
  }
};
