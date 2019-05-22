// ==UserScript==
// @name        DC filter in article replys
// @namespace   https://gall.dcinside.com/
// @include     https://gall.dcinside.com/board/view/*
// @include     https://gall.dcinside.com/board/comment_view/*
// @include     https://gall.dcinside.com/mgallery/board/view/*
// @include     https://gall.dcinside.com/board/comment/*
// @version     20190510
// @grant       none
// @description   filter trolls by replys
// @contributor   dot
// @updateURL https://github.com/allrelease/DC-filter.user.js/raw/master/DC_filter_in_article_replys.user.js
// @run-at document-start
// ==/UserScript==
var filter_name = /^(?:두정갑|경번갑|ksy|근세돌|철구|숯불형인간)$/
var filter_name_del = /(?:ㅡ|[asdㅁㄴㅇ]{6}|^(.)\1{1,2}|ㅄ|ㅂㅅ|악개.*|카지노|포항의봄|ㅇㄱㄹㅇㅂㅂㅂㄱ|ㅇㄱㄹㅇㅂㅂㅂ ㄱ|장소삼|irene|오타쿠|위키세계어|김용팔|에로망가센세|프로외노자|bluepick|야옹.*|행성.*|Foundation|통암기공부법|.*냥이)/
var filter_name_chosung = /^(?:[-ㅁㅂㅈㄷㄳㅁㄴㅇㄹㅎㅅㅋㅌㅊㅍㄻㅀㅓㅗqwerasdfzxcvASDFㄱ01234]{1,10}|(.)\1{1,}|[,\.]{1,})$/
var filter_name_exception = /^(?:관노|ㅅㅅㅅ|초코냥)$/

var filter_id = /^(?:inviolable|rumpumpumpum|ahc2003|whiteking|solodragon|electronicking)$/
var filter_id_del = /^(?:b5346|sp0331|aerohong|whiteprince|zzizilee|logicpro|hongiro|hi300|bonnbonn|miku133|myteatime|hoho9900|contextfree|ilegan8392|yum230|godkiworld|wjjong4|godotgame)$/
var filter_id_exception = /^(?:gaegogizzang)$/

var filter_IP = ["1.11.*.*"]

var run_once = 1;
//var reg_reply = /td class="user user_layer" user_id="(.*?)" user_name="(.+?)"/g

//아이피 확인
function checkIP(target) {
    for (var count = 0; count < filter_IP.length; count++) {
        if (target === filter_IP[count]) {
            return true
        }
    }
    return false
}

//리플 토글시킴
function toggleReply() {
    var replyer = this.parentNode.parentNode.parentNode.querySelector('.gall_writer, .ub-writer');
    var reply = this;
    // replyer.innerHTML = unescape(replyer.getAttribute('hideit'));
    replyer.innerHTML = replyer.getAttribute('hideit');
    //reply.innerHTML = unescape(reply.getAttribute('hideit'));
    reply.innerHTML = reply.getAttribute('hideit');
    replyer.setAttribute('hideit', 'release');
    reply.setAttribute('hideit', 'release');
    //replyer.removeAttribute('hideit');
    //reply.removeAttribute('hideit');
    this.removeEventListener('click', toggleReply);
}

//리플 지우기와 가리기
function _removeReply() {

    var replys = document.getElementsByClassName('ub-content');

    for (var c = 0; c < replys.length; c++) {
        var each_line = replys[c];

        if (each_line.getElementsByClassName('del_reply').length) continue; //삭제된 리플에서 건너뛰기

        var name_zone = each_line.querySelector('.gall_writer.ub-writer');

        var user_name = name_zone.getAttribute('data-nick');
        var user_id = name_zone.getAttribute('data-uid');
        var reply = each_line.querySelector(".usertxt.ub-word");
        if (!reply) reply = each_line.querySelector("div.comment_dccon.clear"); // 디씨콘 처리

        var IP = name_zone.getAttribute('data-ip');

        //보지도 않을 넘을 지운다.
        //예외처리 먼저
        if (!name_zone.hasAttribute('hideit')) {
            if (!filter_id_exception.test(user_id) && !filter_name_exception.test(user_name)) {
                if (filter_name_del.test(user_name) || filter_id_del.test(user_id) || checkIP(IP)) {
                    //name_zone.style.visibility = 'hidden';
                    name_zone.textContent = '';
                    //reply.style.visibility = 'hidden';
                    reply.textContent = '';
                }
                //가리기만 할 넘들
                else if (filter_name.test(user_name) || filter_id.test(user_id)) {
                    //name_zone.setAttribute('hideit', escape(name_zone.innerHTML));
                    name_zone.setAttribute('hideit', name_zone.innerHTML);
                    name_zone.innerHTML = '<b>차단</b>';
                    //reply.setAttribute('hideit', escape(reply.innerHTML));
                    reply.setAttribute('hideit', reply.innerHTML);
                    reply.innerHTML = '<b>차단되었습니다</b>';
                    reply.addEventListener('click', toggleReply);
                    //reply.querySelector('nickname').removeEventListener('click',get_user)
                    //reply.addEventListener('mouseover', toggleReply);
                }
                //초성닉은 사유없이 가린다
                else if (filter_name_chosung.test(user_name)) {
                    //name_zone.setAttribute('hideit', escape(name_zone.innerHTML));
                    name_zone.setAttribute('hideit', name_zone.innerHTML);
                    name_zone.innerHTML = '<b>초성닉</b>';
                    //reply.setAttribute('hideit', escape(reply.innerHTML));
                    reply.setAttribute('hideit', reply.innerHTML);
                    reply.innerHTML = '<b>초성닉</b>';
                    reply.addEventListener('click', toggleReply);
                    //reply.addEventListener('mouseover', toggleReply);
                }
            }
        }
    }
}

function throttle(fn, time) {
    var t = 0;
    return function() {
        var args = arguments,
            ctx = this;

        clearTimeout(t);

        t = setTimeout(function() {
            fn.apply(ctx, args);
        }, time);
    };
}

function removeReply() {
    if (run_once) {
        run_once = 0;
        var once = new throttle(function() {
            run_once = 1;
        }, 100);
        once();
        _removeReply();
    }
}

function Invoker() {
    var reply_div = document.getElementsByClassName('comment_wrap')[0];
    if (reply_div) {
        //reply_div.addEventListener('load', throttle(removeReply,0), true);
        reply_div.addEventListener('load', removeReply, true);
        //reply_div.addEventListener('DOMNodeInserted', removeReply);
        document.removeEventListener('load', Invoker, true);
    }
}

// 리플 차단
//var reply_div = document.getElementsByClassName('comment_wrap')[0];
//var reply_div = document.querySelector('.comment_wrap.show');
//reply_div.addEventListener('DOMNodeInserted', removeReply, true);
//reply_div.addEventListener('load', throttle(removeReply,500), true);
//document.addEventListener('DOMNodeInserted', function(){var reply_div = document.getElementsByClassName('comment_wrap')[0];removeReply();}, true);
document.addEventListener('load', Invoker, true);