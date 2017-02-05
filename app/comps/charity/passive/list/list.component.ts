/**
 * Created by gemu on 11/27/16.
 */
import {Component, OnInit} from "@angular/core";
import {PassiveService} from "../../../../service/charity/passive/passive.service";
@Component({
    templateUrl: `app/comps/charity/passive/list/list.html`,
    styleUrls: ['app/assets/styles/charity.css'],
    providers: [PassiveService]
})
export class PassiveListComponent implements OnInit {

    ifDetail: boolean[] = []; // 是否显示详细内容
    ifTips: boolean[] = []; // 是否显示用户信息
    notices: any = [];

    constructor(private passiveService: PassiveService) {
    }

    ngOnInit(): void {
        this.passiveService.list().subscribe((resp) => {
            this.notices = resp.json();
        });
    }


}