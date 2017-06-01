/**
 * Created by Gemu on 2017/5/16.
 */
import {Component, AfterViewInit, ViewChild} from "@angular/core";
import {Title} from "@angular/platform-browser";
import {StoriesService} from "../../../../service/stories/stories.service";
import {Notify} from "../../../../tools/notification";
@Component({
    templateUrl: 'app/comps/stories/mine/add/add.html',
    styleUrls: ['app/assets/styles/common.css', 'app/assets/styles/stories.css'],
    providers: [StoriesService]
})
export class MineAddComponent implements AfterViewInit {

    @ViewChild('editor') editor;

    constructor(title:Title, private storiesService: StoriesService) {
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

    saveStory(): void {
        let story = {};
        if (window.editor.edit.doc.getElementsByTagName('img').length > 0) {
            story.prevImg = window.editor.edit.doc.getElementsByTagName('img')[0].src;
        }
        let titles = window.editor.text().split('\n');
        story.preWords = titles[0];
        story.author = 'gemu'; //TODO
        let titles = window.editor.text().split('\n');
        story.title = titles[0];
        story.subhead = titles[1];
        story.date = new Date().getTime();
        story.paragraph = window.editor.html();
        this.storiesService.addStory(story).subscribe((resp) => {
            Notify.success('故事添加成功');
        });
    }

}