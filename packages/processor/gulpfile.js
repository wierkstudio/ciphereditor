
const concat = require('gulp-concat')
const inject = require('gulp-inject')
const terser = require('gulp-terser')
const ts = require('gulp-typescript')
const { src, dest, watch } = require('gulp')

const workerTypeScriptProject = ts.createProject('tsconfig.worker.json')
const iframeTypeScriptProject = ts.createProject('tsconfig.iframe.json')
const libTypeScriptProject = ts.createProject('tsconfig.json')

function injectDataUri (sources, placeholder, contentType, wrapInLiteral) {
  return inject(sources, {
    starttag: `/* inject:${placeholder} */`,
    endtag: '/* endinject */',
    removeTags: true,
    transform: (path, file) => {
      const source = file.contents.toString('utf8')
      const dataUri =
        `data:${contentType};base64,` +
        Buffer.from(source).toString('base64')
      return wrapInLiteral ? JSON.stringify(dataUri) : dataUri
    }
  })
}

function buildWorkerScript () {
  return src(['src/loader.ts', 'src/worker.ts'])
    .pipe(concat('worker.ts'))
    .pipe(workerTypeScriptProject())
    .pipe(terser())
}

function buildIframeScript () {
  return src('src/iframe.ts')
    .pipe(iframeTypeScriptProject())
    .pipe(injectDataUri(
      buildWorkerScript(),
      'worker_script_url_literal',
      'text/javascript',
      true
    ))
    .pipe(terser())
}

function buildIframeHtml () {
  return src('./src/iframe.html')
    .pipe(injectDataUri(
      buildIframeScript(),
      'iframe_script_url',
      'text/javascript',
      false
    ))
}

function build () {
  return src('./src/index.ts')
    .pipe(libTypeScriptProject())
    .pipe(injectDataUri(
      buildIframeHtml(),
      'iframe_html_url_literal',
      'text/html',
      true
    ))
    .pipe(dest('./build'))
}

function watchFiles () {
  watch('src/**/*.*', build)
}

exports.build = build
exports.description = 'Build package'

exports.watch = watchFiles
exports.description = 'Watch source files and trigger package builds on change'
