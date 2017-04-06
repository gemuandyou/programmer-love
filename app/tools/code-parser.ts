/**
 * 解析代码文本
 * Created by Gemu on 2017/2/22.
 */
export class CodeParser {

    // Java 关键字
    private javaKeyWords: String[] = ['abstract', 'assert', 'boolean', 'break', 'byte', 'Byte', 'case', 'catch', 'char', 'class', 'const',
        'continue', 'default', 'do', 'double', 'else', 'enum', 'extends', 'final', 'finally', 'float', 'for', 'goto', 'if',
        'implements', 'import', 'instanceof', 'int', 'interface', 'long', 'native', 'new', 'package', 'private', 'protected',
        'public', 'return', 'strictfp', 'short', 'static', 'super', 'switch', 'synchronized', 'this', 'throw', 'throws',
        'transient', 'try',	'void', 'volatile', 'while',
        'Double', 'Boolean', 'Float', 'Integer', 'Long'];
    private pythonWords: String[] = ['range', 'from', 'import', 'for', 'in', 'not'];
    private jsWords: String[] = ['document'];
    private nodeWords: String[] = ['require'];

    constructor(private _codeTxt: String) {};

    codeParser(renderParam?: String): String {
        if (!renderParam) return this.basisParser();
        let codeTxt = this._codeTxt.toString();
        let keyWords: String[] = [];
        switch (renderParam) {
            case 'java':
                keyWords = this.javaKeyWords;
                break;
            case 'python':
                keyWords = this.pythonWords;
                break;
            case 'js':
                keyWords = this.jsWords;
                break;
            case 'nodejs':
                keyWords = this.nodeWords;
                break;
        }
        for (let keyword of keyWords) {
            let reg = new RegExp(keyword + ' ', 'g');
            let result;
            while ((result = reg.exec(codeTxt)) != null) {
                codeTxt = codeTxt.replace(result, '<span style="font-weight: bold; color: dodgerblue">' + result.toString().trim() + '</span> ');
            }

            reg = new RegExp(keyword + '\.', 'g');
            result;
            while ((result = reg.exec(codeTxt)) != null) {
                codeTxt = codeTxt.replace(result, '<span style="font-weight: bold; color: dodgerblue">' + result.toString().substring(0, result.toString().length - 2) + '</span>.');
            }

            reg = new RegExp(keyword + '\\(', 'g');
            result;
            while ((result = reg.exec(codeTxt)) != null) {
                codeTxt = codeTxt.replace(result, '<span style="font-weight: bold; color: dodgerblue">' + result.toString().substring(0, result.toString().length - 1) + '</span>(');
            }
        }
        return '<div style="font-family: Monaco,\'Lucida Console\',monospace;"><div style="font-family: fantasy;color: thistle; user-select: none;">' + renderParam + '</div>' +
            '<div style="white-space: normal;"><pre style="background-color: #f1f1f1; font-family: serif; margin: 0; border-radius: 0.5rem;padding: 0.5rem;">' + codeTxt + '</pre></div></div>';
    }

    basisParser(): String {
        let codeTxt = this._codeTxt.toString();
        return '<div style="font-family: Monaco,\'Lucida Console\',monospace;">' +
            '<div style="white-space: normal;"><pre style="background-color: #f1f1f1; font-family: serif; margin: 0; border-radius: 0.5rem;padding: 0.5rem;">' + codeTxt + '</pre></div></div>';
    }
}
