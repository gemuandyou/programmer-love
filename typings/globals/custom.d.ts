/**
 * Created by gemu on 2/3/17.
 */
declare var Notification:any;

interface Notification {
    permission: any;
}

interface Element {
    currentTime:any;
    seekable:any;
    pause():any;
    play():any;
}

declare var KindEditor:any;

interface KindEditor {
    ready: any;
}

declare interface Window {
    editor: any;
}
