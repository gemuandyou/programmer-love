/**
 * Created by gemu on 1/24/17.
 */
import {Injectable} from "@angular/core";
import {Http, Response} from "@angular/http";
import {Observable} from "rxjs";

@Injectable()
export class PassiveService {

    constructor(private http: Http) {}

    list(): Observable<any> {
        return this.http
            .post(`api/dataModel/list`, {});
    }

}