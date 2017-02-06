/**
 * Created by gemu on 1/28/17.
 * 标记和HTML元素的关系映射。标记的长度不得超过10个字符
 */
export class Mark {
    static markMap:KeyMap[] = [
        {key: '@h1', val: 'H1'},
        {key: '@h2', val: 'H2'},
        {key: '@h3', val: 'H3'},
        {key: '@h4', val: 'H4'},
        {key: '@h5', val: 'H5'},
        {key: '@h6', val: 'H6'},
        {key: '@b', val: 'BOLD'},
        {key: '@i', val: 'ITALIC'},
        {key: '@ol', val: 'OL'},
        {key: '@ul', val: 'UL'},
        {key: '@url', val: 'URL'},
        {key: '@img', val: 'IMG'},
        {key: '@pre', val: 'PRE'},
        {key: '@fc', val: 'FontColor'},
        {key: '@fbc', val: 'FontBackgroundColor'},
        {key: '@tab', val: 'TAB'}
    ];
}

interface KeyMap {
    key: String;
    val: String;
}