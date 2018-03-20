const colors = require('colors');
const logger = require('single-line-log').stdout;
const config = require('./config');

class Log {

    constructor() {}

    break() {
        process.stdout.write('\n');
    }

    line() {
        process.stdout.write('\n');
        process.stdout.write('\n');
        const col = process.stdout.columns;
        let line = ' ';
        for (let i=0; i<col - 4; i++) {
            line +=  '\u2500';
        }
        line +='💥';
        process.stdout.write(colors.red(line).dim);
    }

    message(action, noun, next) {
        let a = action ? colors.white(action).dim : '';
        let n = noun ? colors.white(noun).dim : '';
        let x = next ? colors.white(next).dim : '';
        logger(' ' + a + ' ' + n + ' ' + x);
    }

    alert(noun, verb, action, next) {
        let n = noun ? colors.white(noun) : '';
        let v = verb ? colors.white(verb) : '';
        let a = action ? colors.white(action) : '';
        let x = next ? colors.white(next).dim : '';
        console.log(' ' + n + ' ' + v + ' ' + a + ' ' + x);
    }

    warn(action, noun) {
        let a = action ? colors.yellow(action) : '';
        let n = noun ? colors.white(noun) : '';
        process.stdout.write('\n');
        process.stdout.write(a);
    }

    error(err) {
        if (typeof err === 'string') {
            process.stdout.write('\n');
            console.log(colors.red(err));
        } else {
            let msg = ' ' + err.message.replace(/'(.*?)'/g, colors.red("'") + colors.red("$1") + colors.red("'"))
                                       .replace(/(error)( )((?:TS[a-z0-9]*))(:)/g, colors.white("$1$2$3").dim);
            let link = err.file.includes(config.projectRoot) ?
                colors.dim(' vscode://file/' + err.file + ':' + err.line + ':' + err.column) + '\n' :
                colors.dim(' vscode://file/' + config.projectRoot + '/' + err.file + ':' + err.line + ':' + err.column) + '\n';
            console.log('\n\n' +
                colors.red(' ' + err.service.toUpperCase() + ' ERROR') + ' ' +
                colors.white(colors.dim(err.file) + colors.white(' ' + err.line + ':' + err.column + ' ').dim) + '\n\n' +
                colors.white(msg) + '\n\n'+
                link);
        }

        //process.exit();
    }

    getFilePath(filePath) {

        return path.normalize(filePath.substring(0, filePath.replace(/\\/g, '/').lastIndexOf('/')));

    }

    getFileName(filePath) {

        return filePath.replace(/^.*[\\\/]/, '');

    }

    formatTSError(str) {
        let lineNumbers = str.slice(str.indexOf('(') + 1, str.indexOf(')')).split(',');
        let err = {
            service: 'TypeScript',
            file: str.slice(0, str.indexOf('(')),
            line: lineNumbers[0],
            column: lineNumbers[1],
            message: str.slice(str.indexOf(':') + 2, str.length)
        }
        return err;
    }


}



module.exports = new Log();