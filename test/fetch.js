const fetch = require('node-fetch')
let token = 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkMGE4MDVkMDk4N2U1MjhjZDgzZWY4OSIsInR5cGUiOiJBRE1JTiIsImlhdCI6MTU2MTE5MjAyNywiZXhwIjoxNTY5NzQ1NjI3fQ.l6vAuh2nx5uhMnVKAlqJQ5HkMikysPsAUI7rSTVhGXs'

module.exports = (url, config, t) => fetch('http://localhost:3000/' + url, {
  ...config,
  headers: {
    ...config.headers,
    'Authorization': t || token
  }
})
