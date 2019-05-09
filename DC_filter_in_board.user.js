// ==UserScript==
// @name        DC filter in board
// @namespace   https://gall.dcinside.com/
// @include     https://gall.dcinside.com/board/*
// @include     https://gall.dcinside.com/mgallery/board/*
// @version     20190510
// @description   filter trolls by article titles
// @grant       none
// @contributor   dot
// @run-at document-end
// @updateURL https://github.com/allrelease/DC-filter.user.js/raw/master/DC_filter_in_board.user.js
// ==/UserScript==

var filter_name = /^(?:두정갑|경번갑|ksy|근세돌|철구|숯불형인간)$/
var filter_name_del = /(?:ㅡ|[asdㅁㄴㅇ]{6}|^(.)\1{1,2}|ㅄ|ㅂㅅ|악개.*|카지노|포항의봄|ㅇㄱㄹㅇㅂㅂㅂㄱ|ㅇㄱㄹㅇㅂㅂㅂ ㄱ|장소삼|irene|오타쿠|위키세계어|김용팔|에로망가센세|프로외노자|bluepick|야옹.*|행성.*|Foundation|통암기공부법)/
var filter_name_chosung = /^(?:[-ㅁㅂㅈㄷㄳㅁㄴㅇㄹㅎㅅㅋㅌㅊㅍㄻㅀㅓㅗqwerasdfzxcvASDFㄱ01234]{1,10}|(.)\1{1,}|[,\.]{1,})$/
var filter_name_exception = /^(?:관노|ㅅㅅㅅ)$/

var filter_id = /^(?:inviolable|rumpumpumpum|ahc2003|whiteking|solodragon|electronicking)$/
var filter_id_del = /^(?:b5346|sp0331|aerohong|whiteprince|zzizilee|logicpro|hongiro|hi300|bonnbonn|miku133|myteatime|hoho9900|contextfree|ilegan8392|yum230|godkiworld|wjjong4|godotgame)$/
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

//추천글 리스트 삭제
function removeRecommand() {
	
	//왼쪽 추천글 리스트 삭제
	var DOM_recommand = document.getElementsByClassName("concept_txtlist")[0];
	
	if (!DOM_recommand) return; //마이너 갤러리는 없으므로 탈출;
	else DOM_recommand = DOM_recommand.children;
	
	for(var counter = 0; counter < DOM_recommand.length; counter++)	{
		var writer = DOM_recommand[counter].getElementsByClassName("writer")[0].textContent;
		if (!filter_name_exception.test(writer)) {
            //아예 지워 버림
            if (filter_name_del.test(writer)) {
                DOM_recommand[counter].style.visibility = 'hidden';
            }
		}
	}
	//오른쪽 내용이랑 같이 나오는 애 삭제
	DOM_recommand = document.getElementsByClassName("concept_img")[0];
	
	if (!DOM_recommand) return; //마이너 갤러리는 없으므로 탈출;
	
	writer = DOM_recommand.getElementsByClassName("writer_info")[0].innerText.slice(6);
	if (!filter_name_exception.test(writer)) {
		//아예 지워 버림
		if (filter_name_del.test(writer)) {
			DOM_recommand.style.visibility = 'hidden';
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

removeTitle();
removeRecommand();
var DOM_recommand = document.getElementsByClassName("concept_txtlist")[0];
DOM_recommand.addEventListener('DOMNodeInserted', throttle(removeRecommand, 10), true);