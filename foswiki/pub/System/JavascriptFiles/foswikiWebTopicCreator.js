(function(a){foswiki.webTopicCreator={parentList:undefined,canSubmit:function(l,d){var f=a("input[name=topic]",l).val(),i=foswiki.getPreference("NAMEFILTER"),k=new RegExp(i,"g"),c=true,h,e,b,g,j=foswiki.String.trimSpaces(f);if(f.length===0){a("input[type=submit]",l).addClass("foswikiSubmitDisabled").attr("disabled",true);a(".webTopicCreatorFeedback",l).html("");a(".webTopicCreatorError",l).html("");return false}a("input[name=nonwikiword]",l).each(function(m,n){c=n.checked});if(j.length===0){return false}if(c){j=f.replace(k,"");h=j.substr(0,1).toLocaleUpperCase()+j.substr(1)}else{j=f.replace(k," ");h=foswiki.String.capitalize(j);h=h.replace(/\s+/g,"")}if(d){a("input[name=topic]",l).val(h)}if(h!==f){e=foswiki.getPreference("webTopicCreator.nameFeedback");b=e+"<strong>"+h+"</strong>";a(".webTopicCreatorFeedback",l).html(b)}else{a(".webTopicCreatorFeedback",l).html("");a(".webTopicCreatorError",l).html("")}if(foswiki.String.isWikiWord(h)||c){a("input[type=submit]",l).removeClass("foswikiSubmitDisabled").attr("disabled",false);a(".webTopicCreatorError",l).html("");return true}else{if(h.length>3){a(".webTopicCreatorError",l).html(foswiki.getPreference("webTopicCreator.errorFeedbackNoWikiName"))}}a("input[type=submit]",l).addClass("foswikiSubmitDisabled").attr("disabled",true);return false},removeSpacesAndPunctuation:function(b){return foswiki.String.removePunctuation(foswiki.String.removeSpaces(b))},filterSpacesAndPunctuation:function(b){return foswiki.String.removeSpaces(foswiki.String.filterPunctuation(b))},loadParentList:function(b,d){if(this.parentList!==undefined){this.onParentListLoaded(b);return}var e=a("input[name=topicparent]",b).val(),c=foswiki.getPreference("SCRIPTURLPATH")+"/view/"+foswiki.getPreference("SYSTEMWEB")+"/ParentList?section=select;web="+foswiki.getPreference("WEB")+";cover=text;selected="+e,f=this;a.get(c,function(g){f.parentList=g;if(!d){f.onParentListLoaded(b)}})},onParentListLoaded:function(b){var c=a("input[name=topicparent]",b).val();a("input[name=topicparent]",b).replaceWith(this.parentList);if(c){a("select[name=topicparent] option[value="+c+"]",b).attr("selected","selected")}this.afterLoadParentList(b)},beforeLoadParentList:function(b){a("img.processing",b).removeClass("foswikiHidden");a("input[name=topicparent]",b).attr("readonly","readonly")},afterLoadParentList:function(b){a("img.processing",b).hide()}};a(function(){a("form[name=newtopicform]").each(function(c,d){var b=a(d);a("input[name=topic]",b).each(function(e,f){f.focus()}).keyup(function(f){foswiki.webTopicCreator.canSubmit(b,false)}).change(function(f){foswiki.webTopicCreator.canSubmit(b,false)}).blur(function(f){foswiki.webTopicCreator.canSubmit(b,true)});a("input[name=nonwikiword]",b).change(function(){foswiki.webTopicCreator.canSubmit(b,false)}).mouseup(function(){foswiki.webTopicCreator.canSubmit(b,false)});a("a.pickparent",b).click(function(f){a(this).hide();foswiki.webTopicCreator.beforeLoadParentList(b);foswiki.webTopicCreator.loadParentList(b);return false});foswiki.webTopicCreator.canSubmit(b,false);foswiki.webTopicCreator.loadParentList(b,true)}).submit(function(){return foswiki.webTopicCreator.canSubmit(this,true)})})}(jQuery));