var serverlessSDK = require('./serverless_sdk/index.js')
serverlessSDK = new serverlessSDK({
orgId: 'ravimaddi18',
applicationName: 'linkedin',
appUid: '000000000000000000',
orgUid: '000000000000000000',
deploymentUid: 'undefined',
serviceName: 'linkedinravi',
shouldLogMeta: true,
disableAwsSpans: false,
disableHttpSpans: false,
stageName: 'dev',
pluginVersion: '3.5.0',
disableFrameworksInstrumentation: false})
const handlerWrapperArgs = { functionName: 'linkedinravi-dev-hello', timeout: 6}
try {
  const userHandler = require('./handler.js')
  module.exports.handler = serverlessSDK.handler(userHandler.hello, handlerWrapperArgs)
} catch (error) {
  module.exports.handler = serverlessSDK.handler(() => { throw error }, handlerWrapperArgs)
}
