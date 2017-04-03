/**
 * 解析笔记结构得到预览
 * Created by gemu on 4/3/17.
 */
export class ParseStructure {

    /**
     * 解析
     * @param dom 要解析的页面节点
     * @returns 预览结构
     */
    parseStructure(dom: HTMLElement): NoteStructure[] {
        let structures: NoteStructure[] = [];
        // 解析的优先级 TODO 目前只解析一层
        let tagPriority = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'b'];
        for (let tag of tagPriority) {
            let tagDoms: NOdeListOf<Element> = dom.getElementsByTagName(tag);
            for (let tagDom of tagDoms) {
                let structure: NoteStructure = {name: '', dom: null};
                structure.name = tagDom.innerText;
                structure.dom = tagDom;
                structures.push(structure);
            }
        }
        return structures;
    }
}

export interface NoteStructure {
    /**
     * 预览节点名
     */
    name: string;
    /**
     * 预览的节点
     */
    dom: HTMLElement;
    /**
     * 节点下的直接子节点
     */
    childrenStructure?: NoteStructure[];
    /**
     * 预览节点连接(目前没啥用)
     */
    link?: string;
}