const tempy = require('tempy')
const crypto = require('crypto')
const fs = require('fs/promises')

const Docker = require('dockerode')
const docker = new Docker()

module.exports = async (code) => {
  // save code to temporary directory
  const id = crypto.randomUUID()
  const dir = tempy.directory({ prefix: id })

  await fs.writeFile(`${dir}/in.lua`, code, { encoding: 'utf-8' })

  // obfuscate
  await docker.run('moaufmklo/docker-ironbrew', [], [], {
    HostConfig: {
      AutoRemove: true,
      Binds: [
         `${dir}/:/data/`
      ]
    },
    name: `ironbrew-api-${id}`
  })

  const obfuscated = await fs.readFile(`${dir}/out.lua`, { encoding: 'utf-8' })

  return { id, obfuscated }
}
