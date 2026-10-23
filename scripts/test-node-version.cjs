const {test}=require('node:test'),assert=require('node:assert/strict');
const {supportedNode}=require('./check-node-version.cjs');
test('rejects vulnerable patches and unreviewed majors',()=>{
 for(const v of ['20.20.0','22.23.3','22.22.99','24.14.0','24.22.0','23.99.99','25.0.0','26.12.1','bad'])assert.equal(supportedNode(v),false,v);
 for(const v of ['22.23.4','v22.23.4','22.24.0','24.22.1','24.23.0'])assert.equal(supportedNode(v),true,v);
});
