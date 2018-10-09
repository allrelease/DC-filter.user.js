// ==UserScript==
// @name        DC filter in board
// @namespace   http://gall.dcinside.com/
// @include     http://gall.dcinside.com/board/*
// @include     http://gall.dcinside.com/mgallery/board/*
// @version     0.3
// @description   filter trolls by article titles
// @grant       none
// @contributor   dot
// @run-at document-end
// ==/UserScript==

var filter_name = /^(?:두정갑|경번갑|ksy|근세돌|철구|숯불형인간)$/
var filter_name_del = /(?:ㅡ|[asdㅁㄴㅇ]{6}|^(.)\1{1,2}|ㅄ|ㅂㅅ|악개.*|카지노|포항의봄|2tr|ㅇㄱㄹㅇㅂㅂㅂㄱ|ㅇㄱㄹㅇㅂㅂㅂ ㄱ|장소삼|irene|오타쿠|위키세계어|김용팔|에로망가센세|프로외노자)/
var filter_name_chosung = /^(?:[-ㅁㅂㅈㄷㄳㅁㄴㅇㄹㅎㅅㅋㅌㅊㅍㄻㅀㅓㅗqwerasdfzxcvASDFㄱ01234]{1,10}|(.)\1{1,}|[,\.]{1,})$/
var filter_name_exception = /^(?:관노|ㅅㅅㅅ)$/

var filter_id = /^(?:inviolable|rumpumpumpum|ahc2003|whiteking|solodragon|electronicking)$/
var filter_id_del = /^(?:b5346|sp0331|aerohong|whiteprince|zzizilee|logicpro|hongiro|hi300|bonnbonn|miku133|myteatime|hoho9900|contextfree|ilegan8392)$/
var filter_id_exception = /^(?:gaegogizzang)$/

var filter_title_del = /(?:[\S]{10,}|토토|가입|돈버는|돈벌기|사다리|머니|좋은곳|바카라|야마토|입결|카라.*해체|http\:|스피오.*|영단기|악개|www\.|[a-z]{1,}\.[a-z]{2,}\.[a-z]{2,})/

//var reg_test = /<td class="t_writer user_layer" user_id="([\s\S]*?)" user_name="([\s\S]+?)"[\s\S]+?>/g;


function toogleTitle() {
    for (var c = 0; c < this.parentNode.children.length - 1; c++) {
        this.parentNode.children[c].style.display = '';
    }
    var writer = this.parentNode.parentNode.querySelector('.gall_writer, .ub-writer');
    writer.innerHTML = unescape(writer.getAttribute('hideit'));
    writer.removeAttribute('hideit');
    this.parentNode.removeEventListener('click', toogleTitle);
    // this.parentNode.removeChild(this.parentNode.lastChild);
    this.parentNode.removeChild(this);
}


function removeTitle() {
    var table_context = document.getElementsByClassName('gall_list') [0];
    var table_body = table_context.getElementsByClassName('ub-content');
    for (var c = 0; c < table_body.length; c++) {
        var each_line = table_body[c];
        var writer_tag = each_line.querySelector('.gall_writer, .ub-writer');
        var user_name = writer_tag.getAttribute('data-nick');
        var user_id = writer_tag.getAttribute('data-uid');
        var subjects = each_line.querySelector('.gall_tit, .ub-word');
        var title = each_line.children[1].textContent;
        
        //예외처리 먼저
        if (!filter_id_exception.test(user_id) && !filter_name_exception.test(user_name)) {
            //아예 지워 버림
            if (filter_name_del.test(user_name) || filter_id_del.test(user_id) || filter_title_del.test(title)) {
                    //each_line.style.visibility = 'hidden';
                writer_tag.textContent = '';
                subjects.textContent = '';
            }

            //차단한다고 하고 가림
            else if (filter_name.test(user_name) || filter_id.test(user_id)) {
                //제목 가리기
                for (var c2 = 0; c2 < subjects.children.length; c2++) {
                    subjects.children[c2].style.display = 'none';
                    // subjects.children[c2].style.visibility='hidden';
                }
                subjects.appendChild(document.createElement('B'));
                subjects.lastChild.innerHTML = '차단되었습니다';
                subjects.lastChild.addEventListener('click', toogleTitle, false);
                //글싼넘
                writer_tag.setAttribute('hideit', escape(writer_tag.innerHTML));
                writer_tag.innerHTML = '<b>차단</b>';
                
            }

            else if (filter_name_chosung.test(user_name)) {
                //제목 가리기
                for (var c3 = 0; c3 < subjects.children.length; c3++) {
                    subjects.children[c3].style.display = 'none';
                    // subjects.children[c2].style.visibility='hidden';
                }
                subjects.appendChild(document.createElement('B'));
                subjects.lastChild.innerHTML = '초성닉';
                subjects.lastChild.addEventListener('click', toogleTitle, false);
                //글싼넘
                writer_tag.setAttribute('hideit', escape(writer_tag.innerHTML));
                writer_tag.innerHTML = '<b>초성닉</b>';
                
            }
        }
    }
}

removeTitle();