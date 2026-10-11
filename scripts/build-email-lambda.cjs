// Bundle explicit imports only. No dotenv, environment substitution, or credential files.
const path = require('node:path');
const fs = require('node:fs');
const {execFileSync} = require('node:child_process');
const {createHash} = require('node:crypto');
const compiler = require('next/dist/compiled/webpack/webpack');
compiler.init();
const root = path.resolve(__dirname, '..');
const output = path.join(root, 'build/research-email-lambda');
fs.mkdirSync(output, {recursive: true});
compiler.webpack({
  mode: 'production', target: 'node22', devtool: false,
  entry: path.join(root, 'scripts/lambda/index.cjs'),
  output: {path: output, filename: 'index.js', library: {type: 'commonjs2'}, clean: true},
  resolve: {extensions: ['.ts', '.js', '.cjs', '.json'], alias: {'server-only': false}},
  module: {rules: [{test: /\.ts$/, exclude: /node_modules/, use: path.join(root, 'scripts/lambda/typescript-loader.cjs')}]},
  optimization: {minimize: false},
  plugins: [new compiler.webpack.optimize.LimitChunkCountPlugin({maxChunks: 1})]
}, (error, stats) => {
  if (error || stats.hasErrors() || stats.hasWarnings()) {
    console.error(error || stats.toString({all: false, errors: true, warnings: true}));
    process.exitCode = 1; return;
  }
  const zip = path.join(root, 'build/research-email-lambda.zip');
  fs.rmSync(zip, {force: true});
  execFileSync('zip', ['-q', zip, 'index.js'], {cwd: output});
  const digest = createHash('sha256').update(fs.readFileSync(zip)).digest('hex');
  fs.writeFileSync(zip + '.sha256', digest + '\n');
  console.log(`Lambda package: ${zip}\nHandler: index.handler\nSHA256: ${digest}`);
});
