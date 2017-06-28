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
    private htmlWords: String[] = [
        // html标签
        '!DOCTYPE', 'a', 'abbr', 'acronym', 'address', 'applet', 'area', 'article', 'aside', 'audio', 'b', 'base', 'basefont',
        'bdi', 'bdo', 'big', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'center', 'cite', 'code', 'col',
        'colgroup', 'command', 'datalist', 'dd', 'del', 'details', 'dfn', 'dialog', 'dir', 'div', 'dl', 'dt', 'em', 'embed',
        'fieldset', 'figcaption', 'figure', 'font', 'footer', 'form', 'frame', 'frameset', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'head', 'header', 'hr', 'html', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'keygen', 'label', 'legend', 'li',
        'link', 'map', 'mark', 'menu', 'meta', 'meter', 'nav', 'noframes', 'noscript', 'object', 'ol', 'optgroup', 'option',
        'output', 'p', 'param', 'pre', 'progress', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'script', 'section', 'select',
        'small', 'source', 'span', 'strike', 'strong', 'style', 'sub', 'summary', 'sup', 'table', 'tbody', 'td', 'textarea',
        'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'track', 'tt', 'u', 'ul', 'var', 'video', 'wbr'
    ];

    constructor(private _codeTxt: String) {
    };

    codeParser(renderParam?: String): String {
        let renderParams = renderParam.split('|');
        let bgc = '#f1f1f1';
        if (renderParams) {
            bgc = renderParams[1] ? renderParams[1] : '#f1f1f1';
            renderParam = renderParams[0];
        }
        if (!renderParam) return this.basisParser(bgc);
        let keyWords: String[] = [];
        this._codeTxt = this._codeTxt.replace(/\</g, '&lt;').replace(/\>/g, '&gt;');
        switch (renderParam) {
            case 'java':
                keyWords = this.javaKeyWords;
                this._codeTxt = this._codeTxt.replace(/\</g, '&lt;')
                    .replace(/&lt;span style/g, '<span style').replace(/&lt;\/span>/g, '</span>');
                break;
            case 'python':
                keyWords = this.pythonWords;
                this._codeTxt = this._codeTxt.replace(/\</g, '&lt;')
                    .replace(/&lt;span style/g, '<span style').replace(/&lt;\/span>/g, '</span>');
                break;
            case 'js':
                keyWords = this.jsWords;
                this._codeTxt = this._codeTxt.replace(/\</g, '&lt;')
                    .replace(/&lt;span style/g, '<span style').replace(/&lt;\/span>/g, '</span>');
                break;
            case 'nodejs':
                keyWords = this.nodeWords;
                this._codeTxt = this._codeTxt.replace(/\</g, '&lt;')
                    .replace(/&lt;span style/g, '<span style').replace(/&lt;\/span>/g, '</span>');
                break;
            case 'c':
                keyWords = this.cWords;
                this._codeTxt = this._codeTxt.replace(/\</g, '&lt;')
                    .replace(/&lt;span style/g, '<span style').replace(/&lt;\/span>/g, '</span>');
                break;
            case 'html':
                keyWords = this.htmlWords;
                break;
        }
        let codeTxt = this._codeTxt.toString();

        // ======================解析注释======================
        // 全局替换换行 \n => @enter
        codeTxt = codeTxt.replace(/\n/g, '@enter');
        
        // 第三种注释 格式：#abc\n
        let reg4 = new RegExp('#.*?\\n'); // 非贪婪匹配
        for (let tmp = reg4.exec(codeTxt); tmp != null;) {
            codeTxt = codeTxt.replace(reg4, '@anno-' + tmp.toString().substring(1, tmp.toString().length - 1) + '-onna@');
            tmp = reg4.exec(codeTxt);
        }
        let reg5 = new RegExp('@anno-.*?-onna@'); // 非贪婪匹配
        for (let tmp = reg5.exec(codeTxt); tmp != null; tmp = reg5.exec(codeTxt)) {
            codeTxt = codeTxt.replace(reg5, '<span style="font-weight: bold; color: #969696; font-size: 80%;">#' + tmp.toString().substring(6, tmp.toString().length - 6) + '</span>\n')
        }
        // 处理结尾处的#注解
        let lastInd = codeTxt.lastIndexOf('#');
        if (lastInd > codeTxt.lastIndexOf('\n')) {
            codeTxt = codeTxt.substring(0, lastInd) + '<span style="font-weight: bold; color: #969696; font-size: 80%;">' + codeTxt.substring(lastInd) + '</span>';
        }

        // 第一种注释 格式：/*abc*/
        let reg = new RegExp('/\\*[^/$]*\\*/'); // 非贪婪匹配
        for (let tmp = reg.exec(codeTxt); tmp != null;) {
            codeTxt = codeTxt.replace(reg, '@anno-' + tmp.toString().substring(2, tmp.toString().length - 2) + '-onna@');
            tmp = reg.exec(codeTxt);
        }
        let reg1 = new RegExp('@anno-.*?-onna@'); // 非贪婪匹配
        for (let tmp = reg1.exec(codeTxt); tmp != null; tmp = reg1.exec(codeTxt)) {
            codeTxt = codeTxt.replace(reg1, '<span style="font-weight: bold; color: #969696; font-size: 80%;">/*' + tmp.toString().substring(6, tmp.toString().length - 6) + '*/</span>')
        }
        // 第二种注释 格式：// abc
        let reg2 = new RegExp('//.*?\\n'); // 非贪婪匹配
        for (let tmp = reg2.exec(codeTxt); tmp != null;) {
            codeTxt = codeTxt.replace(reg2, '@anno1-' + tmp.toString().substring(2, tmp.toString().length - 1) + '-1onna@');
            tmp = reg2.exec(codeTxt);
        }
        let reg3 = new RegExp('@anno1-.*?-1onna@'); // 非贪婪匹配
        for (let tmp = reg3.exec(codeTxt); tmp != null; tmp = reg3.exec(codeTxt)) {
            codeTxt = codeTxt.replace(reg3, '<span style="font-weight: bold; color: #969696; font-size: 80%;">//' + tmp.toString().substring(7, tmp.toString().length - 7) + '</span>\n')
            tmp = reg3.exec(codeTxt);
        }
        // 处理结尾处的 // 注解
        lastInd = codeTxt.lastIndexOf('//');
        if (lastInd > codeTxt.lastIndexOf('\n')) {
            codeTxt = codeTxt.substring(0, lastInd) + '<span style="font-weight: bold; color: #969696; font-size: 80%;">' + codeTxt.substring(lastInd) + '</span>';
        }
        // 全局替换为换行 @enter => \n
        codeTxt = codeTxt.replace(/@enter/g, '\n');

        // ======================解析代码关键字======================
        for (let keyword of keyWords) {
            switch (renderParam) {
                case 'html':
                    let reg3 = new RegExp('\&lt;' + keyword + ' ', 'g');
                    if (reg3.exec(codeTxt) != null) {
                        codeTxt = codeTxt.replace(reg3, '@st-' + keyword + '-@et ');
                    }
                    let reg4 = new RegExp('\&lt;' + keyword + '\&gt;', 'g');
                    if (reg4.exec(codeTxt) != null) {
                        codeTxt = codeTxt.replace(reg4, '@st-' + keyword + '-@et>');
                    }
                    let reg5 = new RegExp('\&lt;\\/' + keyword + '\&gt;', 'g');
                    if (reg5.exec(codeTxt) != null) {
                        codeTxt = codeTxt.replace(reg5, '/@st-' + keyword + '-@et>');
                    }
                    break;
                default:
                    let reg = new RegExp(keyword + ' ', 'g');
                    if (reg.exec(codeTxt) != null) {
                        codeTxt = codeTxt.replace(reg, '@st-' + keyword + '-@et ');
                    }

                    let reg1 = new RegExp(keyword + '\\.', 'g');
                    if (reg1.exec(codeTxt) != null) {
                        codeTxt = codeTxt.replace(reg1, '@st-' + keyword + '-@et.');
                    }

                    let reg2 = new RegExp(' ' + keyword + '\\(', 'g');
                    if (reg2.exec(codeTxt) != null) {
                        codeTxt = codeTxt.replace(reg2, '@st-' + keyword + '-@et(');
                    }
                    break;
            }
        }
        for (let keyword of keyWords) {
            switch (renderParam) {
                case 'html':
                    let reg5 = new RegExp('\\/@st-' + keyword + '-@et>', 'g');
                    codeTxt = codeTxt.replace(reg5, '&lt;/<span style="font-weight: bold; color: dodgerblue">' + keyword + '</span>>');
                    let reg3 = new RegExp('@st-' + keyword + '-@et ', 'g');
                    codeTxt = codeTxt.replace(reg3, '<<span style="font-weight: bold; color: dodgerblue">' + keyword + '</span> ');
                    let reg4 = new RegExp('@st-' + keyword + '-@et>', 'g');
                    codeTxt = codeTxt.replace(reg4, '<<span style="font-weight: bold; color: dodgerblue">' + keyword + '</span>>');
                    break;
                default:
                    let reg = new RegExp('@st-' + keyword + '-@et ', 'g');
                    let reg1 = new RegExp('@st-' + keyword + '-@et\\.', 'g');
                    let reg2 = new RegExp('@st-' + keyword + '-@et\\(', 'g');
                    codeTxt = codeTxt.replace(reg, '<span style="font-weight: bold; color: dodgerblue">' + keyword + '</span> ');
                    codeTxt = codeTxt.replace(reg1, '<span style="font-weight: bold; color: dodgerblue">' + keyword + '</span>.');
                    codeTxt = codeTxt.replace(reg2, ' <span style="font-weight: bold; color: dodgerblue">' + keyword + '</span>(');
                    break;
            }
        }

        return '<div style="font-family: Monaco,\'Lucida Console\',monospace;"><div style="' +
            'font-family: fantasy;' +
            'color: darkolivegreen; ' +
            'user-select: none;' +
            '">' + renderParam + '</div>' +
            '<div style="white-space: normal;">' +
            '<pre style="' +
            'overflow-x: auto; ' +
            'background-color: ' + bgc + '; ' +
            'font-family: Menlo, Monaco, Consolas, \'Courier New\', monospace; ' +
            'margin: 0; ' +
            'border-radius: 0.5rem;' +
            'padding: 0.5rem;' +
            'border-width: 0 0 0 4px;' +
            'border-color: coral;' +
            'border-style: solid;"' +
            '>' + codeTxt + '</pre></div></div>';
    }

    basisParser(bgc?: string): String {
        bgc = bgc ? bgc : '#f1f1f1';
        this._codeTxt = this._codeTxt.replace(/\</g, '&lt;')
            .replace(/&lt;span style/g, '<span style').replace(/&lt;\/span>/g, '</span>');
        let codeTxt = this._codeTxt.toString();

        // 解析注释
        // 第一种注释 格式：#abc\n
        let reg = new RegExp('#.*?\\n'); // 非贪婪匹配
        for (let tmp = reg.exec(codeTxt); tmp != null;) {
            codeTxt = codeTxt.replace(reg, '@anno-' + tmp.toString().substring(1, tmp.toString().length - 1) + '-onna@');
            tmp = reg.exec(codeTxt);
        }
        let reg1 = new RegExp('@anno-.*?-onna@'); // 非贪婪匹配
        for (let tmp = reg1.exec(codeTxt); tmp != null; tmp = reg1.exec(codeTxt)) {
            codeTxt = codeTxt.replace(reg1, '<span style="font-weight: bold; color: #969696; font-size: 80%;">#' + tmp.toString().substring(6, tmp.toString().length - 6) + '</span>\n')
        }
        // 处理结尾处的#注解
        let lastInd = codeTxt.lastIndexOf('#');
        if (lastInd > codeTxt.lastIndexOf('\n')) {
            codeTxt = codeTxt.substring(0, lastInd) + '<span style="font-weight: bold; color: #969696; font-size: 80%;">' + codeTxt.substring(lastInd) + '</span>';
        }

        return '<div style="font-family: Monaco,\'Lucida Console\',monospace;">' +
            '<div style="white-space: normal;">' +
            '<pre style="' +
            'overflow-x: auto; ' +
            'background-color: ' + bgc + '; ' +
            'font-family: Menlo, Monaco, Consolas, \'Courier New\', monospace; ' +
            'margin: 0; ' +
            'border-radius: 0.5rem;' +
            'padding: 0.5rem;' +
            'border-width: 0 0 0 4px;' +
            'border-color: coral;' +
            'border-style: solid;"' +
            '>' + codeTxt + '</pre></div></div>';
    }
}
