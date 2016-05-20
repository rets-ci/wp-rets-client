/**
 * WordPress-esque editor style
 *
 * @author potanin@UD
 */
define( "ace/theme/wordpress", ["require", "exports", "module", "ace/lib/dom"], function( a, b, c ) {

  b.isDark = !0;
  b.cssClass = "ace-wordpress";
  b.cssText = ".ace-wordpress .ace_editor {  border: 2px solid rgb(159, 159, 159)}.ace-wordpress .ace_editor.ace_focus {  border: 2px solid #327fbd}.ace-wordpress .ace_gutter {  background: #3b3b3b;  color: #fff}.ace-wordpress .ace_print_margin {  width: 1px;  background: #3b3b3b}.ace-wordpress .ace_scroller {  background-color: #333}.ace-wordpress .ace_text-layer {  color: #FFFFFF}.ace-wordpress .ace_cursor {  border-left: 2px solid #91FF00}.ace-wordpress .ace_cursor.ace_overwrite {  border-left: 0px;  border-bottom: 1px solid #91FF00}.ace-wordpress .ace_marker-layer .ace_selection {  background: rgba(90, 100, 126, 0.88)}.ace-wordpress.multiselect .ace_selection.start {  box-shadow: 0 0 3px 0px #323232;  border-radius: 2px}.ace-wordpress .ace_marker-layer .ace_step {  background: rgb(102, 82, 0)}.ace-wordpress .ace_marker-layer .ace_bracket {  margin: -1px 0 0 -1px;  border: 1px solid #404040}.ace-wordpress .ace_marker-layer .ace_active_line {  background: #353637}.ace-wordpress .ace_gutter_active_line {  background-color: #353637}.ace-wordpress .ace_marker-layer .ace_selected_word {  border: 1px solid rgba(90, 100, 126, 0.88)}.ace-wordpress .ace_invisible {  color: #404040}.ace-wordpress .ace_keyword,.ace-wordpress .ace_meta {  color: #CC7833}.ace-wordpress .ace_constant,.ace-wordpress .ace_constant.ace_character,.ace-wordpress .ace_constant.ace_character.ace_escape,.ace-wordpress .ace_constant.ace_other,.ace-wordpress .ace_support.ace_constant {  color: #6C99BB}.ace-wordpress .ace_invalid {  color: #FFFFFF;  background-color: #FF0000}.ace-wordpress .ace_fold {  background-color: #CC7833;  border-color: #FFFFFF}.ace-wordpress .ace_support.ace_function {  color: #B83426}.ace-wordpress .ace_variable.ace_parameter {  font-style: italic}.ace-wordpress .ace_string {  color: #A5C261}.ace-wordpress .ace_string.ace_regexp {  color: #CCCC33}.ace-wordpress .ace_comment {  font-style: italic;  color: #BC9458}.ace-wordpress .ace_meta.ace_tag {  color: #FFE5BB}.ace-wordpress .ace_entity.ace_name {  color: #FFC66D}.ace-wordpress .ace_markup.ace_underline {  text-decoration: underline}.ace-wordpress .ace_collab.ace_user1 {  color: #323232;  background-color: #FFF980}.ace-wordpress .ace_indent-guide {  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAACCAYAAACZgbYnAAAAEklEQVQImWMwMjL6zzBz5sz/ABEUBGCqhK6UAAAAAElFTkSuQmCC) right repeat-y}";

  var d = a( "../lib/dom" );

  d.importCssString( b.cssText, b.cssClass )

});