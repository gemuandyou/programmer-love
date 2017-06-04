/**
 * Created by Gemu on 2017/5/16.
 */
import {Component, OnInit, ViewEncapsulation, ViewChild} from "@angular/core";
import {ActivatedRoute} from '@angular/router';
import {HashLocationStrategy,LocationStrategy} from '@angular/common';
import {Title} from "@angular/platform-browser";
import {StoriesService} from "../../../service/stories/stories.service";

@Component({
    templateUrl: 'app/comps/stories/detail/detail.html',
    styleUrls: ['app/assets/styles/stories.css'],
    providers: [StoriesService, {provide: LocationStrategy,useClass: HashLocationStrategy}],
    encapsulation: ViewEncapsulation.None
})
export class DetailComponent implements OnInit {

    story: any = {};
    @ViewChild("body") bodyEle;

    constructor(title: Title, private route: ActivatedRoute, private storiesService: StoriesService) {
        title.setTitle("故事详情");
    }

    ngOnInit():void {
        console.log('init')
        this.route.params.subscribe(params => {
            let id = params['id'];
            this.storiesService.getStory(id).subscribe((resp) => {
                if (resp.status == 200) {
                    this.story = JSON.parse(resp._body);
                    this.bodyEle.nativeElement.innerHTML = this.story.paragraph;
                }
            });
        });
    }

}