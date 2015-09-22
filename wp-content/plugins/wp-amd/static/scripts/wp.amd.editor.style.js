!function($, l10n) {
    $("#wp_amd_style_editor_wrapper").length || $("body").append('<div id="wp_amd_style_editor_wrapper" class="closed"><div class="wp-amd-style-editor-actions"><a id="wp_amd_style_editor_button_cancel" class="button" href="#">' + l10n.cancel + '</a><a id="wp_amd_style_editor_button_done" class="wp-amd-style-editor-toggle button" href="#">' + l10n.done + '</a></div><div id="wp_amd_style_editor"></div></div>');
    var editorBlock = $("#wp_amd_style_editor_wrapper"), defEditor = $("#wp_amd_default_style_editor"), defaultValue = defEditor.text(), editor = ace.edit("wp_amd_style_editor");
    editor.setTheme("ace/theme/wordpress"), editor.getSession().setMode("ace/mode/css"), 
    editor.getSession().setUseSoftTabs(!0), editor.setHighlightActiveLine(!1), editor.setShowPrintMargin(!1), 
    editor.getSession().setTabSize(2), editor.getSession().setValue(defEditor.text()), 
    editor.on("change", function() {
        defEditor.val(editor.getValue()), $("#wp_amd_default_style_editor").trigger("change");
    }), $(".wp-amd-style-editor-toggle").click(function() {
        editorBlock.hasClass("closed") ? editorBlock.removeClass("closed").addClass("opened") : editorBlock.removeClass("opened").addClass("closed"), 
        defaultValue = defEditor.text();
    }), $("#wp_amd_style_editor_button_cancel").click(function() {
        editor.getSession().setValue(defaultValue), setTimeout(function() {
            editorBlock.removeClass("opened").addClass("closed");
        }, 500);
    }), editorBlock.resizable({
        handles: "e",
        minWidth: 300,
        start: function() {
            $("#customize-preview").hide();
        },
        stop: function() {
            $("#customize-preview").show();
        }
    });
}(jQuery, wp_amd_customize_editor_control);