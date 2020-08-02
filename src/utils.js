const fs = require('fs')
const path = require('path')
const colors = require('colors')
const inquirer = require('inquirer')
const { exec } = require('child_process')
const config = require('./default-config')


const cwd = process.cwd()

// callback function for handling errors
const callback = (error) => {
  if (error) {
    console.error('error :>> ', error)
  }
}

const toCamelCase = (name) => {
  let newName = ''
  name.split('-').forEach((part) => {
    newName = newName + part.charAt(0).toUpperCase() + part.slice(1)
  })
  return newName
}

// for converting starter file text array into multilines text
const getTempFromArray = array => array.join('\n')


const componentsRootDirPath = (...paths) => {
  return paths ? path.join(cwd, ...config.componentsRootDir, ...paths) : path.join(cwd, ...config.componentsRootDir)
}


const openFilesAfterCreating = (componentDir, file1, file2) => {
  const FilesToOpen = `${path.join(
    ...config.componentsRootDir,
    componentDir,
    file1
  )} ${path.join(
    ...config.componentsRootDir,
    componentDir,
    file2
  )}`

  exec(`code -r ${FilesToOpen}`, () => {})
}


const createComponentDir = (component_name) => {
  const componentFile = `${component_name}.component.jsx`
  const componentStyles = `${component_name}.styles.jsx`

  /* create component directory */
  fs.mkdir(
    componentsRootDirPath(component_name),
    { recursive: true },
    (error) => {
      if(error) {
        console.error('error :>> ', error)
        return
      }

      /* create component file */
      fs.writeFile(
        componentsRootDirPath(component_name, componentFile),
        getTempFromArray(
          config.getComponentStarter({
            componentName: component_name,
            camelcaseComponentName: toCamelCase(component_name),
          })
        ),
        callback
      )

      /* create component styles file */
      fs.writeFile(
        componentsRootDirPath(component_name, componentStyles),
        getTempFromArray(
          config.getComponentStyle({
            componentName: component_name,
            camelcaseComponentName: toCamelCase(component_name),
          })
        ),
        callback
      )
    }
  )

  openFilesAfterCreating(component_name, componentFile, componentStyles)
  console.log(colors.green(`${component_name} component successfully created!`))
}


/* function for checking if the compoent folder exists or not */
async function checkDirExistence(componentName) {
  try {
    if (fs.existsSync(componentsRootDirPath(componentName))) {
      const promptChoises = [
        'pick another name?',
        'override it?',
        'cancel operation?',
      ]
      const promptArray = [{
          type: 'list',
          name: 'next_step',
          message: `${componentName} directory is already exists, do you want to: `,
          choices: promptChoises,
      }]

      const { next_step } = await inquirer.prompt(promptArray)

      if (next_step === promptChoises[0]) {
        const answers = await inquirer.prompt([
          {
            type: 'input',
            name: 'componentName',
            message: `component name :`,
          },
        ])

        await checkDirExistence(answers.componentName)
      } else if (next_step === promptChoises[1]) {
        createComponentDir(componentName)
      }
    } else {
      createComponentDir(componentName)
    }
  } catch (error) {
    console.error('error :>> ', error)
  }
}


module.exports = {
  componentsRootDirPath,
  checkDirExistence,
  callback,
}