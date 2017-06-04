/**
 * Created by Gemu on 2017/4/24.
 */
import {Component, OnDestroy} from "@angular/core";
import {Title} from "@angular/platform-browser";
import {AppComponent} from "../../app.component";
@Component({
    templateUrl: 'app/comps/medicine/medicine.html',
    styleUrls: ['app/assets/styles/medicine.css']
})
export class MedicineComponent implements OnDestroy{
    constructor(title: Title) {
        title.setTitle("医学");
    }

    ngOnDestroy(): void {
        AppComponent.viewDestroy.emit();
    }
}