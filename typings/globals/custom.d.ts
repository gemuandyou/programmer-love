/**
 * Created by gemu on 2/3/17.
 */

interface Element {
    requestFullScreen:any;
    mozRequestFullScreen:any;
    msRequestFullScreen:any;
    currentTime:any;
    seekable:any;
    pause():any;
    play():any;
}

interface Window {
    ActiveXObject:any;
}

interface Document {
    mozCancelFullScreen:any;
}

declare var KindEditor:any;

interface KindEditor {
    ready: any;
}

declare interface Window {
    editor: any;
}
