SJS.usingAll('addLoadEvent,getElementsByClassName,moveElement,$,log,siblings,setCookie,getCookie,addClass,removeClass,sendRequest');

var DRI_LEFT = 0;
var DRI_RIGHT = 1;
var contentWidth = 900;
var menus;
var cookieLifeDay = 30;
var selectedIndex = parseInt( getCookie('selected'))

function loadContent(index) {
	var contentNow = $('content' + index);
	var hideContent = $('hcontent' + index);
	if (hideContent.innerHTML == '')
	{
		sendRequest();
	}
	else
	{
		contentNow.innerHTML = hideContent.innerHTML;
	}
}

/**
* 菜单点击事件
* @param menuNow 当前的菜单项
* @param index 要移动到的菜单索引
*/
function menuClickProcess(menuNow,index) {
	var lastSelected = getSelectedIndex();

	if (lastSelected == index +1 || lastSelected == index -1)
	{
		moveElement('content-sub',-index*contentWidth,parseInt($('content-sub').style.top),25);//移动内容页 -(index-1)*contentWidth
	}
	else
	{
		if (lastSelected < index)//右移
		{
			moveElement('content-sub',-index*contentWidth,parseInt($('content-sub').style.top),25,-(index-1)*contentWidth);//移动内容页
		}
		else//左移
		{
			moveElement('content-sub',-index*contentWidth,parseInt($('content-sub').style.top),25,-(index+1)*contentWidth);
		}
	}
	
	setSelectedIndex(index);
	
	addClass(menuNow,'selected');//切换CSS
	siblings(menuNow).each(function() {
		removeClass(this,'selected');
	});
}


function menuClickEvent(menuNow,index) {
	menuNow.onclick = function() {
		menuClickProcess(menuNow,index);
	}
	var divNow = $('content' + (index+1));
	getElementsByClassName(divNow,'div','img').each(function() {//添加图片的点击事件		
		var link = this.getElementsByTagName('a')[0];
		if (link)
		{
			var href = link.getAttribute('href');
			this.onclick = function() {
				location.href = href;
			}
		}		
	});
}

function eventProcess() {//入口函数
	var nav = $('nav');
	var selected = getCookie('selected');
	menus = getElementsByClassName(nav,'li',null);
	if (selected)
	{
		var index = parseInt(selected);
		if (index > -1 && index <menus.length)
		{
			var menuNow = menus[index];
			if (index == 0)//如果是第一个菜单
			{
				addClass(menuNow,'selected');//切换CSS
			}
			else//不是第一个菜单，展示动画效果
			{
				menuClickProcess(menuNow,index);
			}
		}		
	}
	else
	{
		addClass(menus[0],'selected');
		selectedIndex = 0;
	}
	menus.each(function() {//		
		menuClickEvent(this,this.i);
	});

	pageProcess();


}

function setSelectedIndex(index) {
	setCookie('selected',index,cookieLifeDay,'/');
	selectedIndex = index;//重新设定当前的选定索引
}

function getSelectedIndex() {
	var selected = getCookie('selected');
	var index;
	if (selected != null && selected != '')//存在cookie
	{
		index = parseInt(selected);//从cookie中获取当前的选择项		
	}
	else
	{
		index = selectedIndex;//从变量中获取当前的选择项
	}
	return index;
}

function showPrev() {
	var index = getSelectedIndex();
	if (index > 0)//当前的选择项不是第0项
	{
		index -= 1;
		log.info('[showPrev][index]' + index);

		var menuNow = menus[index];
		menuClickProcess(menuNow,index);
	}
}

function showNext() {
	var index = getSelectedIndex();
	if (index < menus.length -1)
	{
		index += 1;
		log.info('[showNext][index]' + index);
		var menuNow = menus[index];
		menuClickProcess(menuNow,index);
	}
}

function pageProcess() {
	var pre = $('pre');
	var next = $('next');
	pre.onclick = function() {
		showPrev();
	}
	next.onclick = function() {
		showNext();
	}
	document.onkeydown=function keyEvent(e) { 
		e = e || event;
		if (e.keyCode == 37)
		{
			showPrev();
		}
		else if (e.keyCode == 39)
		{
			showNext();
		}
	} 
}

addLoadEvent(eventProcess);
