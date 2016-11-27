/**
 * Created by gemu on 11/26/16.
 */
import {Component} from "@angular/core";
import {Title} from "@angular/platform-browser";
@Component({
    templateUrl: 'app/comps/charity/charity.html',
    styleUrls: ['app/assets/styles/app.css', 'app/assets/styles/charity.css']
})
export class CharityComponent {

    constructor(title: Title) {
        title.setTitle('愿世人多一些爱心');
    }

}