// 로컬 개발시 node (ts-node가 아닌) 명령을 통해 수행할 수 있도록 js 포맷의 index 파일을 제공
const path = require('path')

require('ts-node').register({
  project: path.join(__dirname, '../tsconfig.json')
})
require('./sample.ts')
