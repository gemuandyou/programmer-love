/**
 * Created by Gemu on 2017/4/25.
 */
import {Component, AfterViewInit} from "@angular/core";
import {Title} from "@angular/platform-browser";
@Component({
    templateUrl: 'app/comps/freehand/freehand.html'
})
export class FreehandComponent implements AfterViewInit {

    constructor(title: Title) {
        title.setTitle("鼠绘");
    }

    ngAfterViewInit() {
        var script = document.createElement('script');
        document.body.appendChild(script);
        script.type = "text/javascript";
        script.src = 'app/comps/freehand/freehand.js';
    }

}