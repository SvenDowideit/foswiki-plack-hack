jQuery(function(a){a(".jqTreeview:not(.jqInitedTreeview)").livequery(function(){var e=a(this),b=e.attr("class"),c=a.extend({},e.metadata());if(b.match(/\bopen\b/)){c.collapsed=false}if(b.match(/\bclosed?\b/)){c.collapsed=true}if(b.match(/\bunique\b/)){c.unique=true}if(b.match(/\bprerendered\b/)){c.prerendered=true}c.animated="fast";if(b.match(/\bspeed_(fast|slow|normal|none|[\d\.]+)\b/)){var d=RegExp.$1;if(d=="none"){delete c.animated}else{c.animated}}e.addClass("jqInitedTreeview");e.find("> ul").treeview(c);e.css("display","block")})});