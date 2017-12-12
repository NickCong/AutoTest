// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false
};
export const  AWS_CONFIGURATION  = {
  endpoint: 'dynamodb.us-east-2.amazonaws.com',
  accessKeyId: 'AKIAIKZH77ILYHODLGWQ',//AKIAI3H5QDUXBDRWITQQ
  secretAccessKey: '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',//u1n19AxPm7pMRVcXivU7CRm5LMVVSkLiHTPADb3T
  region: 'us-east-2',
  PROJECTTABLENAME:'ATCProject',
  SCENARIOTABLENAME:'ATCScenario',
  CASETABLENAME:'ATCCase',
  TESTERTABLENAME:'ATCTester'
};
