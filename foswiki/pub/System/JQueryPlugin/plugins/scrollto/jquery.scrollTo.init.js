jQuery(function(a){a(".jqScrollToLink").live("click",function(){var b=a.extend({},a(this).metadata());a.scrollTo(b.target,b);return false})});