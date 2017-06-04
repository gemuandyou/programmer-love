/**
 * Created by gemu on 1/25/17.
 */
import {
    Component, ViewChild, AfterViewChecked, AfterContentChecked, NgZone, OnChanges, OnDestroy,
    SimpleChanges, DoCheck, ChangeDetectionStrategy, ChangeDetectorRef, ElementRef, AfterViewInit, OnInit, EventEmitter,
    Input, Output, ComponentFactoryResolver, ViewContainerRef, ComponentFactory, ComponentRef
} from "@angular/core";
import {Title} from "@angular/platform-browser";
import copyWithin = require("core-js/fn/array/copy-within");
import {Mark} from "./mark";
import {ParseStructure, NoteStructure} from "./parse-struct";
import {NotesService} from "../../service/notes/notes.service";
import {Notify} from "../../tools/notification";
import {UUID} from "../../tools/uuid";
import {CodeParser} from "../../tools/code-parser";
import {PasteFormat} from "../../service/notes/paste-format";
import {ModalBoxComponent} from "../modalbox/modalbox.component";
import {AppComponent} from "../../app.component";

@Component({
    templateUrl: 'app/comps/notes/notes.html',
    styleUrls: ['app/assets/styles/common.css'],
    // changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [NotesService, ModalBoxComponent]
})
export class NotesComponent implements OnInit, AfterViewInit, OnDestroy {

    @ViewChild('notesEditor') notesEditor;
    @ViewChild('notesView') notesView;
    @ViewChild('clipboard') clipboard;
    @ViewChild('pasteWay') pasteWay;

    pasteContent:{} = {}; // 粘贴的内容。html内容和文本内容
    pasteSel:any; // 粘贴内容时的getSelection
    pasteRng:any; // 粘贴内容时的Range对象
    pasteFormat:number = PasteFormat.KEEP_FORMAT.valueOf(); // 是否保持粘贴内容格式
    pasteWayEle:any;

    notesEditorEle:any;
    marks:any = Mark.markMap; // html标记的映射对象
    editMark:String = ''; // 正在编辑的html标记
    editIsMark:boolean = false; // 正在编辑的是否是html标记
    notes:String[] = []; // 笔记名列表
    currentNote:String = ''; // 当前笔记
    currentNoteTags:String = ''; // 当前笔记标签

    cache:{} = {}; // 缓存pre标签内容，将pre标签内容与UUID做映射

    @Output() static choosePasteFormatEmit:EventEmitter<any> = new EventEmitter(); // 粘贴内容格式选择事件通知
    @Output() static reRenderPasteContentEmit:EventEmitter<any> = new EventEmitter(); // 重新渲染粘贴内容事件通知

    canInputKey:any[] = ['`', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-', '_', '=', '+', '[', ']', '{', '}', ';', ':', '"', '\'',
        ',', '.', '<', '>', '?', '/'];
    specialWord:String[] = ["@", "#"]; // TODO 2017-01-31 09:43:07 特殊字符需要用\转义

    needPreview = false;
    previewStructures:NoteStructure[]; // 笔记预览
    isFullScreen: boolean = false; // 笔记视图是否全屏

    modalBoxComps:{} = {}; // 模态框Component对象集合
    exportFilePath:string;

