/**
 * Created by Gemu on 2017/4/25.
 */
var cvsDom = document.getElementById('freehand');
var cvsDiv = document.getElementsByClassName('freehand-div')[0];
var ctx=cvsDom.getContext("2d");
var starting = false;
cvsDom.setAttribute('width', cvsDiv.offsetWidth - 200);
cvsDom.setAttribute('height', cvsDiv.offsetHeight);
cvsDom.onmousedown = function (e) {
    e = window.event || e;
    var target = e.target;
    var mX = e.pageX - target.offsetLeft;
    var mY = e.pageY - target.offsetTop;
    ctx.beginPath(); // 开始起点
    ctx.moveTo(mX,mY); // 开始移动
    ctx.lineWidth = 1;
    starting = true;
};
cvsDom.onmousemove = function (e) {
    if (starting) {
        e = window.event || e;
        var target = e.target;
        var lX = e.pageX - target.offsetLeft;
        var lY = e.pageY - target.offsetTop;
        ctx.lineTo(lX,lY); // 移动
        ctx.strokeStyle = '#ECECEC';
        ctx.stroke(); // 画线
    }
};
cvsDom.onmouseup = function (e) {
    ctx.closePath(); // 结束点
    starting = false;
};
cvsDom.onmouseout = function (e) {
    ctx.closePath(); // 结束点
    starting = false;
};