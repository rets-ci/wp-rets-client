!function(a,b){"undefined"!=typeof module?module.exports=b():"function"==typeof define&&"object"==typeof define.amd?define(b):this[a]=b()}("fleck",function(){var a={pluralRules:[[new RegExp("(m)an$","gi"),"$1en"],[new RegExp("(pe)rson$","gi"),"$1ople"],[new RegExp("(child)$","gi"),"$1ren"],[new RegExp("^(ox)$","gi"),"$1en"],[new RegExp("(ax|test)is$","gi"),"$1es"],[new RegExp("(octop|vir)us$","gi"),"$1i"],[new RegExp("(alias|status)$","gi"),"$1es"],[new RegExp("(bu)s$","gi"),"$1ses"],[new RegExp("(buffal|tomat|potat)o$","gi"),"$1oes"],[new RegExp("([ti])um$","gi"),"$1a"],[new RegExp("sis$","gi"),"ses"],[new RegExp("(?:([^f])fe|([lr])f)$","gi"),"$1$2ves"],[new RegExp("(hive)$","gi"),"$1s"],[new RegExp("([^aeiouy]|qu)y$","gi"),"$1ies"],[new RegExp("(matr|vert|ind)ix|ex$","gi"),"$1ices"],[new RegExp("(x|ch|ss|sh)$","gi"),"$1es"],[new RegExp("([m|l])ouse$","gi"),"$1ice"],[new RegExp("(quiz)$","gi"),"$1zes"],[new RegExp("s$","gi"),"s"],[new RegExp("$","gi"),"s"]],singularRules:[[new RegExp("(m)en$","gi"),"$1an"],[new RegExp("(pe)ople$","gi"),"$1rson"],[new RegExp("(child)ren$","gi"),"$1"],[new RegExp("([ti])a$","gi"),"$1um"],[new RegExp("((a)naly|(b)a|(d)iagno|(p)arenthe|(p)rogno|(s)ynop|(t)he)ses$","gi"),"$1$2sis"],[new RegExp("(hive)s$","gi"),"$1"],[new RegExp("(tive)s$","gi"),"$1"],[new RegExp("(curve)s$","gi"),"$1"],[new RegExp("([lr])ves$","gi"),"$1f"],[new RegExp("([^fo])ves$","gi"),"$1fe"],[new RegExp("([^aeiouy]|qu)ies$","gi"),"$1y"],[new RegExp("(s)eries$","gi"),"$1eries"],[new RegExp("(m)ovies$","gi"),"$1ovie"],[new RegExp("(x|ch|ss|sh)es$","gi"),"$1"],[new RegExp("([m|l])ice$","gi"),"$1ouse"],[new RegExp("(bus)es$","gi"),"$1"],[new RegExp("(o)es$","gi"),"$1"],[new RegExp("(shoe)s$","gi"),"$1"],[new RegExp("(cris|ax|test)es$","gi"),"$1is"],[new RegExp("(octop|vir)i$","gi"),"$1us"],[new RegExp("(alias|status)es$","gi"),"$1"],[new RegExp("^(ox)en","gi"),"$1"],[new RegExp("(vert|ind)ices$","gi"),"$1ex"],[new RegExp("(matr)ices$","gi"),"$1ix"],[new RegExp("(quiz)zes$","gi"),"$1"],[new RegExp("s$","gi"),""]],uncountableWords:{equipment:!0,information:!0,rice:!0,money:!0,species:!0,series:!0,fish:!0,sheep:!0,moose:!0,deer:!0,news:!0},inflect:function(b){for(var c=1,d=arguments.length;d>c;c++)b=a[arguments[c]](b);return b},capitalize:function(a){return a.charAt(0).toUpperCase()+a.substring(1).toLowerCase()},camelize:function(b,c){return c?a.upperCamelize(b):b.replace(/[-_]+(.)?/g,function(a,b){return b?b.toUpperCase():""})},upperCamelize:function(b){return a.camelize(a.capitalize(b))},dasherize:function(a){return a.replace(/\s|_/g,"-")},ordinalize:function(a){var b,c,d;if(d=parseInt(a,10)%100,b={11:!0,12:!0,13:!0}[d])return a+"th";switch(d=parseInt(a,10)%10){case 1:c=a+"st";break;case 2:c=a+"nd";break;case 3:c=a+"rd";break;default:c=a+"th"}return c},pluralize:function(b){var c=a.uncountableWords[b.toLowerCase()];if(c)return b;for(var d=a.pluralRules,e=0,f=d.length;f>e;e++)if(b.match(d[e][0])){b=b.replace(d[e][0],d[e][1]);break}return b},singularize:function(b){var c=a.uncountableWords[b.toLowerCase()];if(c)return b;for(var d=a.singularRules,e=0,f=d.length;f>e;e++)if(b.match(d[e][0])){b=b.replace(d[e][0],d[e][1]);break}return b},strip:function(a){return a.replace(/^\s+/,"").replace(/\s+$/,"")},underscore:function(a){return a.replace(/::/g,"_").replace(/([A-Z]+)([A-Z][a-z])/g,"$1_$2").replace(/([a-z\d])([A-Z])/g,"$1_$2").replace(/[-\.]/g,"_").toLowerCase()},uncountable:function(){for(var b=0,c=arguments.length;c>b;b++)a.uncountableWords[arguments[b]]=!0;return a}};return a});