    //设置cookie
    private setCookie(cname, cvalue, exdays): void {
        let d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        let expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + "; " + expires;
    }
    //获取cookie
    private getCookie(cname): string {
        let name = cname + "=";
        let ca = document.cookie.split(';');
        for(let i=0; i<ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1);
            if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
        }
        return "";
    }
    //清除cookie  
    private clearCookie(name): void {
        this.setCookie(name, "", -1);
    }

    // 自定义笔记背景
    switchNoteBg(isInit: Boolean): void {
        // 自定义样式（皮肤背景）
        let cssPath = 'app/assets/styles/notes2.css';
        if (this.getCookie('noteBg')) {
            cssPath = 'app/assets/styles/notes.css';
        }
        let noteStyles = document.getElementsByClassName('note-bg-style');
        if (noteStyles && noteStyles[0]) {
            if (!isInit) {
                if (cssPath == 'app/assets/styles/notes.css') { // 三元运算符不好使 T.T
                    cssPath = 'app/assets/styles/notes2.css';
                    this.clearCookie('noteBg');
                } else {
                    cssPath = 'app/assets/styles/notes.css';
                    this.setCookie('noteBg', 'true', 7);
                }
            }
            noteStyles[0].setAttribute('href', cssPath);
        } else {
            let style = document.createElement('link');
            style.className = 'note-bg-style';
            style.rel = "stylesheet";
            style.href = cssPath;
            document.head.appendChild(style);
        }
    }

    constructor(title: Title, private noteService: NotesService, private eleRef: ElementRef, private componentFactoryResolver: ComponentFactoryResolver,
                private viewContainerRef: ViewContainerRef) {
        title.setTitle("程序员日志");
        this.switchNoteBg(true);
        ModalBoxComponent.showEvent.subscribe((modalBoxComp) => {
            this.modalBoxComps[modalBoxComp.identify] = modalBoxComp;
        });
    }

    ngOnInit():void {
        // 加载笔记列表
        this.noteService.listNotes().subscribe((resp) => {
            let listNotes = resp._body;
            if (listNotes) {
                this.notes = listNotes.split(','); // 如果changeDetection: ChangeDetectionStrategy.OnPush，这里的变量不能在页面渲染出来
            }
        });
        this.eleRef.nativeElement.querySelector('.notes').style.visibility = 'visible';
    }

    ngOnDestroy(): void {
        AppComponent.viewDestroy.emit();
    }

    ngAfterViewInit():void {
        NotesComponent.reRenderPasteContentEmit.subscribe(() => {
            this.reRenderPasteContent();
        });
        NotesComponent.choosePasteFormatEmit.subscribe((keyCode) => {
            let childs = this.pasteWayEle.getElementsByTagName('li');
            for (let i = 0; i < childs.length; i++) {
                let child = childs[i];
                if (child.className === 'active') {
                    if (keyCode == 40 && (i + 1) < childs.length) {
                        this.pasteFormat = childs[i + 1].value;
                        break;
                    }
                    if (keyCode == 38 && (i - 1) >= 0) {
                        this.pasteFormat = childs[i - 1].value;
                        break;
                    }
                }
            }
        });
        this.notesEditorEle = this.notesEditor.nativeElement;
        // 监听粘贴事件
        this.notesEditorEle.addEventListener('paste', (e) => {
            let pasteItems = e.clipboardData.items;
            this.pasteHandle(pasteItems);
        });
    }

    static keyDownEventFn(event):void {
        if (event.keyCode === 40 || event.keyCode === 38) {
            event.preventDefault();
            NotesComponent.choosePasteFormatEmit.emit(event.keyCode);
        }
        if (event.keyCode === 13) {
            event.preventDefault();
            NotesComponent.reRenderPasteContentEmit.emit();
            document.removeEventListener('keydown', NotesComponent.keyDownEventFn); // BUG 2017-02-22 17:56:57
        }
    }

    /**
     * 粘贴格式选择
     */
    pasteChooseListener():void {
        // 选择粘贴方式（文本或保留原格式）
        this.pasteWayEle = this.pasteWay.nativeElement;
        this.pasteWayEle.style.display = 'inline-block';
        // 监听上下键事件，切换粘贴方式
        document.addEventListener('keydown', NotesComponent.keyDownEventFn);
    }

    /**
     * 粘贴内容
     * @param sel
     * @param items
     */
    pasteHandle(pasteItems):void {
        this.pasteSel = window.getSelection();
        // 在编译器中 获取光标位置
        this.pasteRng = this.pasteSel.getRangeAt(0);
        let beforeEc = this.pasteRng.endContainer;
        let beforeEo = this.pasteRng.endOffset;
        let pasteRngTmp = document.createRange();
        pasteRngTmp.setStart(beforeEc, beforeEo);
        for (let item of pasteItems) {
            // HTML内容
            if (item.kind === 'string' && 'text/html' === item.type) {
                item.getAsString((s) => {
                    s = s.replace(/<html>/g, '')
                        .replace(/<\/html>/g, '')
                        .replace(/<body>/g, '')
                        .replace(/<\/body>/g, '');
                    if (s.indexOf('<pre ') !== -1 && s.toString().lastIndexOf('</pre>') !== -1) {
                        s = s.substring(s.indexOf('<pre ') + 5, s.toString().lastIndexOf('</pre>') + 6);
                        let tmp = s.substring(s.indexOf('style=') + 6);
                        let quo = tmp.charAt(0);
                        tmp = tmp.substring(1);
                        let style = tmp.substring(0, tmp.indexOf(quo));
                        let remain = tmp.substring(tmp.indexOf(quo));
                        s = '<pre style="overflow: auto; border-radius: 0.5rem;padding: 0.5rem;' + style + remain;
                    } else {
                        s = '<pre style="overflow: auto; border-radius: 0.5rem;padding: 0.5rem;">' + s + '</pre>';
                    }
                    this.pasteContent['html'] = s;
                    // 在编译器中 获取光标位置
                    this.pasteRng = this.pasteSel.getRangeAt(0);
                    let afterEc = this.pasteRng.endContainer;
                    let afterEo = this.pasteRng.endOffset;
                    // // 删除复制的文本内容
                    pasteRngTmp.setEnd(afterEc, afterEo);
                    this.pasteSel.removeAllRanges();
                    this.pasteSel.addRange(pasteRngTmp);
                    this.pasteSel.deleteFromDocument();
                    this.pasteRng = this.pasteSel.getRangeAt(0);
                    this.pasteRng.deleteContents();
                });
                this.pasteChooseListener();
            }
            // 普通文本
            if (item.kind === 'string' && 'text/plain' === item.type) {
                item.getAsString((s) => {
                    s = s.replace(/[<>&"]/g, function (c) {
                        return {'<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;'}[c];
                    });
                    this.pasteContent['plain'] = s;
                    // 在编译器中 获取光标位置
                    this.pasteRng = this.pasteSel.getRangeAt(0);
                    let afterEc = this.pasteRng.endContainer;
                    let afterEo = this.pasteRng.endOffset;
                    // 删除复制的文本内容
                    pasteRngTmp.setEnd(afterEc, afterEo);
                    this.pasteSel.removeAllRanges();
                    this.pasteSel.addRange(pasteRngTmp);
                    this.pasteSel.deleteFromDocument();
                    this.pasteRng = this.pasteSel.getRangeAt(0);
                    this.pasteRng.deleteContents();
                });
                this.pasteChooseListener();
            }
            // 文件
            if (item.kind === 'file' && /image\//.test(item.type)) { // 粘贴图片
                let blob = item.getAsFile();
                let reader = new FileReader();
                reader.onload = (event) => {
                    let eventTarget:any = event.target;

                    // 在编辑器中 获取光标位置，直接生成图片
                    // let sel = window.getSelection();
                    // let rng = sel.getRangeAt(0);
                    // rng.deleteContents();
                    // let imgEle = document.createElement('img');
                    // imgEle.src = event.target.result;
                    // rng.insertNode(imgEle);
                    // rng.collapse(true);
                    // sel.removeAllRanges();
                    // sel.addRange(rng);

                    // 在编译器中 获取光标位置，生成图片标签
                    let imgSrc = eventTarget.result;

                    let sel = window.getSelection();
                    let rng = sel.getRangeAt(0);
                    rng.deleteContents();

                    let cpImgUrl:String = ''; // 粘贴过来的图片，解析后生成路径

                    // 保存截图
                    this.noteService.saveImg({data: imgSrc}).subscribe((resp) => {
                        if (resp.status === 200) {
                            cpImgUrl = resp._body;
                            let imgTagTextEle = document.createTextNode('-[' + cpImgUrl + '] ');
                            rng.insertNode(imgTagTextEle);

                            let imgTagEle = document.createElement('span');
                            imgTagEle.style.fontSize = 'italic';
                            imgTagEle.style.color = '#00c0ff';
                            imgTagEle.contentEditable = 'false';
                            let imgTagName = document.createTextNode('@img');
                            imgTagEle.appendChild(imgTagName);
                            rng.insertNode(imgTagEle);

                            rng = rng.cloneRange();
                            rng.collapse(false);
                            sel.removeAllRanges();
                            sel.addRange(rng);
                        }
                    });
                };
                reader.readAsDataURL(blob);
                break;
            }
        }
    }

    /**
     * 重新渲染粘贴的内容
     */
    reRenderPasteContent():void {
        // 保留格式
        if (this.pasteFormat === PasteFormat.KEEP_FORMAT.valueOf() && (this.pasteContent['html'] || !this.pasteContent['plain'])) {
            // 将删除的文本内容渲染成@pre标签
            let uuid = UUID.generate();
            this.cache[uuid] = this.pasteContent['html'];
            let preTagTextEle = document.createTextNode('-@[' + uuid + ']@ ');
            this.pasteRng.insertNode(preTagTextEle);

            let preTagEle = document.createElement('span');
            preTagEle.style.fontSize = 'italic';
            preTagEle.style.color = '#00c0ff';
            preTagEle.contentEditable = 'false';
            let imgTagName = document.createTextNode('@pre');
            preTagEle.appendChild(imgTagName);
            this.pasteRng.insertNode(preTagEle);

            let pasteRng = this.pasteRng.cloneRange();
            this.pasteRng.collapse(false);
            this.pasteSel.removeAllRanges();
            this.pasteSel.addRange(pasteRng);
        }
        // 解析为Java代码
        if (this.pasteFormat === PasteFormat.JAVA_FORMAT.valueOf() && (this.pasteContent['plain'] || !this.pasteContent['html'])) {
            // 将删除的文本内容渲染成@pre标签
            let code = this.pasteContent['plain'];
            code = new CodeParser(code).codeParser('java');

            let uuid = UUID.generate();
            this.cache[uuid] = code;
            let preTagTextEle = document.createTextNode('-@[' + uuid + ']@ ');
            this.pasteRng.insertNode(preTagTextEle);

            let preTagEle = document.createElement('span');
            preTagEle.style.fontSize = 'italic';
            preTagEle.style.color = '#00c0ff';
            preTagEle.contentEditable = 'false';
            let imgTagName = document.createTextNode('@pre');
            preTagEle.appendChild(imgTagName);
            this.pasteRng.insertNode(preTagEle);

            let pasteRng = this.pasteRng.cloneRange();
            this.pasteRng.collapse(false);
            this.pasteSel.removeAllRanges();
            this.pasteSel.addRange(pasteRng);
        }
        // 纯文本
        if (this.pasteFormat === PasteFormat.TEXT.valueOf() && (this.pasteContent['plain'] || !this.pasteContent['html'])) {
            let code = this.pasteContent['plain'];
            let text = document.createTextNode(code);
            this.pasteRng.insertNode(text);

            let pasteRng = this.pasteRng.cloneRange();
            this.pasteRng.collapse(false);
            this.pasteSel.removeAllRanges();
            this.pasteSel.addRange(pasteRng);
        }
        this.pasteWayEle.style.display = 'none';
        this.pasteContent = {};
    }

    /**
     * 编辑内容更改
     */
    changeEdit(event):void {
        let currText = this.notesEditorEle.innerText;
        let sel = window.getSelection();

        if (event.key == 'Backspace' && this.editMark == '@') { // 输入“@”后，按了删除键
            this.editMark = '';
            this.editIsMark = false;
        }

        let rng = sel.getRangeAt(0);
        let endEle = rng.endContainer;
        let endTxt = endEle.textContent;
        let endOffset = rng.endOffset;
        // 输入为标签开始
        if (endTxt.charAt(endOffset - 1) == '@'
            //|| event.key == '@' || event.key == 'Process'
        ) {
            this.editMark = '@';
            this.editIsMark = true;
            return;
        } else if (event.key == ' ') {
            this.editMark = '';
            this.editIsMark = false;
            return;
        } else if (event.key == 'Escape') {
            this.pasteWayEle.style.display = 'none';
            this.pasteContent = {};
            return;
        } else if (event.key === 'Enter') {
            this.editMark = '';
            this.editIsMark = false;
        }

        if (this.editIsMark) {
            // 可以在任意地方写标签（当然不能在标签里=。=！）
            let rng = sel.getRangeAt(0);
            let endEle = rng.endContainer;
            let endTxt = endEle.textContent;
            let endOffset = rng.endOffset;
            endTxt = endTxt.substring(0, endOffset);
            this.editMark = endTxt.substring(endTxt.lastIndexOf("@"), endOffset);
            // 只能在最后写标签
            // if (originalHtml.indexOf('<br>') !== -1 && originalHtml.indexOf('<br>') > originalHtml.lastIndexOf('@')) {
            //     this.editMark = originalHtml.substring(originalHtml.lastIndexOf('@'), originalHtml.indexOf('<br>'));
            // } else {
            //     this.editMark = originalHtml.substring(originalHtml.lastIndexOf('@'));
            // }
            // this.editMark = this.editMark.replace(/<(\/[a-z]*|[a-z]*)>/g, '').replace(/\n/g, '').replace(/ /g, '');
            let isMark = this.checkMark(this.editMark);
            if (isMark) {
                let editSpans:HTMLCollectionOf<Element> = document.getElementsByClassName('edit-span');
                for (let index = 0; index < editSpans.length; index++) {
                    editSpans[index].className = editSpans[index].className.replace(/edit\-span/g, '');
                }

                // 2017-03-03 14:41:29 根据当前光标位置获取之前和之后的内容（分隔editor中的内容）
                let positionEle = document.createElement('div');
                let positionEleClassName;
                do {
                    positionEleClassName = 'position-span-' + new Date().getTime();
                } while (!document.getElementsByClassName(positionEleClassName));
                let positionEleHtml = '<span class="' + positionEleClassName + '"></span>';
                positionEle.innerHTML = positionEleHtml;
                rng.insertNode(positionEle.childNodes[0]);
                let originalHtml = this.notesEditorEle.innerHTML;
                let remainHtml = originalHtml.substring(originalHtml.indexOf(positionEleHtml) + positionEleHtml.length);
                originalHtml = originalHtml.substring(0, originalHtml.indexOf(positionEleHtml) - this.editMark.length);

                let isSpecialMark = this.checkSpecialMark(this.editMark);
                let cursorOffsetSt = 0; // 光标起始偏移量
                let cursorOffsetEd = 0; // 光标终止偏移量
                switch (isSpecialMark) {
                    case 1:
                        originalHtml += '<span style="font-style: italic; color: #00c0ff;" contenteditable="false" class="edit-span">' + this.editMark + '</span>-[]';
                        cursorOffsetSt = cursorOffsetEd = 2;
                        break;
                    case 2:
                        originalHtml += '<span style="font-style: italic; color: #00c0ff;" contenteditable="false" class="edit-span">' + this.editMark + '</span>-()';
                        cursorOffsetSt = cursorOffsetEd = 2;
                        break;
                    case 3:
                        let color = 'yellow';
                        if (this.editMark === '@fc')
                            color = 'blue';
                        originalHtml += '<span style="font-style: italic; color: #00c0ff;" contenteditable="false" class="edit-span">' + this.editMark + '</span>-' + color +
                            '-' + '<span style="font-style: italic; color: #00c0ff;" contenteditable="false">' + '>' + '</span> ';
                        cursorOffsetSt = 1, cursorOffsetEd = color.length + 1;
                        break;
                    case 4:
                        originalHtml += '<span style="font-style: italic; color: #00c0ff;" contenteditable="false" class="edit-span">' + this.editMark + '</span>-@[]@';
                        cursorOffsetSt = cursorOffsetEd = 3;
                        break;
                    case 5:
                        originalHtml += '<span style="font-style: italic; color: #00c0ff;" contenteditable="false" class="edit-span">' + this.editMark + '</span>-basis-@[]@';
                        cursorOffsetSt = 1, cursorOffsetEd = 6;
                        break;
                    default:
                        originalHtml += '<span style="font-style: italic; color: #00c0ff;" contenteditable="false" class="edit-span">' + this.editMark + '</span>-';
                        cursorOffsetSt = cursorOffsetEd = 1;
                        if (this.editMark === '@tab') {
                            this.editIsMark = false;
                        }
                        break;
                }
                this.notesEditorEle.innerHTML = originalHtml + remainHtml;
                this.editIsMark = false;
                this.editMark = '';

                // 将光标移动到末尾
                let range = document.createRange();
                let editSpans1:HTMLCollectionOf<Element> = document.getElementsByClassName('edit-span');
                let editTxtEle = editSpans1[0].nextSibling;
                range.selectNodeContents(editTxtEle);
                range.setStart(range.startContainer, cursorOffsetSt);
                range.setEnd(range.endContainer, cursorOffsetEd);
                // range.collapse(false);
                sel.removeAllRanges();
                sel.addRange(range);
                // document.execCommand('removeFormat', false, null); // 将选中的区域删除其格式化标签。第二个参数为是否弹窗提示.toggle效果
            }
            if (this.editMark.length > 10) {
                this.editIsMark = false;
                this.editMark = '';
            }
        }

        if (((event.key === 'Control' || event.ctrlKey) && event.key === '`') || event.key === 'Enter') { // ctrl + s
            this.parseNote(currText);
            this.saveNote();
        }
    }

    private parseNote(noteEditorContent:String):void {
        if (noteEditorContent) {
            let html = '';
            let isSerial = false;
            let serialHtml = '';
            let linesHtml = noteEditorContent.split('\n');
            for (let lineHtml of linesHtml) {
                if (lineHtml.indexOf('@[') !== -1) {
                    isSerial = true;
                }
                if (lineHtml.indexOf(']@') !== -1) {
                    isSerial = false;
                    serialHtml += lineHtml;
                }
                if (isSerial) {
                    serialHtml += lineHtml;
                    serialHtml += '\n';
                    continue;
                }

                // 换行
                if (lineHtml === '') {
                    if (html.match(/<blockquote style="margin-right: 0">/g) &&
                        (!html.match(/<\/blockquote>/g) || html.match(/<blockquote style="margin-right: 0">/g).length !== html.match(/<\/blockquote>/g).length)) {
                        if (html.endsWith("<br><br>")) {
                            html = html.substring(0, html.length - 8);
                        }
                        html += '</blockquote>';
                    } else {
                        html += '<br>';
                    }
                    continue;
                }

                if (serialHtml !== '') {
                    html += this.renderView(serialHtml);
                    serialHtml = '';
                } else {
                    html += this.renderView(lineHtml);
                }

            }
            // H1~H6样式修改
            html = html.replace(/<\/h1><br>/g, '</h1>')
                .replace(/<\/h2><br>/g, '</h1>')
                .replace(/<\/h3><br>/g, '</h1>')
                .replace(/<\/h4><br>/g, '</h1>')
                .replace(/<\/h5><br>/g, '</h1>')
                .replace(/<\/h6><br>/g, '</h1>');

            if (this.currentNoteTags) {
                html = '<div style="position: relative;left: -3rem;display:inline-block;' +
                    'background-color: rgba(169, 169, 0, 0.66);padding: 2px 7px;font-size: 0.7rem;border-radius: 7px;' +
                    'color: #fbfbfb;line-height: 1.3rem;">' + this.currentNoteTags + '</div>' + html;
            }
            this.notesView.nativeElement.innerHTML = html;
        }
    }

    /**
     * 解析编辑器的文本内容到视图模块中
     * @param text
     */
    private renderView(text:String):String {
        text = text.replace(/@tab-/g, '<blockquote style="margin-right: 0">');
        for (let mark of this.marks) {
            while (text.indexOf(mark.key + '-') !== -1) {
                let newText = '';
                let attachParam = '';
                let beforeText = text.substring(0, text.indexOf(mark.key + '-'));
                newText += beforeText;

                let afterText = text.substring(text.indexOf(mark.key + '-') + (mark.key + '-').length);
                let handleText = afterText.substring(0);
                let markType = this.checkSpecialMark(mark.key);
                // 截取标签后的内容
                if (markType === 0 && afterText.indexOf(' ') !== -1) {
                    handleText = afterText.substring(0, afterText.indexOf(' '));
                    afterText = afterText.substring(afterText.indexOf(' ') + 1);
                } else if (markType === 1) {
                    if (afterText.indexOf(' ') !== -1) {
                        handleText = afterText.substring(0, afterText.indexOf(' '));
                        afterText = afterText.substring(afterText.indexOf(' ') + 1);
                    } else {
                        handleText = afterText;
                        afterText = '';
                    }
                } else if (markType === 2) {
                    handleText = afterText.substring(0, afterText.lastIndexOf(')') + 1);
                    afterText = afterText.substring(afterText.lastIndexOf(')') + 1);
                } else if (markType === 3) {
                    let attachParamEo = afterText.indexOf('->');
                    attachParam = afterText.substring(0, attachParamEo);
                    if (afterText.indexOf(' ') !== -1) {
                        handleText = afterText.substring(attachParamEo + 2, afterText.indexOf(' '));
                        afterText = afterText.substring(afterText.indexOf(' ') + 1);
                    } else {
                        handleText = afterText.substring(attachParamEo + 2);
                        afterText = '';
                    }
                } else if (markType === 4) { // TODO @pre标签目前不支持手动写
                    if (afterText.indexOf(']@') !== -1) {
                        handleText = afterText.substring(afterText.indexOf('@['), afterText.indexOf(']@') + 2);
                        afterText = afterText.substring(afterText.indexOf(']@') + 2);
                    }
                } else if (markType === 5) {
                    let attachParamEo = afterText.indexOf('-@[');
                    attachParam = afterText.substring(0, attachParamEo);
                    if (afterText.indexOf(']@') !== -1) {
                        handleText = afterText.substring(afterText.indexOf('@[') + 2, afterText.indexOf(']@'));
                        afterText = afterText.substring(afterText.indexOf(']@') + 2);
                    }
                } else {
                    afterText = '';
                }
                handleText = handleText.replace(mark.key + '-', '');
                let html = this.parseToHtml(handleText, mark.val, attachParam);
                newText += html;

                newText += afterText;
                text = newText;
            }
        }
        if (text[text.length - 1] === '\\' || text[text.length - 1] === '、') {
            text = text.substr(0, text.length - 1);
        } else {
            text += '<br>';
        }
        return text;
    }

    /**
     * 解析文本内容为html
     * @param text 内容
     * @param markName 标签名
     * @param renderParam 特俗参数。如样式参数
     */
    private parseToHtml(text:String, markName:String, renderParam?:String):String {
        let html = '';
        switch (markName) {
            case 'H1':
                html = '<h1>' + text + '</h1>';
                break;
            case 'H2':
                html = '<h2>' + text + '</h2>';
                break;
            case 'H3':
                html = '<h3>' + text + '</h3>';
                break;
            case 'H4':
                html = '<h4>' + text + '</h4>';
                break;
            case 'H5':
                html = '<h5>' + text + '</h5>';
                break;
            case 'H6':
                html = '<h6>' + text + '</h6>';
                break;
            case 'BOLD':
                html = '<span style="font-weight: bold;">' + text + '</span>';
                break;
            case 'ITALIC':
                html = '<span style="font-style: italic;">' + text + '</span>';
                break;
            case 'URL':
                let href = text.substring(text.indexOf('[') + 1, text.indexOf(']'));
                let aTxt = text.substring(text.indexOf(']') + 1);
                html = '<a href="' + href + '" target="_blank">' + aTxt + '</a>';
                break;
            case 'OL':
                let olTxt = text.substring(text.indexOf('(') + 1, text.indexOf(')'));
                let liTxts:String[] = olTxt.split('#');
                html = '<ol style="margin: 0;">';
                for (let liTxt of liTxts) {
                    if (liTxt) {
                        html += '<li>' + liTxt + '</li>';
                    }
                }
                html += '</ol>';
                break;
            case 'UL':
                let ulTxt = text.substring(text.indexOf('(') + 1, text.lastIndexOf(')'));
                liTxts = ulTxt.split('#');
                html = '<ul style="margin: 0;">';
                for (let liTxt of liTxts) {
                    if (liTxt) {
                        html += '<li>' + liTxt + '</li>';
                    }
                }
                html += '</ul>';
                break;
            case 'IMG':
                let src = text.substring(text.indexOf('[') + 1, text.indexOf(']'));
                html = '<img src="' + src + '"/>';
                break;
            case 'PRE':
                html = text.substring(text.indexOf('@[') + 2, text.lastIndexOf(']@')); // 若不存在'@['则从0开始了
                html = this.cache[html];
                break;
            case 'FontColor':
                html = '<span style="color: ' + renderParam + ';">' + text + '</span>';
                break;
            case 'FontBackgroundColor':
                html = '<span style="background-color: ' + renderParam + ';margin: 0 0 0 0.5rem;padding: 0.2rem;border: 1px solid rgba(82, 78, 78, 0.22);                border-radius: 0.2rem;font-size: 0.5rem;">' + text + '</span>';
                break;
            case 'CODE':
                if (renderParam) {
                    html = new CodeParser(text).codeParser(renderParam).toString();
                } else {
                    html = new CodeParser(text).basisParser().toString();
                }
                break;
            case 'TIP':
                html = '<pre style="' +
                    'white-space: normal;' +
                    'word-break: break-all;' +
                    'background-color: lightyellow; ' +
                    'font-family: \'Helvetica Neue\', Helvetica, Arial, sans-serif;' +
                    'font-size: 0.8rem;' +
                    'margin: 0; ' +
                    'border-radius: 0.5rem;' +
                    'padding: 0.5rem;' +
                    'border-width: 1px;' +
                    'border-color: #bfb4b0;' +
                    'border-style: solid;">' + text.substring(text.indexOf('@[') + 2, text.lastIndexOf(']@')) + '</pre>'; // 若不存在'@['则从0开始了
                break;
            case 'HR':
                let ctx = '';
                if (text) {
                    ctx = '<span style="line-height: 0rem;background-color: #bdbdbd;border-radius: 0.3rem;padding: 0 0.3rem;color: #fff676;">' + text + '</span>';
                }
                html = '<div style="border-top: 1px solid #ddddd8;height: 1px;margin: 0.7rem 0;text-align: center;">' + ctx + '</div>';
                break;
        }
        return html;
    }

    /**
     * 检查是否是标签
     * @param text
     * @returns {boolean}
     */
    private checkMark(text:String):boolean {
        for (let mark of this.marks) {
            if (mark.key === text) {
                return true;
            }
        }
        return false;
    }

    /**
     * 检查是否是特殊标签。如：@url[] @ol()等
     * @param markName
     * @returns {number}
     */
    private checkSpecialMark(markName:String):Number {
        let paramMarks:String[] = ['@url', '@img']; // 需要参数的标签
        let includeMarks:String[] = ['@ol', '@ul']; // 需要包含内容的标签
        let styleMarks:String[] = ['@fc', '@fbc']; // 需要颜色样式参数的标签
        let specialParamMarks:String[] = ['@pre', '@tip']; // 1:参数中包含特俗符号的标签，所有参数都当做普通字符串处理。2:提示标签 内容用@[和]@括起来
        let codeMarks:String[] = ['@code']; // 代码标签
        if (paramMarks.indexOf(markName) !== -1) {
            return 1; // 带参数标签
        } else if (includeMarks.indexOf(markName) !== -1) {
            return 2; // 包含结构标签
        } else if (styleMarks.indexOf(markName) !== -1) {
            return 3; // 带颜色样式参数标签
        } else if (specialParamMarks.indexOf(markName) !== -1) {
            return 4; // 带参数标签。参数内容用@[和]@括起来
        } else if (codeMarks.indexOf(markName) !== -1) {
            return 5; // 代码标签
        } else {
            return 0;
        }
    }

    /**
     * 保存笔记。将编辑的内容保存
     */
    saveNote():void {
        this.notesEditorEle = this.notesEditor.nativeElement;
        if (this.notesEditorEle) {
            let notesContent = this.notesEditorEle.innerHTML;
            notesContent = this.editComplication(notesContent);
            this.noteService.saveNote({noteData: notesContent, noteName: this.currentNote, tags: this.currentNoteTags}).subscribe((resp) => {
                if (resp.status === 200) {
                    Notify.success('保存成功');
                    if (this.notesEditor.nativeElement.scrollTop > this.notesEditor.nativeElement.scrollHeight - 500) {
                        // view模块向下滚动到底
                        this.notesEditor.nativeElement.scrollTop = this.notesEditor.nativeElement.scrollHeight;
                        this.notesView.nativeElement.scrollTop = this.notesView.nativeElement.scrollHeight;
                    }
                    this.ngOnInit();
                }
            });
        }
    }

    getNote(note:String):void {
        this.noteService.getNote(note).subscribe((resp) => {
            if (resp.status === 200) {
                this.needPreview = false;
                this.notesView.nativeElement.scrollTop = 0;
                this.notesEditorEle = this.notesEditor.nativeElement;
                let noteJson = JSON.parse(resp._body);
                let noteDate = noteJson.noteData;
                this.currentNoteTags = noteJson.tags;
                noteDate = this.editSimplify(noteDate);
                this.notesEditorEle.innerHTML = '<pre>' + noteDate + '</pre>';
                this.parseNote(this.notesEditorEle.innerText);
            }
        });
    }

    newNote():void {
        this.currentNote = '';
        this.currentNoteTags = '';
        this.notesEditor.nativeElement.innerHTML = '';
        this.notesView.nativeElement.innerHTML = '';
        let notesListEle:HTMLCollectionOf<Element> = document.getElementsByClassName("notes-list");
        if (notesListEle.length > 0) {
            let notesEle = notesListEle[0].children;
            for (let i = 0; i < notesEle.length; i++) {
                notesEle[i].removeAttribute('class');
            }
        }
    }

    /**
     * 将pre标签内容用UUID替换
     * @param body
     * @returns {String}
     */
    editSimplify(body:String):String {
        let reg = /@pre<\/span>\-@\[((?!\]@)[\s\S])*\]@/g;
        let original = body.toString();
        let result;
        while ((result = reg.exec(original)) != null) {
            let uuid = UUID.generate();
            let preCtx = result[0];
            preCtx = preCtx.substring(14, preCtx.length - 2);
            this.cache[uuid] = preCtx;
            body = body.replace(result[0], '@pre</span>-@[' + uuid + ']@');
        }
        return body;
    }

    /**
     * 将用UUID替换的pre标签内容恢复
     * @param body
     * @returns {string}
     */
    editComplication(body:String):String {
        let reg = /@pre<\/span>\-@\[[0-9a-z\-]{36}\]@/g;
        let original = body.toString();
        let result;
        while ((result = reg.exec(original)) != null) {
            let preCtx = result[0];
            preCtx = preCtx.substring(14, preCtx.length - 2);
            body = body.replace(result[0], '@pre</span>-@[' + this.cache[preCtx] + ']@');
        }
        return body;
    }

    /**
     * 切换笔记激活状态
     * @param e
     */
    toggleActive(e):void {
        let currEle = e.target;
        let childrenEle = currEle.parentElement.children;
        for (let ele of childrenEle) {
            ele.removeAttribute('class');
        }
        currEle.setAttribute('class', 'active');
        this.currentNote = currEle.textContent;
        this.getNote(this.currentNote);
    }

    /**
     * 预览笔记
     */
    previewNote():void {
        let parseStructure = new ParseStructure();
        this.previewStructures = parseStructure.parseStructure(this.notesView.nativeElement);
    }

    /**
     * 预览定位
     * @param dom
     */
    positionPreview(dom:HTMLElement) {
        let notesViewEle = this.notesView.nativeElement;
        notesViewEle.scrollTop = dom.offsetTop;
    }

    /**
     * 设置笔记标签
     */
    setNoteTag() {
        if (!this.notesEditor.nativeElement.innerHTML) {
            Notify.error('没有内容可以设置标签');
            return;
        }
        this.modalBoxComps['setTag'].openModal("填写日志标签，使用分号分隔。");
        this.modalBoxComps['setTag'].confirmEvent.subscribe(() => {
            this.saveNote();
            this.getNote(this.currentNote);
        });
    }

    /**
     * 导出笔记
     */
    exportNote():void {
        if (!this.notesEditor.nativeElement.innerHTML) {
            Notify.error('没有内容可以导出');
            return;
        }
        this.modalBoxComps['export'].openModal("填写日志导入路径");
        this.modalBoxComps['export'].confirmEvent.subscribe(() => {
            let html = document.getElementsByTagName('html')[0].innerHTML;
            let htmlTmp:HTMLElement = document.createElement('html');
            htmlTmp.style.display = 'none';
            htmlTmp.innerHTML = html;
            htmlTmp.getElementsByTagName('modal-box')[0].remove();
            htmlTmp.getElementsByClassName('form')[0].remove();
            htmlTmp.getElementsByClassName('edit')[0].remove();
            htmlTmp.getElementsByClassName('menu')[0].remove();
            htmlTmp.getElementsByClassName('note-preview')[0].remove();
            htmlTmp.getElementsByClassName('notes')[0].setAttribute('style', 'overflow:hidden');
            htmlTmp.getElementsByClassName('view')[0].setAttribute('style', 'height:100%;width:calc(100% - 7rem)');
            let imgEles:NodeListOf<HTMLImageElement> = htmlTmp.getElementsByTagName('img');
            let linkEles:NodeListOf<HTMLLinkElement> = htmlTmp.getElementsByTagName('link');
            let scriptEles:NodeListOf<HTMLScriptElement> = htmlTmp.getElementsByTagName('script');
            let assets = [];
            for (let i = 0; i < imgEles.length; i++) {
                let img:HTMLImageElement = imgEles.item(i);
                assets.push(img.src);
                img.src = './assets/' + img.src.substring(img.src.lastIndexOf('/') + 1);
            }
            for (let i = 0; i < linkEles.length; i++) {
                let link:HTMLLinkElement = linkEles.item(i);
                assets.push(link.href);
                link.href = './assets/' + link.href.substring(link.href.lastIndexOf('/') + 1);
            }
            for (let i = 0; i < scriptEles.length; i++) {
                let script:HTMLScriptElement = scriptEles.item(i);
                assets.push(script.src);
                script.src = './assets/' + script.src.substring(script.src.lastIndexOf('/') + 1);
            }
            html = htmlTmp.innerHTML;
            html = html.replace('<head>', '<head><base href=".">');
            htmlTmp.remove();
            this.noteService.exportNote({path: this.exportFilePath, html: '<!DOCTYPE html>\n<html>' + html + '</html>', assets: assets})
                .subscribe((resp) => {
                    if (resp.status == 200) {
                        Notify.success('保存成功.位置: ' + resp._body);
                    }
                });
        });
    }

    /**
     * 笔记试图全屏和取消全屏
     */
    fullScreen(): void {
        if (this.isFullScreen) {
            this.eleRef.nativeElement.querySelector('.notes').setAttribute('style', 'overflow:auto;');
            this.eleRef.nativeElement.querySelector('.view').setAttribute('style', 'height:calc(60% - 1rem);width:calc(100% - 10rem - 7rem);');
        } else {
            this.eleRef.nativeElement.querySelector('.notes').setAttribute('style', 'overflow:hidden;');
            this.eleRef.nativeElement.querySelector('.view').setAttribute('style', 'height:calc(100% - 3rem);width:calc(100% - 7rem);');
        }
        this.isFullScreen = !this.isFullScreen;
    }

    getArray(length: number): Array<any> {
        return new Array(length);
    }

}