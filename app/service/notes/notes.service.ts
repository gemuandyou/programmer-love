/**
 * Created by gemu on 1/24/17.
 */
import {Injectable} from "@angular/core";
import {Http, Response} from "@angular/http";
import {Observable} from "rxjs";

@Injectable()
export class NotesService {

    constructor(private http: Http) {}

    saveNote(params: any): Observable<any> {
        let fileName = '';
        let now = new Date();
        if (params) {
            fileName = params.noteName ? params.noteName : now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate();
        }
        return this.http
            .post(`wnote/` + fileName, params);
    }

    getNote(note: String): Observable<any> {
        return this.http.get(`rnote/` + note);
    }

    listNotes(): Observable<any> {
        return this.http.get(`lnote`);
    }

    saveImg(params: any): Observable<any> {
        return this.http.post(`wimg`, params);
    }

    getMusicBox(): Observable<any> {
        return this.http.get(`musicBox`);
    }

    exportNote(params: any): Observable<any> {
        return this.http.post(`exportNote`, params);
    }
}