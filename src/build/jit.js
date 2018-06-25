require('shelljs/global');
const path           = require('path');
const fs             = require('fs');
const Build          = require('./index.js');
const SassBuilder    = require('./../style/sass.js');
const PostCSSBuilder = require('./../style/postcss.js');
const TSBuilder      = require('./../compile/tsc.js');
const Watcher        = require('./../watch.js');
const util           = require('./../util.js');
const log            = require('./../log.js');
const config         = require('./../config');
const cli            = require('./../../cli.config.json');

class JitBuild extends Build {

    constructor() {
        super();
    }

    init() {
       this.pre();
    }


    build() {

      const env = 'dev';
      const sassBuilder = new SassBuilder({ dist: config.build });
      const postcssBuilder = new PostCSSBuilder({ dist: config.build, sourceMap: true });
      const jitBuilder = new TSBuilder();
      const libCheck = config.lib && config.lib[env];

      (async () => {
      const lib = await util.copyLib(libCheck ? config.lib['dev'] : config.dep['lib'],
                                     libCheck ? config.lib.src : config.dep.src,
                                     libCheck ? config.lib.dist : config.dep.dist);
      })();

      (async () => {
        const html = await util.copyBatch(ls(path.normalize(config.src + '/app/**/*.html')), config.build);
        const publicDir = await util.copyDir(path.normalize(config.src + '/public'), config.build);
        const template = await util.formatIndex(path.normalize(config.src + '/public/index.html'));
      })();

      (async () => {
        const sass = await sassBuilder.batch(ls(path.normalize(config.src + '/**/*.scss')));
        const postcss = await postcssBuilder.batch(sass);
        const src = await jitBuilder.compile(path.join('src', 'tsconfig.' + cli.env + '.json'));
        this.post();
      })();

      //if (!fs.existsSync(path.join(config.build, 'main.js'))) {
        (async () => {
          const main = await jitBuilder.compileMain().then((res) => {
              log.message('compiled main.js');
          });
        })();
      //}

    }

    pre() {

      if (cli.program.clean === true) {
        util.cleanBuild();
      }

      if (util.hasHook('pre')) {

        config.buildHooks[cli.env].pre(process.argv).then(() => {
          this.build();
        });

      } else {

        this.build();

      }

    }

    post() {

      if (util.hasHook('post')) config.buildHooks[cli.env].post(process.argv);
      if (cli.program.watch === true) {
        const watcher = new Watcher();
      }

      if (!util.hasArg('watch')) {
        log.break();
        ls(this.outputPath).forEach((file) => {
          log.logFileStats(path.join(this.outputPath, file));
        });
      }

      if (util.hasArg('serve')) {
        util.serve(cli.program.watch);
      }


    }

}

module.exports = JitBuild;