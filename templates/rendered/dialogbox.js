(function(){function dialogbox(it
) {
var out=''; var hasTitle = typeof it.title === 'string' && it.title !== '';out+='<div tabindex="0" class="dialog-container ';if(!hasTitle){out+=' no-title ';}out+=' ';if(it.type === 'input'){out+=' input-dialog ';}out+='"> <div class="text-cont"> ';if(hasTitle){out+=' <h5>'+( it.title )+'</h5> ';}out+=' <p>'+( it.text || '' )+'</p> </div> ';if(it.checkbox !== false){out+=' <div class="checkbox ';if(it.checkbox.checked){out+=' checked ';}out+='">'+( it.checkbox.label )+'</div> ';}out+=' ';if(it.type === 'options' && it.list.length > 0){out+=' <ul> '; var cls = ''; out+=' ';var arr1=it.list;if(arr1){var el,index=-1,l1=arr1.length-1;while(index<l1){el=arr1[index+=1];out+=' '; cls = el.selected ? 'selected' : ''; out+=' <li class="'+( cls )+'" data-id="'+( el.id )+'">'+( el.label )+'</li> ';} } out+=' </ul> ';}out+=' ';if(it.type === 'input'){out+=' <input type="text" placeholder="Enter a value" value="'+( it.inputValue )+'" /> ';}out+=' <div class="dialog-button-container ';if(it.buttons.length === 2){out+=' two-buttons ';}out+='"> ';var arr2=it.buttons;if(arr2){var el,index=-1,l2=arr2.length-1;while(index<l2){el=arr2[index+=1];out+=' '; cls = (typeof el.style !== 'undefined') ? el.style : (el.type === 'submit') ? '' : 'hollow-2'; out+=' <button class="'+( cls )+' '+( el.type )+' '+( el.id || '' )+'">'+( el.label )+'</button> ';} } out+=' </div></div>';return out;
}var itself=dialogbox, _encodeHTML=(function(doNotSkipEncoded) {
		var encodeHTMLRules = { "&": "&#38;", "<": "&#60;", ">": "&#62;", '"': "&#34;", "'": "&#39;", "/": "&#47;" },
			matchHTML = doNotSkipEncoded ? /[&<>"'\/]/g : /&(?!#?\w+;)|<|>|"|'|\//g;
		return function(code) {
			return code ? code.toString().replace(matchHTML, function(m) {return encodeHTMLRules[m] || m;}) : "";
		};
	}());if(typeof module!=='undefined' && module.exports) module.exports=itself;else if(typeof define==='function')define(function(){return itself;});else {window.render=window.render||{};window.render['dialogbox']=itself;}}());