const fs = require('fs')
const utils = require('./utils')

module.exports = {
  add: async (component_name) => {
    try {
      /* create components root directory */
      await fs.mkdir(utils.componentsRootDirPath(), { recursive: true }, utils.callback)

      await utils.checkDirExistence(component_name)
    } catch (error) {
      console.error('error :>> ', error)
    }
  },
}
