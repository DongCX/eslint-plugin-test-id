/**
 * @fileoverview This checks is data-test-id prop is present, on some tags which are useful for e2e testing
 * @author prashant swami
 */
"use strict";
module.exports = {
  rules: {
    'v-model': require('./rules/v-model'),
    'events': require('./rules/events'),
    'component-declare': require('./rules/component-declare'),
  },
  configs: {
    recommended: {
      plugins: [
        '@dongcx0319/testid',
      ],
      rules: {
        "@dongcx0319/testid/v-model": "error",
        "@dongcx0319/testid/events": "error",
        "@dongcx0319/testid/component-declare": "error",
      }
    }
  }
}
