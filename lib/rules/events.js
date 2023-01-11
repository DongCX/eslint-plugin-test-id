/**
 * @fileoverview Rule to check data-testid
 * @author Prashant Swami
 */

"use strict";

const { CONSIDERED_EVENTS, DATA_TEST_ID_KEY } = require('@dongcx0319/eslint-plugin-testid/lib/Enums')
const { isAttributePresent, defineTemplateBodyVisitor } = require('@dongcx0319/eslint-plugin-testid/lib/utils')

function reportForEvent(context, node, firstToken, reportFixValue) {
  context.report({
    node,
    loc: firstToken.loc,
    message: `Expected '${DATA_TEST_ID_KEY}' with event.`,
    fix: fixer => fixer.insertTextAfter(firstToken, ` ${DATA_TEST_ID_KEY}="${reportFixValue}"`)
  })
}

function isConsideredEvent(objPresentEvent) {
  const objPresentEventName = objPresentEvent.key && objPresentEvent.key.argument && objPresentEvent.key.argument.name
  if (!objPresentEventName) return false

  return CONSIDERED_EVENTS.includes(objPresentEventName)
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
         * Events check: considered ['change', 'click', 'event]
         */

        const isEventPresent = isAttributePresent(attributes, 'on')
        if (!isEventPresent) return
        if (!isConsideredEvent(isEventPresent)) return

        let eventFixValue = null

        if (isEventPresent.value && isEventPresent.value.references && Array.isArray(isEventPresent.value.references)) {
          const eventRef = [...isEventPresent.value.references].shift();
          eventFixValue = eventRef && eventRef.id && eventRef.id.name ? eventRef.id.name : null
        }

        if(eventFixValue) {
          reportForEvent(context, node, firstToken, eventFixValue);
          return
        }
      }
    })
  }
}
