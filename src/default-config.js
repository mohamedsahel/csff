const fs = require('fs')
const path = require('path')

const cwd = process.cwd()

let customConfig = {}

if (fs.existsSync(path.join(cwd, 'csff-config.js'))) {
  customConfig = require(path.join(cwd, 'csff-config.js'))
}



const getComponentStarter = ({ componentName, camelcaseComponentName }) => {
  return [
    `import React from 'react'`,
    `import * as S from './${componentName}.styles.jsx'`,
    ``,
    ``,
    `const ${camelcaseComponentName} = ({ ...props }) => {`,
    `  return(`,
    `    <S.Containerr {...props} >`,
    ``,
    `    </S.Containerr>`,
    `  )`,
    `}`,
    ``,
    ``,
    `export default ${camelcaseComponentName}`,
  ]
}


const getComponentStyle = () => {
return [
  `import styled from 'styled-components'`,
  ``,
  ``,
  `export const Container = styled.div`
]
}

module.exports = {
  componentsRootDir: customConfig.componentsRootDir || ['src', 'components'],
  getComponentStarter: customConfig.getComponentStarter || getComponentStarter,
  getComponentStyle: customConfig.getComponentStyle || getComponentStyle,
}