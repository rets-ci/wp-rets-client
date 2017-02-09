/**
 *
 * @source http://stackoverflow.com/questions/507138/how-do-i-add-a-class-to-a-given-element
 *
 * @param classname
 * @param element
 */
function addClass( classname, element ) {
  var cn = element.className;
  //test for existance
  if( cn.indexOf( classname ) != -1 ) {
    return;
  }
  //add a space if the element already has class
  if( cn != '' ) {
    classname = ' '+classname;
  }
  element.className = cn+classname;
}

/**
 *
 * @source http://stackoverflow.com/questions/507138/how-do-i-add-a-class-to-a-given-element
 *
 * @param classname
 * @param element
 */
function removeClass( classname, element ) {
  var cn = element.className;
  var rxp = new RegExp( "\\s?\\b"+classname+"\\b", "g" );
  cn = cn.replace( rxp, '' );
  element.className = cn;
}
