/**
 * Created by Gemu on 2017/5/16.
 */
import {Component, AfterViewInit, ViewChild} from "@angular/core";
import {Title} from "@angular/platform-browser";
@Component({
    templateUrl: 'app/comps/stories/mine/add/add.html',
    styleUrls: ['app/assets/styles/stories.css']
})
export class MineAddComponent implements AfterViewInit {

    @ViewChild('editor') editor;

    constructor(title:Title) {
        title.setTitle("添加故事");
    }

    ngAfterViewInit() {
        KindEditor.ready(function (K) {
            var options = {
                cssPath: '/app/assets/styles/kindeditor.css',
                filterMode: false,
                uploadJson: '/fs/api/uploadForm/',
                filePostName: 'file',
                extraFileUploadParams: {
                    filePath: 'story'
                },
                afterUpload: function(url) {
                    console.log(url);

                },
                allowFileManager: true,
                items: [
                    'fullscreen', '|', 'justifyleft', 'justifycenter', 'justifyright', 'justifyfull',
                    'insertorderedlist', 'insertunorderedlist', 'indent', 'outdent', 'subscript',
                    'superscript', 'lineheight', '/', 'formatblock', 'fontname', 'fontsize', '|', 'forecolor',
                    'hilitecolor', 'bold', 'italic', 'underline', 'strikethrough', 'removeformat', '|',
                    'image', 'media', 'insertfile', 'table', 'hr', 'emoticons', 'link', 'unlink'
                ]
            };
            window.editor = K.create(document.getElementById('editor-textarea'), options);
        }, document.getElementById('editor-textarea'));
    }

}