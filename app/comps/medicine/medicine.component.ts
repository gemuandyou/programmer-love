/**
 * Created by Gemu on 2017/4/24.
 */
import {Component} from "@angular/core";
import {Title} from "@angular/platform-browser";
@Component({
    templateUrl: 'app/comps/medicine/medicine.html',
    styleUrls: ['app/assets/styles/medicine.css']
})
export class MedicineComponent {
    constructor(title: Title) {
        title.setTitle("医学");
    }
}