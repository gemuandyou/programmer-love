/**
 * Created by gemu on 1/24/17.
 */
import {Injectable} from "@angular/core";
import {Http, Response, Headers} from "@angular/http";
import {Observable} from "rxjs";

@Injectable()
export class StoriesService {

    constructor(private http: Http) {}

    createContentTypeHeader(headers: Headers) {
        headers.append('Content-Type', 'application/json;charset=UTF-8'); 
    }

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
    addStory(params: any): Observable<any> {
        return this.http.post(`dbs/story/add`, params);
    }

    /**
     * 分页获取故事列表
     * @param params
     * <ul>
     *     <li>pageNo 页码</li>
     * </ul>
     * * @returns {Observable<Response>}
     */
    storyPage(params: any): Observable<any> {
        return this.http.post(`dbs/story/getPage`, params);
    }

    /**
     * 获取故事详情
     * @param params
     * <ul>
     *     <li>id:故事ID</li>
     * </ul>
     * @returns {Observable<Response>}
     */
    getStory(params: any): Observable<any> {
        return this.http.post(`dbs/story/get`, params);
    }

    /**
     * 更新故事
     * @param params
     * <ul>
     *     <li>id:故事ID</li>
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
    updStory(params: any): Observable<any> {
        let headers = new Headers();
        this.createContentTypeHeader(headers);
        return this.http.post(`dbs/story/update`, params, {headers: headers});
    }

    /**
     * 故事评论
     * @param params
     * <ul>
     *     <li>pageNo 页码</li>
     * </ul>
     * * @returns {Observable<Response>}
     */
    storyComment(params: any): Observable<any> {
        return this.http.post(`dbs/story/comment`, params);
    }

    /**
     * 分页获取故事评论列表
     * @param params
     * <ul>
     *     <li>pageNo 页码</li>
     * </ul>
     * * @returns {Observable<Response>}
     */
    storyCommentPage(params: any): Observable<any> {
        return this.http.post(`dbs/story/getCommentPage`, params);
    }

    /**
     * 访问记录
     */
    visit(): Observable<any> {
        return this.http.post(`dbs/visit`, {});
    }
}