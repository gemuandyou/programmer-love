/**
 * Created by gemu on 1/24/17.
 */
import {Injectable} from "@angular/core";
import {Http, Response} from "@angular/http";
import {Observable} from "rxjs";

@Injectable()
export class FriendService {

    constructor(private http: Http) {}

    /**
     * 添加故事
     * @param params
     * <ul>
     *     <li>prevImg 故事预览图（可为空）</li>
     *     <li>prevWords 故事简介（不传值为title值）</li>
     *     <li>author 作者</li>
     *     <li>title 故事标题</li>
     *     <li>subhead 故事子标题</li>
     *     <li>date 故事日期（时间戳）</li>
     *     <li>paragraph 故事HTML内容</li>
     * </ul>
     * @returns {Observable<Response>}
     */
    login(params: any): Observable<any> {
        return this.http.post(`dbs/friend/login`, params);
    }

}