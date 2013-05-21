/*
Chrome extention that adds link in web pages containing some text patterns.
Copyright (c) 2013 Nicolas Marchildon.

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

function linkify() {
  var regex = [ new RegExp("(issue|bz|bug)([ #]*)(\\d+)", "ig") , "<a href='http://bugs.debian.org/cgi-bin/bugreport.cgi?bug=$3'>$1$2$3</a>" ];
  linkifyNodes(document, regex)
}

function linkifyNodes(element, regex) {
  traverse(element, function(elem) {
    if (elem.nodeType == Node.TEXT_NODE) {
      linkifyTextNode(elem, regex);
    } else if (elem.tagName != "SCRIPT"
        && elem.tagName != "STYLE"
        && elem.tagName != "TEXTAREA"
        && elem.tagName != "A") {
      return true;
    }
    return false;
  });
}

function linkifyTextNode(element, regex) {
  var replacement = element.nodeValue.replace(regex[0], regex[1]);
  if (element.nodeValue != replacement) {
    console.log("Text: " + element.nodeValue);
    console.log("Replacement: " + replacement);
    var span = document.createElement('span');
    span.innerHTML = replacement;
    element.parentNode.appendChild(span);
    element.parentNode.removeChild(element);
  }
}

function traverse(element, predicate) {
  var children = element.childNodes;
  for (var i = 0, max = children.length; i < max; i++) {
    if (predicate(children[i])) {
      traverse(children[i], predicate);
    }
  }
}

var observeDOM = (function(){
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver,
        eventListenerSupported = window.addEventListener;

    return function(obj, callback){
        if( MutationObserver ){
            // define a new observer
            var obs = new MutationObserver(function(mutations, observer){
                if( mutations[0].addedNodes.length || mutations[0].removedNodes.length )
                    callback();
            });
            // have the observer observe foo for changes in children
            obs.observe( obj, { childList:true, subtree:true });
        }
        else if( eventListenerSupported ){
            obj.addEventListener('DOMNodeInserted', callback, false);
            obj.addEventListener('DOMNodeRemoved', callback, false);
        }
    }
})();

linkify();
observeDOM(document, linkify);
