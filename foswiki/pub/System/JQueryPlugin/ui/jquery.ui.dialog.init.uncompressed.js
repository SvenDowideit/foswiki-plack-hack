// initializer for the ui-dialog plugin
jQuery(function($) {

  var dialogDefaults = {
    width: 300,
    autoOpen:false,
    draggable:false,
    resizable:false,
    closeOnEscape:false,
    show:'fade'
  }, 

  dialogLinkDefaults = {
    cache: true
  };

  // dialog
  $(".jqUIDialog").livequery(function() {
    var $this = $(this), 
        opts = $.extend({}, dialogDefaults, $this.metadata()),
        buttons = [];

    if ($this.data("autoOpen")) {
      opts.autoOpen = true;
    }

    $this.find(".jqUIDialogButton").each(function() {
      var $button = $(this), 
          button = {},
          href = $button.attr("href");

      button.text = $button.text();

      if (typeof(href) !== 'undefined' && href !== '#') {
        button.click = function() {
          window.location.href = href;
        };
      }

      if ($button.is(".jqUIDialogClose")) {
        button.click = function() {
          $(this).dialog("close");
        };
      }

      if ($button.is(".jqUIDialogSubmit")) {
        button.click = function() {
          $(this).find("form:first").submit();
        };
      }
      $.extend(button, $button.metadata());

      if (typeof(button.click) === 'undefined') {
        button.click = function() {};
      }

      buttons.push(button);
    }).remove();

    if (buttons.length) {
      opts.buttons = buttons;
    }

    if(opts.autoCenter) {
      $(window).bind("resize", function() {
        $this.dialog("option", "position", "center");
      });
      opts.draggable = false;
    }

    $this.bind("dialogopen", function() {
      var $container = $(this).parent();

      // remove focus marker from first button
      $container.find(".ui-dialog-buttonpane .ui-state-focus").removeClass("ui-state-focus");

      // support icons for buttons
      $container.find(".ui-dialog-buttonpane button[icon]").each(function() {
        var $btn = $(this), icon = $btn.attr("icon");
        $btn
        .removeAttr("icon")
        .removeClass('ui-button-text-only')
        .addClass('ui-button-text-icon-primary ui-button-text-icon')
        .prepend('<span class="ui-button-icon-primary ui-icon '+icon+'"></span>');
      });
    });

    $this.removeClass("jqUIDialog").dialog(opts);
  });

  // dialog link
  $(".jqUIDialogLink").live("click.uidialoglink", function() {
    var $this = $(this), 
        href = $this.attr("href"),
        opts = $.extend({}, dialogLinkDefaults, $this.metadata());

    if (href.match(/^https?:/)) {
      // this is a link to remote data
      $.ajax({
        url: href, 
        success: function(content) { 
          var $content = $(content),
              id = $content.attr('id');
          if (!id) {
            id = 'dialog-'+foswiki.getUniqueID();
            $content.attr('id', id);
          }
          if (opts.cache) {
            $this.attr("href", "#"+id);
          } 
          $content.hide();
          $("body").append($content);
          $content.data("autoOpen", true);
        },
        error: function(xhr) {
          alert("Error "+xhr.status+": "+xhr.statusText);
        }
      }); 
    } else {
      // this is a selector
      $(href).dialog("open");
    }

    return false;
  });

});

