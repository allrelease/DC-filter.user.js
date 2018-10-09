// ==UserScript==
// @name        DC filter in article replys
// @namespace   http://gall.dcinside.com/
// @include     http://gall.dcinside.com/board/view/*
// @include     http://gall.dcinside.com/board/comment_view/*
// @version     0.3
// @grant       none
// @description   filter trolls by replys
// @contributor   dot
// ==/UserScript==

var filter_name = /^(?:두정갑|경번갑|ksy|근세돌|철구|숯불형인간)$/
var filter_name_del = /(?:ㅡ|[asdㅁㄴㅇ]{6}|^(.)\1{1,2}|ㅄ|ㅂㅅ|악개.*|카지노|포항의봄|2tr|ㅇㄱㄹㅇㅂㅂㅂㄱ|ㅇㄱㄹㅇㅂㅂㅂ ㄱ|장소삼|irene|오타쿠|위키세계어|김용팔|에로망가센세|프로외노자)/
var filter_name_chosung = /^(?:[-ㅁㅂㅈㄷㄳㅁㄴㅇㄹㅎㅅㅋㅌㅊㅍㄻㅀㅓㅗqwerasdfzxcvASDFㄱ01234]{1,10}|(.)\1{1,}|[,\.]{1,})$/
var filter_name_exception = /^(?:관노|ㅅㅅㅅ)$/

var filter_id = /^(?:inviolable|rumpumpumpum|ahc2003|whiteking|solodragon|electronicking)$/
var filter_id_del = /^(?:b5346|sp0331|aerohong|whiteprince|zzizilee|logicpro|hongiro|hi300|bonnbonn|miku133|myteatime|hoho9900|contextfree|ilegan8392)$/
var filter_id_exception = /^(?:gaegogizzang)$/

var filter_IP = ["1.11.*.*"]

//var reg_reply = /td class="user user_layer" user_id="(.*?)" user_name="(.+?)"/g

//아이피 확인
function checkIP(target){
    for(var count = 0; count < filter_IP.length;count++){
        if(target === filter_IP[count]){
            return true
        }
    }
    return false
}

//리플 토글시킴
function toggleReply() {
    var replyer = this.parentNode.getElementsByClassName('user user_layer') [0];
    var reply = this;
    // replyer.innerHTML = unescape(replyer.getAttribute('hideit'));
    replyer.innerHTML = replyer.getAttribute('hideit');
    //reply.innerHTML = unescape(reply.getAttribute('hideit'));
    reply.innerHTML = reply.getAttribute('hideit');
    replyer.setAttribute('hideit', 'release');
    // replyer.removeAttribute('hideit');
    reply.removeAttribute('hideit');
    this.removeEventListener('click', toggleReply);
}

//리플 지우기와 가리기
function removeReply() {
    //var reply_context = document.getElementsByClassName('view_comment') [0];
    //var reply_table = reply_context.getElementsByTagName('cmt_list') [0];
    var replys = document.getElementsByClassName('ub-content');
    
    for (var c = 0; c < replys.length; c++) {
        var each_line = replys[c];
        var name_zone = each_line.querySelector('.gall_writer, .ub-writer');
        // var name_zone = each_line.children[0];
        var user_name = name_zone.getAttribute('data-nick');
        var user_id = name_zone.getAttribute('data-uid');
        var reply = each_line.querySelector(".usertxt, .ub-word");

        var IP = name_zone.getAttribute('data-ip');
        /*if(reply.getElementsByClassName('etc_ip').length != 0)
        {
            IP = reply.getElementsByClassName('etc_ip')[0].textContent;       
        }*/

        
        // var reply = each_line.children[1];
        
        //보지도 않을 넘을 지운다.
        //예외처리 먼저
        if (!name_zone.hasAttribute('hideit')) {
	        if (!filter_id_exception.test(user_id) && !filter_name_exception.test(user_name)) {
		        if (filter_name_del.test(user_name) || filter_id_del.test(user_id) || checkIP(IP)) {
                    name_zone.setAttribute('hideit', 'B');
                    //name_zone.style.visibility = 'hidden';
                    name_zone.textContent='';
                    // reply.setAttribute('hideit', 'a');
                    //reply.style.visibility = 'hidden';
                    reply.textContent='';
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
		        }
                //초성닉은 사유없이 가린다
		        else if ( filter_name_chosung.test(user_name) ) {
                    //name_zone.setAttribute('hideit', escape(name_zone.innerHTML));
                    name_zone.setAttribute('hideit', name_zone.innerHTML);
                    name_zone.innerHTML = '<b>초성닉</b>';
                    //reply.setAttribute('hideit', escape(reply.innerHTML));
                    reply.setAttribute('hideit', reply.innerHTML);
                    reply.innerHTML = '<b>초성닉</b>';
                    reply.addEventListener('click', toggleReply);
		        }
		    }
		}
    }
}

function throttle( fn, time ) {
    var t = 0;
    return function() {
        var args = arguments,
            ctx = this;

            clearTimeout(t);

        t = setTimeout( function() {
            fn.apply( ctx, args );
        }, time );
    };
}
// 리플 차단
//var reply_div = document.getElementById('comment_list');
var reply_div = document.querySelector('.comment_wrap, .show');
//reply_div.addEventListener('DOMNodeInserted', removeReply, true);
reply_div.addEventListener('load', throttle(removeReply,10), true);
//reply_div.addEventListener('DOMNodeInserted', throttle(removeReply,20), true);
