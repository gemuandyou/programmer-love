/**
 * Created by Gemu on 2017/5/16.
 */
import {Component, AfterViewInit, ViewChild} from "@angular/core";
import {Title} from "@angular/platform-browser";
import {StoriesService} from "../../../../service/stories/stories.service";
import {Notify} from "../../../../tools/notification";
import {Cookie} from "../../../../tools/cookie";

@Component({
    templateUrl: 'app/comps/stories/mine/add/add.html',
    styleUrls: ['app/assets/styles/common.css'],
    providers: [StoriesService]
})
export class MineAddComponent implements AfterViewInit {

    @ViewChild('editor') editor;

    constructor(title:Title, private storiesService: StoriesService) {
        title.setTitle("添加故事");
    }

    ngAfterViewInit() {

        // 判断浏览器类型，区分移动端和PC端
        // this.browserInfo = navigator.appVersion;
        var style = document.createElement('style');
        let isAndroid = navigator.appVersion.match(/android/gi);
        let isIPhone = navigator.appVersion.match(/iphone/gi);
        let isIPad = navigator.appVersion.match(/iPad/gi);
        let isPc = !isAndroid && !isIPhone && !isIPad;
        if (!isPc) {
            style.innerText = '.ke-dialog{width: 90% !important;}.ke-dialog-mask{width: 100% !important;}';
        }
        document.head.appendChild(style);

        let items = [
            'fullscreen', '|', 'justifyleft', 'justifycenter', 'justifyright', 'justifyfull',
            'insertorderedlist', 'insertunorderedlist', 'indent', 'outdent', 'subscript',
            'superscript', 'lineheight', '/', 'formatblock', 'fontname', 'fontsize', '|', 'forecolor',
            'hilitecolor', 'bold', 'italic', 'underline', 'strikethrough', 'removeformat', '|',
            'image', 'media', 'insertfile', 'table', 'hr', 'emoticons', 'link', 'unlink'
        ];
        if (!isPc) {
            items = [
                'fullscreen', '|', 'justifyleft', 'justifycenter', 'justifyright', 'justifyfull',
                'insertorderedlist', 'insertunorderedlist', 'indent', 'outdent', 'lineheight', '/', 
                'formatblock', 'fontname', 'fontsize', '|', 'forecolor',
                'hilitecolor', 'bold', 'italic', 'underline', 'strikethrough', 'removeformat', '/',
                'image', 'media', 'table', 'hr', 'emoticons'
            ];
        }
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
                items: items
            };
            window.editor = K.create(document.getElementById('editor-textarea'), options);
        }, document.getElementById('editor-textarea'));
    }

    saveStory(ev): void {
        ev.target.setAttribute('disabled', 'disabled');
        let story = {};
        if (window.editor.edit.doc.getElementsByTagName('img').length > 0) {
            story['prevImg'] = window.editor.edit.doc.getElementsByTagName('img')[0].src;
        }
        let titles = window.editor.text().split('\n');
        story['preWords'] = titles[0];

        let friendName = Cookie.getCookie('friend');
        if (friendName && friendName != 'undefined') {
            story['author'] = friendName;
        } else {
            story['author'] = '葫芦娃'; //TODO
        }

        story['title'] = titles[0];
        story['subhead'] = titles[1];
        story['date'] = new Date().getTime();
        story['paragraph'] = window.editor.html();
        this.storiesService.addStory(story).subscribe((resp) => {
            Notify.success('故事添加成功');
        });
    }

}