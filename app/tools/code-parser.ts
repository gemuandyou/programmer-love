/**
 * 解析代码文本
 * Created by Gemu on 2017/2/22.
 */
export class CodeParser {

    // Java 关键字
    javaKeyWords: String[] = ['abstract', 'assert', 'boolean', 'break', 'byte', 'Byte', 'case', 'catch', 'char', 'class', 'const',
        'continue', 'default', 'do', 'double', 'else', 'enum', 'extends', 'final', 'finally', 'float', 'for', 'goto', 'if',
        'implements', 'import', 'instanceof', 'int', 'interface', 'long', 'native', 'new', 'package', 'private', 'protected',
        'public', 'return', 'strictfp', 'short', 'static', 'super', 'switch', 'synchronized', 'this', 'throw', 'throws',
        'transient', 'try',	'void', 'volatile', 'while',
        'Double', 'Boolean', 'Float', 'Integer', 'Long'];


    constructor(private _codeTxt: String) {};

    javaParser(): String {
        let codeTxt = this._codeTxt.toString();
        for (let keyword of this.javaKeyWords) {
            let reg = new RegExp(keyword + ' ', 'g');
            let result;
            while ((result = reg.exec(codeTxt)) != null) {
                codeTxt = codeTxt.replace(result, '<span style="font-weight: bold; color: dodgerblue">' + result.toString().trim() + '</span> ');
            }
        }
        return '<pre style="font-family: Monaco,\'Lucida Console\',monospace;"><div style="font-family: fantasy;color: thistle; user-select: none;">java</div>' +
            '<div style="background-color: #f1f1f1">' + codeTxt + '</div></pre>';
    }

    basisParser(): String {
        let codeTxt = this._codeTxt.toString();
        return '<pre style="font-family: Monaco,\'Lucida Console\',monospace;"><div style="font-family: fantasy;color: thistle; user-select: none;">basis</div>' +
            '<div style="background-color: #f1f1f1">' + codeTxt + '</div></pre>';
    }
}
