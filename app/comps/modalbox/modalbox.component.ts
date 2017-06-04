/**
 * Created by Gemu on 2017/5/10.
 */
import {Component, ViewChild, AfterViewInit, OnDestroy, Output, Input, EventEmitter} from "@angular/core";
import {AppComponent} from "../../app.component";
@Component({
    selector: 'modal-box',
    templateUrl: 'app/comps/modalbox/modalbox.html',
    styleUrls: ['app/assets/styles/modalbox.css', 'app/assets/styles/common.css']
})
export class ModalBoxComponent implements AfterViewInit, OnDestroy {

    @ViewChild('modalBox') modalBox;
    time: number = Math.random();
    @Output() static showEvent: EventEmitter<any> = new EventEmitter();
    @Output() confirmEvent: EventEmitter<any> = new EventEmitter();
    @Input() identify:string;
    show: boolean;
    title: string;

    constructor() {
    }

    ngAfterViewInit() {
        ModalBoxComponent.showEvent.emit(this);
    }

    ngOnDestroy(): void {
        AppComponent.viewDestroy.emit();
    }

    openModal(title: string): void {
        this.title = title;
        this.show = true;
        var handle = setInterval(() => {
            let modalBoxEle = this.modalBox.nativeElement.getElementsByClassName('modal');
            if (modalBoxEle) {
                clearInterval(handle);
            }
            modalBoxEle[0].className = modalBoxEle[0].className + " modal-open";
        }, 200);
    }

    closeModal(): void {
        let modalBoxEle = this.modalBox.nativeElement.getElementsByClassName('modal')[0];
        let className = " " + modalBoxEle.className + " ";
        modalBoxEle.className = className.replace(" modal-open", "").trim();
        setTimeout(() => {
            this.show = false;
        }, 200);
    }

    confirmModal(): void {
        this.closeModal();
        this.confirmEvent.emit();
    }
}