/**
 * Created by gemu on 2/3/17.
 */

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
