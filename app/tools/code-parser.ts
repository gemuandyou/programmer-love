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
        'transient', 'try', 'void', 'volatile', 'while',
        'Double', 'Boolean', 'Float', 'Integer', 'Long'];
    private pythonWords: String[] = ['range', 'from', 'import', 'for', 'in', 'not'];
    private jsWords: String[] = ['document'];
    private nodeWords: String[] = ['require'];
    private cWords: String[] = ['auto', 'else', 'long', 'switch', 'break', 'enum', 'register', 'typedef', 'case', 'extern',
        'return', 'union', 'char', 'float', 'short', 'unsigned', 'const', 'for', 'signed', 'void', 'continue', 'goto',
        'sizeof', 'volatile', 'default', 'if', 'static', 'while', 'do', 'int', 'struct', '_Packed', 'double'];

    constructor(private _codeTxt: String) {
    };

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
            case 'c':
                keyWords = this.cWords;
                break;
        }
        // 解析代码关键字
        for (let keyword of keyWords) {
            let reg = new RegExp(keyword + ' ', 'g');
            if (reg.exec(codeTxt) != null) {
                console.log(reg.exec(codeTxt));
                codeTxt = codeTxt.replace(reg, '@st-' + keyword + '-@et ');
            }

            let reg1 = new RegExp(keyword + '\\.', 'g');
            if (reg1.exec(codeTxt) != null) {
                codeTxt = codeTxt.replace(reg1, '@st-' + keyword + '-@et.');
            }

            let reg2 = new RegExp(keyword + '\\(', 'g');
            if (reg2.exec(codeTxt) != null) {
                codeTxt = codeTxt.replace(reg2, '@st-' + keyword + '-@et(');
            }
        }
        for (let keyword of keyWords) {
            let reg = new RegExp('@st-' + keyword + '-@et ', 'g');
            let reg1 = new RegExp('@st-' + keyword + '-@et\\.', 'g');
            let reg2 = new RegExp('@st-' + keyword + '-@et\\(', 'g');
            codeTxt = codeTxt.replace(reg, '<span style="font-weight: bold; color: dodgerblue">' + keyword + '</span> ');
            codeTxt = codeTxt.replace(reg1, '<span style="font-weight: bold; color: dodgerblue">' + keyword + '</span>.');
            codeTxt = codeTxt.replace(reg2, '<span style="font-weight: bold; color: dodgerblue">' + keyword + '</span>(');
        }
        // 解析注释
        // 第一种注释 格式：/*abc*/
        let reg = new RegExp('/\\*.*?\\*/'); // 非贪婪匹配
        for (let tmp = reg.exec(codeTxt); tmp != null;) {
            codeTxt = codeTxt.replace(reg, '@anno-' + tmp.toString().substring(2, tmp.toString().length - 2) + '-onna@');
            tmp = reg.exec(codeTxt);
            console.log(tmp);
        }
        let reg1 = new RegExp('@anno-.*?-onna@'); // 非贪婪匹配
        for (let tmp = reg1.exec(codeTxt); tmp != null; tmp = reg1.exec(codeTxt)) {
            codeTxt = codeTxt.replace(reg1, '<span style="font-weight: bold; color: #969696; font-size: 80%;">/*' + tmp.toString().substring(6, tmp.toString().length - 6) + '*/</span>')
        }
        // 第二种注释 // abc
        let reg = new RegExp('//.*?\\n'); // 非贪婪匹配
        for (let tmp = reg.exec(codeTxt); tmp != null;) {
            codeTxt = codeTxt.replace(reg, '@anno1-' + tmp.toString().substring(2, tmp.toString().length - 2) + '-1onna@');
            tmp = reg.exec(codeTxt);
            console.log(tmp);
        }
        let reg1 = new RegExp('@anno1-.*?-1onna@'); // 非贪婪匹配
        for (let tmp = reg1.exec(codeTxt); tmp != null; tmp = reg1.exec(codeTxt)) {
            codeTxt = codeTxt.replace(reg1, '<span style="font-weight: bold; color: #969696; font-size: 80%;">//' + tmp.toString().substring(7, tmp.toString().length - 7) + '</span>\n')
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
