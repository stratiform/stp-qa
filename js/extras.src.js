/**
 * Created by tjh on 24/01/2017.
 */

var countLines = function(id) {
    /*
    * Select element by id, return a number of lines
    */
    var divHeight = document.getElementById(id).offsetHeight;

    var lineHeight = parseInt(document.getElementById(id).style.lineHeight);
    var lines = divHeight / lineHeight;
    return lines;
};

var truncate = function(string, len){
    /*
    * take string and length, return string truncated to length using ellipses
    */
    if (string.length > len+1)
        return string.substring(0,len)+'...';
    else
        return string;
};
;
/**
 * @license
 * Fuse - Lightweight fuzzy-search
 *
 * Copyright (c) 2012-2016 Kirollos Risk <kirollos@gmail.com>.
 * All Rights Reserved. Apache Software License 2.0
 *
 * Licensed under the Apache License, Version 2.0 (the "License")
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
!function(t){"use strict";function e(){console.log.apply(console,arguments)}function s(t,e){var s,n,o,i;for(this.list=t,this.options=e=e||{},s=0,i=["sort","shouldSort","verbose","tokenize"],n=i.length;n>s;s++)o=i[s],this.options[o]=o in e?e[o]:r[o];for(s=0,i=["searchFn","sortFn","keys","getFn","include","tokenSeparator"],n=i.length;n>s;s++)o=i[s],this.options[o]=e[o]||r[o]}function n(t,e,s){var i,r,h,a,c,p;if(e){if(h=e.indexOf("."),-1!==h?(i=e.slice(0,h),r=e.slice(h+1)):i=e,a=t[i],null!==a&&void 0!==a)if(r||"string"!=typeof a&&"number"!=typeof a)if(o(a))for(c=0,p=a.length;p>c;c++)n(a[c],r,s);else r&&n(a,r,s);else s.push(a)}else s.push(t);return s}function o(t){return"[object Array]"===Object.prototype.toString.call(t)}function i(t,e){e=e||{},this.options=e,this.options.location=e.location||i.defaultOptions.location,this.options.distance="distance"in e?e.distance:i.defaultOptions.distance,this.options.threshold="threshold"in e?e.threshold:i.defaultOptions.threshold,this.options.maxPatternLength=e.maxPatternLength||i.defaultOptions.maxPatternLength,this.pattern=e.caseSensitive?t:t.toLowerCase(),this.patternLen=t.length,this.patternLen<=this.options.maxPatternLength&&(this.matchmask=1<<this.patternLen-1,this.patternAlphabet=this._calculatePatternAlphabet())}var r={id:null,caseSensitive:!1,include:[],shouldSort:!0,searchFn:i,sortFn:function(t,e){return t.score-e.score},getFn:n,keys:[],verbose:!1,tokenize:!1,matchAllTokens:!1,tokenSeparator:/ +/g};s.VERSION="2.5.0",s.prototype.set=function(t){return this.list=t,t},s.prototype.search=function(t){this.options.verbose&&e("\nSearch term:",t,"\n"),this.pattern=t,this.results=[],this.resultMap={},this._keyMap=null,this._prepareSearchers(),this._startSearch(),this._computeScore(),this._sort();var s=this._format();return s},s.prototype._prepareSearchers=function(){var t=this.options,e=this.pattern,s=t.searchFn,n=e.split(t.tokenSeparator),o=0,i=n.length;if(this.options.tokenize)for(this.tokenSearchers=[];i>o;o++)this.tokenSearchers.push(new s(n[o],t));this.fullSeacher=new s(e,t)},s.prototype._startSearch=function(){var t,e,s,n,o=this.options,i=o.getFn,r=this.list,h=r.length,a=this.options.keys,c=a.length,p=null;if("string"==typeof r[0])for(s=0;h>s;s++)this._analyze("",r[s],s,s);else for(this._keyMap={},s=0;h>s;s++)for(p=r[s],n=0;c>n;n++){if(t=a[n],"string"!=typeof t){if(e=1-t.weight||1,this._keyMap[t.name]={weight:e},t.weight<=0||t.weight>1)throw new Error("Key weight has to be > 0 and <= 1");t=t.name}else this._keyMap[t]={weight:1};this._analyze(t,i(p,t,[]),p,s)}},s.prototype._analyze=function(t,s,n,i){var r,h,a,c,p,l,u,f,d,g,m,y,k,v,S,b=this.options,_=!1;if(void 0!==s&&null!==s){h=[];var M=0;if("string"==typeof s){if(r=s.split(b.tokenSeparator),b.verbose&&e("---------\nKey:",t),this.options.tokenize){for(v=0;v<this.tokenSearchers.length;v++){for(f=this.tokenSearchers[v],b.verbose&&e("Pattern:",f.pattern),d=[],y=!1,S=0;S<r.length;S++){g=r[S],m=f.search(g);var L={};m.isMatch?(L[g]=m.score,_=!0,y=!0,h.push(m.score)):(L[g]=1,this.options.matchAllTokens||h.push(1)),d.push(L)}y&&M++,b.verbose&&e("Token scores:",d)}for(c=h[0],l=h.length,v=1;l>v;v++)c+=h[v];c/=l,b.verbose&&e("Token score average:",c)}u=this.fullSeacher.search(s),b.verbose&&e("Full text score:",u.score),p=u.score,void 0!==c&&(p=(p+c)/2),b.verbose&&e("Score average:",p),k=this.options.tokenize&&this.options.matchAllTokens?M>=this.tokenSearchers.length:!0,b.verbose&&e("Check Matches",k),(_||u.isMatch)&&k&&(a=this.resultMap[i],a?a.output.push({key:t,score:p,matchedIndices:u.matchedIndices}):(this.resultMap[i]={item:n,output:[{key:t,score:p,matchedIndices:u.matchedIndices}]},this.results.push(this.resultMap[i])))}else if(o(s))for(v=0;v<s.length;v++)this._analyze(t,s[v],n,i)}},s.prototype._computeScore=function(){var t,s,n,o,i,r,h,a,c,p=this._keyMap,l=this.results;for(this.options.verbose&&e("\n\nComputing score:\n"),t=0;t<l.length;t++){for(n=0,o=l[t].output,i=o.length,a=1,s=0;i>s;s++)r=o[s].score,h=p?p[o[s].key].weight:1,c=r*h,1!==h?a=Math.min(a,c):(n+=c,o[s].nScore=c);1===a?l[t].score=n/i:l[t].score=a,this.options.verbose&&e(l[t])}},s.prototype._sort=function(){var t=this.options;t.shouldSort&&(t.verbose&&e("\n\nSorting...."),this.results.sort(t.sortFn))},s.prototype._format=function(){var t,s,n,o,i,r=this.options,h=r.getFn,a=[],c=this.results,p=r.include;for(r.verbose&&e("\n\nOutput:\n\n",c),o=r.id?function(t){c[t].item=h(c[t].item,r.id,[])[0]}:function(){},i=function(t){var e,s,n,o,i,r=c[t];if(p.length>0){if(e={item:r.item},-1!==p.indexOf("matches"))for(n=r.output,e.matches=[],s=0;s<n.length;s++)o=n[s],i={indices:o.matchedIndices},o.key&&(i.key=o.key),e.matches.push(i);-1!==p.indexOf("score")&&(e.score=c[t].score)}else e=r.item;return e},s=0,n=c.length;n>s;s++)o(s),t=i(s),a.push(t);return a},i.defaultOptions={location:0,distance:100,threshold:.6,maxPatternLength:32},i.prototype._calculatePatternAlphabet=function(){var t={},e=0;for(e=0;e<this.patternLen;e++)t[this.pattern.charAt(e)]=0;for(e=0;e<this.patternLen;e++)t[this.pattern.charAt(e)]|=1<<this.pattern.length-e-1;return t},i.prototype._bitapScore=function(t,e){var s=t/this.patternLen,n=Math.abs(this.options.location-e);return this.options.distance?s+n/this.options.distance:n?1:s},i.prototype.search=function(t){var e,s,n,o,i,r,h,a,c,p,l,u,f,d,g,m,y,k,v,S,b,_,M=this.options;if(t=M.caseSensitive?t:t.toLowerCase(),this.pattern===t)return{isMatch:!0,score:0,matchedIndices:[[0,t.length-1]]};if(this.patternLen>M.maxPatternLength){if(y=t.match(new RegExp(this.pattern.replace(M.tokenSeparator,"|"))),k=!!y)for(S=[],e=0,b=y.length;b>e;e++)_=y[e],S.push([t.indexOf(_),_.length-1]);return{isMatch:k,score:k?.5:1,matchedIndices:S}}for(o=M.location,n=t.length,i=M.threshold,r=t.indexOf(this.pattern,o),v=[],e=0;n>e;e++)v[e]=0;for(-1!=r&&(i=Math.min(this._bitapScore(0,r),i),r=t.lastIndexOf(this.pattern,o+this.patternLen),-1!=r&&(i=Math.min(this._bitapScore(0,r),i))),r=-1,g=1,m=[],c=this.patternLen+n,e=0;e<this.patternLen;e++){for(h=0,a=c;a>h;)this._bitapScore(e,o+a)<=i?h=a:c=a,a=Math.floor((c-h)/2+h);for(c=a,p=Math.max(1,o-a+1),l=Math.min(o+a,n)+this.patternLen,u=Array(l+2),u[l+1]=(1<<e)-1,s=l;s>=p;s--)if(d=this.patternAlphabet[t.charAt(s-1)],d&&(v[s-1]=1),0===e?u[s]=(u[s+1]<<1|1)&d:u[s]=(u[s+1]<<1|1)&d|((f[s+1]|f[s])<<1|1)|f[s+1],u[s]&this.matchmask&&(g=this._bitapScore(e,s-1),i>=g)){if(i=g,r=s-1,m.push(r),!(r>o))break;p=Math.max(1,2*o-r)}if(this._bitapScore(e+1,o)>i)break;f=u}return S=this._getMatchedIndices(v),{isMatch:r>=0,score:0===g?.001:g,matchedIndices:S}},i.prototype._getMatchedIndices=function(t){for(var e,s=[],n=-1,o=-1,i=0,r=t.length;r>i;i++)e=t[i],e&&-1===n?n=i:e||-1===n||(o=i-1,s.push([n,o]),n=-1);return t[i-1]&&s.push([n,i-1]),s},"object"==typeof exports?module.exports=s:"function"==typeof define&&define.amd?define(function(){return s}):t.Fuse=s}(this);;
/*
*  jquery-svg - v0.0.0
*  A lightweight jQuery plugin to apply css styles and js scripts to a SVG which is embedded (using the <object> tag).
*  http://berneti.ir
*
*  Made by Mohammadreza Berneti
*  Under MIT License
*/

"use strict";

(function ($) {
	// select a svg element from embed or object tag
	$.fn.getSVG = function (selector) {
		var svgDoc = this[0].contentDocument; // Get the document object for the SVG
		return $(svgDoc);
	};
	$.fn.setSVGStyle = function (style) {
		var svgDoc = this[0].contentDocument; // Get the document object for the SVG
		var styleElement = svgDoc.createElementNS("http://www.w3.org/2000/svg", "style");
		styleElement.textContent = style; // add whatever you need here
		svgDoc.getElementsByTagName("svg")[0].appendChild(styleElement);
		return;
	};
	$.fn.setSVGStyleLink = function (link) {
		var svgDoc = this[0].contentDocument; // Get the document object for the SVG
		var linkElm = svgDoc.createElementNS("http://www.w3.org/1999/xhtml", "link");
		linkElm.setAttribute("href", link);
		linkElm.setAttribute("type", "text/css");
		linkElm.setAttribute("rel", "stylesheet");
		svgDoc.getElementsByTagName("svg")[0].appendChild(linkElm);
		return;
	};
	// get a random number between min and max
	$.getRandom = function (min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	};
})(jQuery);

;

// From http://www.tutorialspoint.com/javascript/array_map.htm
if (!Array.prototype.map)
{
  Array.prototype.map = function(fun /*, thisp*/)
  {
    var len = this.length;
    if (typeof fun !== "function")
      throw new TypeError();

    var res = new Array(len);
    var thisp = arguments[1];
    for (var i = 0; i < len; i++)
    {
      if (i in this)
        res[i] = fun.call(thisp, this[i], i, this);
    }

    return res;
  };
}

L.Control.FuseSearch = L.Control.extend({
    
    includes: L.Mixin.Events,
    
    options: {
        position: 'topright',
        title: 'Search',
        panelTitle: '',
        placeholder: 'Search',
        caseSensitive: false,
        threshold: 0.5,
        maxResultLength: null,
        showResultFct: null,
        showInvisibleFeatures: true,
        mapObj: null
    },
    
    initialize: function(options) {
        L.setOptions(this, options);
        this._panelOnLeftSide = (this.options.position.indexOf("left") !== -1);
    },
    
    onAdd: function(map) {
        
        var ctrl = this._createControl();
        this._createPanel(map);
        this._setEventListeners();
        map.invalidateSize();
        
        return ctrl;
    },
    
    onRemove: function(map) {
        
        this.hidePanel(map);
        this._clearEventListeners();
        this._clearPanel(map);
        this._clearControl();
        
        return this;
    },
    
    _createControl: function() {

        var className = 'leaflet-fusesearch-control',
            container = L.DomUtil.create('div', className);

        // Control to open the search panel
        var butt = this._openButton = L.DomUtil.create('a', 'button', container);
        butt.href = '#';
        butt.title = this.options.title;
        var stop = L.DomEvent.stopPropagation;
        L.DomEvent.on(butt, 'click', stop)
                  .on(butt, 'mousedown', stop)
                  .on(butt, 'touchstart', stop)
                  .on(butt, 'mousewheel', stop)
                  .on(butt, 'MozMousePixelScroll', stop);
        L.DomEvent.on(butt, 'click', L.DomEvent.preventDefault);
        L.DomEvent.on(butt, 'click', this.showPanel, this);

        return container;
    },
    
    _clearControl: function() {
        // Unregister events to prevent memory leak
        var butt = this._openButton;
        var stop = L.DomEvent.stopPropagation;
        L.DomEvent.off(butt, 'click', stop)
                  .off(butt, 'mousedown', stop)
                  .off(butt, 'touchstart', stop)
                  .off(butt, 'mousewheel', stop)
                  .off(butt, 'MozMousePixelScroll', stop);
        L.DomEvent.off(butt, 'click', L.DomEvent.preventDefault);
        L.DomEvent.off(butt, 'click', this.showPanel);
    },
    
    _createPanel: function(map) {
        var _this = this;

        // Create the search panel
        var mapContainer = map.getContainer();
        var className = 'leaflet-fusesearch-panel',
            pane = this._panel = L.DomUtil.create('div', className, mapContainer);
        
        // Make sure we don't drag the map when we interact with the content
        var stop = L.DomEvent.stopPropagation;
        L.DomEvent.on(pane, 'click', stop)
                .on(pane, 'dblclick', stop)
                .on(pane, 'mousedown', stop)
                .on(pane, 'touchstart', stop)
                .on(pane, 'mousewheel', stop)
                .on(pane, 'MozMousePixelScroll', stop);

        // place the pane on the same side as the control
        if (this._panelOnLeftSide) {
            L.DomUtil.addClass(pane, 'left');
        } else {
            L.DomUtil.addClass(pane, 'right');
        }

        // Intermediate container to get the box sizing right
        var container = L.DomUtil.create('div', 'content', pane);
        
        var header = L.DomUtil.create('div', 'header', container);
        if (this.options.panelTitle) {
            // changed the div title to h2 rather than p
            // var title = L.DomUtil.create('p', 'panel-title', header);
           var title = L.DomUtil.create('h2', 'panel-title', header);
            title.innerHTML = this.options.panelTitle;
        }
        
        // Search image and input field+
        // added src definition so border could be removed from search glass.
        // might as well make it the search icon!
        L.DomUtil.create('img', 'search-image', header).src = "img/ic_search_black_24dp_1x.png";
        this._input = L.DomUtil.create('input', 'search-input', header);
        this._input.maxLength = 30;
        this._input.placeholder = this.options.placeholder;
        this._input.onkeyup = function(evt) {
            var searchString = evt.currentTarget.value;
            _this.searchFeatures(searchString);
        };

        // Close button
        var close = this._closeButton = L.DomUtil.create('a', 'close', header);
        close.innerHTML = '&times;';
        L.DomEvent.on(close, 'click', this.hidePanel, this);
        
        // Where the result will be listed
        this._resultList = L.DomUtil.create('div', 'result-list', container); 
        
        return pane;
    },
    
    _clearPanel: function(map) {

        // Unregister event handlers
        var stop = L.DomEvent.stopPropagation;
        L.DomEvent.off(this._panel, 'click', stop)
                  .off(this._panel, 'dblclick', stop)
                  .off(this._panel, 'mousedown', stop)
                  .off(this._panel, 'touchstart', stop)
                  .off(this._panel, 'mousewheel', stop)
                  .off(this._panel, 'MozMousePixelScroll', stop);

        L.DomEvent.off(this._closeButton, 'click', this.hidePanel);
        
        var mapContainer = map.getContainer();
        mapContainer.removeChild(this._panel);
        
        this._panel = null;
    },
    
    _setEventListeners : function() {
        var that = this;
        var input = this._input;
        this._map.addEventListener('overlayadd', function() {
            that.searchFeatures(input.value);
        });
        this._map.addEventListener('overlayremove', function() {
            that.searchFeatures(input.value);
        });
    },
    
    _clearEventListeners: function() {
        this._map.removeEventListener('overlayadd');
        this._map.removeEventListener('overlayremove');        
    },
    
    isPanelVisible: function () {
        return L.DomUtil.hasClass(this._panel, 'visible');
    },

    showPanel: function () {
        if (! this.isPanelVisible()) {
            L.DomUtil.addClass(this._panel, 'visible');
            // Preserve map centre
            // Do not preserve map centre hack
            // this._map.panBy([this.getOffset() * 0.5, 0], {duration: 0.5});
            this.fire('show');
            this._input.select();
            // Search again as visibility of features might have changed
            this.searchFeatures(this._input.value);
        }
    },

    hidePanel: function (e) {
        if (this.isPanelVisible()) {
            L.DomUtil.removeClass(this._panel, 'visible');
            // Move back the map centre - only if we still hold this._map
            // as this might already have been cleared up by removeFrom()
            if (null !== this._map) {
                // Do not preserve map centre hack
                // this._map.panBy([this.getOffset() * -0.5, 0], {duration: 0.5});
            };
            this.fire('hide');
            if(e) {
                L.DomEvent.stopPropagation(e);
            }
        }
    },
    
    getOffset: function() {
        if (this._panelOnLeftSide) {
            return - this._panel.offsetWidth;
        } else {
            return this._panel.offsetWidth;
        }
    },

    indexFeatures: function(data, keys) {

        var jsonFeatures = data.features || data;
        
        this._keys = keys;
        var properties = jsonFeatures.map(function(feature) {
            // Keep track of the original feature
            feature.properties._feature = feature;
            return feature.properties;
        });
        
        var options = {
            keys: keys,
            caseSensitive: this.options.caseSensitive,
            threshold : this.options.threshold
        };
        
        this._fuseIndex = new Fuse(properties, options);
    },
    
    searchFeatures: function(string) {
        
        var result = this._fuseIndex.search(string);

        // Empty result list
        var listItems = document.querySelectorAll(".result-item");
        for (var i = 0 ; i < listItems.length ; i++) {
            listItems[i].remove();
        }

        var resultList = document.querySelector('.result-list');
        var num = 0;
        var max = this.options.maxResultLength;
        for (var i in result) {
            var props = result[i];
            var feature = props._feature;
            var popup = this._getFeaturePopupIfVisible(feature);
            
            if (undefined !== popup || this.options.showInvisibleFeatures) {
                this.createResultItem(props, resultList, popup);
                if (undefined !== max && ++num === max)
                    break;
            }
        }
    },
    
    refresh: function() {
        // Reapply the search on the indexed features - useful if features have been filtered out
        if (this.isPanelVisible()) {
            this.searchFeatures(this._input.value);
        }
    },
    
    _getFeaturePopupIfVisible: function(feature) {
        var layer = feature.layer;
        if (undefined !== layer && this._map.hasLayer(layer)) {
            return layer.getPopup();
        }
    },
    
    createResultItem: function(props, container, popup) {

        var _this = this;
        var feature = props._feature;

        // Create a container and open the associated popup on click
        var resultItem = L.DomUtil.create('p', 'result-item', container);
        
        if (undefined !== popup) {
            L.DomUtil.addClass(resultItem, 'clickable');
            resultItem.onclick = function() {
                
                if (window.matchMedia("(max-width:480px)").matches) {
                    _this.hidePanel();
                    feature.layer.openPopup();
                } else {
                    _this._panAndPopup(feature, popup);
                }
            };
        // hack to enable clicking without popup enabled
        } else {
            L.DomUtil.addClass(resultItem, 'clickable');
            resultItem.onclick = function() {

                if (window.matchMedia("(max-width:480px)").matches) {
                    _this.hidePanel();
                    feature.layer.openPopup();
                } else {
                    _this._panAndPopup(feature, null);
                }
            };
        }

        // Fill in the container with the user-supplied function if any,
        // otherwise display the feature properties used for the search.
        if (null !== this.options.showResultFct) {
            this.options.showResultFct(feature, resultItem);
        } else {
            str = '<b>' + props[this._keys[0]] + '</b>';
            for (var i = 1; i < this._keys.length; i++) {
                str += '<br/>' + props[this._keys[i]];
            }
            resultItem.innerHTML = str;
        };

        return resultItem;
    },
    
    _panAndPopup : function(feature, popup) {
        // Temporarily adapt the map padding so that the popup is not hidden by the search pane
        if (this._panelOnLeftSide) {

            // hacked out to enable panning without popup
            // var oldPadding = popup.options.autoPanPaddingTopLeft;
            // var newPadding = new L.Point(- this.getOffset(), 10);
            // popup.options.autoPanPaddingTopLeft = newPadding;

            // hacked to pan to feature rather than open popup
            // feature.layer.openPopup();
            this.options.mapObj.panTo([feature.geometry.coordinates[1], feature.geometry.coordinates[0]]);

            // make a new popup to indicate the hospital
            var poppy = new L.Popup({offset: L.point(0,-3)}).setLatLng([feature.geometry.coordinates[1], feature.geometry.coordinates[0]])
                .setContent(feature.properties.hospital_name).addTo(this.options.mapObj);
            this.options.mapObj.openPopup(poppy);

            // hacked out to enable panning without popup
            // popup.options.autoPanPaddingTopLeft = oldPadding;
        } else {
            // hacked out to enable panning without popup
            // var oldPadding = popup.options.autoPanPaddingBottomRight;
            // var newPadding = new L.Point(this.getOffset(), 10);
            // popup.options.autoPanPaddingBottomRight = newPadding;

            // hacked to pan to feature rather than open popup
            // feature.layer.openPopup();
            this.options.mapObj.panTo([feature.geometry.coordinates[1], feature.geometry.coordinates[0]]);

            // make a new popup to indicate the hospital
            var poppy = new L.Popup({offset: L.point(0,-3)}).setLatLng([feature.geometry.coordinates[1], feature.geometry.coordinates[0]])
                .setContent(feature.properties.hospital_name).addTo(this.options.mapObj);
            this.options.mapObj.openPopup(poppy);

            // hacked out to enable panning without popup
            // popup.options.autoPanPaddingBottomRight = oldPadding;
        }
    }
});

L.control.fuseSearch = function(options) {
    return new L.Control.FuseSearch(options);
};
;
/*
	Leaflet.label, a plugin that adds labels to markers and vectors for Leaflet powered maps.
	(c) 2012-2013, Jacob Toye, Smartrak

	https://github.com/Leaflet/Leaflet.label
	http://leafletjs.com
	https://github.com/jacobtoye
*/
(function(t,e){"function"==typeof define&&define.amd?define(["leaflet"],t):"object"==typeof exports&&(module.exports=t(require("leaflet"))),e!==void 0&&e.L&&(e.LeafletLabel=t(L))})(function(t){t.labelVersion="0.2.4";var e = (t.Layer ? t.Layer : t.Class).extend({includes:t.Mixin.Events,options:{className:"",clickable:!1,direction:"right",noHide:!1,offset:[12,-15],opacity:1,zoomAnimation:!0},initialize:function(e,i){t.setOptions(this,e),this._source=i,this._animated=t.Browser.any3d&&this.options.zoomAnimation,this._isOpen=!1},onAdd:function(e){this._map=e,this._pane=this.options.pane?e._panes[this.options.pane]:this._source instanceof t.Marker?e._panes.markerPane:e._panes.popupPane,this._container||this._initLayout(),this._pane.appendChild(this._container),this._initInteraction(),this._update(),this.setOpacity(this.options.opacity),e.on("moveend",this._onMoveEnd,this).on("viewreset",this._onViewReset,this),this._animated&&e.on("zoomanim",this._zoomAnimation,this),t.Browser.touch&&!this.options.noHide&&(t.DomEvent.on(this._container,"click",this.close,this),e.on("click",this.close,this))},onRemove:function(t){this._pane.removeChild(this._container),t.off({zoomanim:this._zoomAnimation,moveend:this._onMoveEnd,viewreset:this._onViewReset},this),this._removeInteraction(),this._map=null},setLatLng:function(e){return this._latlng=t.latLng(e),this._map&&this._updatePosition(),this},setContent:function(t){return this._previousContent=this._content,this._content=t,this._updateContent(),this},close:function(){var e=this._map;e&&(t.Browser.touch&&!this.options.noHide&&(t.DomEvent.off(this._container,"click",this.close),e.off("click",this.close,this)),e.removeLayer(this))},updateZIndex:function(t){this._zIndex=t,this._container&&this._zIndex&&(this._container.style.zIndex=t)},setOpacity:function(e){this.options.opacity=e,this._container&&t.DomUtil.setOpacity(this._container,e)},_initLayout:function(){this._container=t.DomUtil.create("div","leaflet-label "+this.options.className+" leaflet-zoom-animated"),this.updateZIndex(this._zIndex)},_update:function(){this._map&&(this._container.style.visibility="hidden",this._updateContent(),this._updatePosition(),this._container.style.visibility="")},_updateContent:function(){this._content&&this._map&&this._prevContent!==this._content&&"string"==typeof this._content&&(this._container.innerHTML=this._content,this._prevContent=this._content,this._labelWidth=this._container.offsetWidth)},_updatePosition:function(){var t=this._map.latLngToLayerPoint(this._latlng);this._setPosition(t)},_setPosition:function(e){var i=this._map,n=this._container,o=i.latLngToContainerPoint(i.getCenter()),s=i.layerPointToContainerPoint(e),a=this.options.direction,l=this._labelWidth,h=t.point(this.options.offset);"right"===a||"auto"===a&&s.x<o.x?(t.DomUtil.addClass(n,"leaflet-label-right"),t.DomUtil.removeClass(n,"leaflet-label-left"),e=e.add(h)):(t.DomUtil.addClass(n,"leaflet-label-left"),t.DomUtil.removeClass(n,"leaflet-label-right"),e=e.add(t.point(-h.x-l,h.y))),t.DomUtil.setPosition(n,e)},_zoomAnimation:function(t){var e=this._map._latLngToNewLayerPoint(this._latlng,t.zoom,t.center).round();this._setPosition(e)},_onMoveEnd:function(){this._animated&&"auto"!==this.options.direction||this._updatePosition()},_onViewReset:function(t){t&&t.hard&&this._update()},_initInteraction:function(){if(this.options.clickable){var e=this._container,i=["dblclick","mousedown","mouseover","mouseout","contextmenu"];t.DomUtil.addClass(e,"leaflet-clickable"),t.DomEvent.on(e,"click",this._onMouseClick,this);for(var n=0;i.length>n;n++)t.DomEvent.on(e,i[n],this._fireMouseEvent,this)}},_removeInteraction:function(){if(this.options.clickable){var e=this._container,i=["dblclick","mousedown","mouseover","mouseout","contextmenu"];t.DomUtil.removeClass(e,"leaflet-clickable"),t.DomEvent.off(e,"click",this._onMouseClick,this);for(var n=0;i.length>n;n++)t.DomEvent.off(e,i[n],this._fireMouseEvent,this)}},_onMouseClick:function(e){this.hasEventListeners(e.type)&&t.DomEvent.stopPropagation(e),this.fire(e.type,{originalEvent:e})},_fireMouseEvent:function(e){this.fire(e.type,{originalEvent:e}),"contextmenu"===e.type&&this.hasEventListeners(e.type)&&t.DomEvent.preventDefault(e),"mousedown"!==e.type?t.DomEvent.stopPropagation(e):t.DomEvent.preventDefault(e)}});return t.BaseMarkerMethods={showLabel:function(){return this.label&&this._map&&(this.label.setLatLng(this._latlng),this._map.showLabel(this.label)),this},hideLabel:function(){return this.label&&this.label.close(),this},setLabelNoHide:function(t){this._labelNoHide!==t&&(this._labelNoHide=t,t?(this._removeLabelRevealHandlers(),this.showLabel()):(this._addLabelRevealHandlers(),this.hideLabel()))},bindLabel:function(i,n){var o=this.options.icon?this.options.icon.options.labelAnchor:this.options.labelAnchor,s=t.point(o)||t.point(0,0);return s=s.add(e.prototype.options.offset),n&&n.offset&&(s=s.add(n.offset)),n=t.Util.extend({offset:s},n),this._labelNoHide=n.noHide,this.label||(this._labelNoHide||this._addLabelRevealHandlers(),this.on("remove",this.hideLabel,this).on("move",this._moveLabel,this).on("add",this._onMarkerAdd,this),this._hasLabelHandlers=!0),this.label=new e(n,this).setContent(i),this},unbindLabel:function(){return this.label&&(this.hideLabel(),this.label=null,this._hasLabelHandlers&&(this._labelNoHide||this._removeLabelRevealHandlers(),this.off("remove",this.hideLabel,this).off("move",this._moveLabel,this).off("add",this._onMarkerAdd,this)),this._hasLabelHandlers=!1),this},updateLabelContent:function(t){this.label&&this.label.setContent(t)},getLabel:function(){return this.label},_onMarkerAdd:function(){this._labelNoHide&&this.showLabel()},_addLabelRevealHandlers:function(){this.on("mouseover",this.showLabel,this).on("mouseout",this.hideLabel,this),t.Browser.touch&&this.on("click",this.showLabel,this)},_removeLabelRevealHandlers:function(){this.off("mouseover",this.showLabel,this).off("mouseout",this.hideLabel,this),t.Browser.touch&&this.off("click",this.showLabel,this)},_moveLabel:function(t){this.label.setLatLng(t.latlng)}},t.Icon.Default.mergeOptions({labelAnchor:new t.Point(9,-20)}),t.Marker.mergeOptions({icon:new t.Icon.Default}),t.Marker.include(t.BaseMarkerMethods),t.Marker.include({_originalUpdateZIndex:t.Marker.prototype._updateZIndex,_updateZIndex:function(t){var e=this._zIndex+t;this._originalUpdateZIndex(t),this.label&&this.label.updateZIndex(e)},_originalSetOpacity:t.Marker.prototype.setOpacity,setOpacity:function(t,e){this.options.labelHasSemiTransparency=e,this._originalSetOpacity(t)},_originalUpdateOpacity:t.Marker.prototype._updateOpacity,_updateOpacity:function(){var t=0===this.options.opacity?0:1;this._originalUpdateOpacity(),this.label&&this.label.setOpacity(this.options.labelHasSemiTransparency?this.options.opacity:t)},_originalSetLatLng:t.Marker.prototype.setLatLng,setLatLng:function(t){return this.label&&!this._labelNoHide&&this.hideLabel(),this._originalSetLatLng(t)}}),t.CircleMarker.mergeOptions({labelAnchor:new t.Point(0,0)}),t.CircleMarker.include(t.BaseMarkerMethods),t.Path.include({bindLabel:function(i,n){return this.label&&this.label.options===n||(this.label=new e(n,this)),this.label.setContent(i),this._showLabelAdded||(this.on("mouseover",this._showLabel,this).on("mousemove",this._moveLabel,this).on("mouseout remove",this._hideLabel,this),t.Browser.touch&&this.on("click",this._showLabel,this),this._showLabelAdded=!0),this},unbindLabel:function(){return this.label&&(this._hideLabel(),this.label=null,this._showLabelAdded=!1,this.off("mouseover",this._showLabel,this).off("mousemove",this._moveLabel,this).off("mouseout remove",this._hideLabel,this)),this},updateLabelContent:function(t){this.label&&this.label.setContent(t)},_showLabel:function(t){this.label.setLatLng(t.latlng),this._map.showLabel(this.label)},_moveLabel:function(t){this.label.setLatLng(t.latlng)},_hideLabel:function(){this.label.close()}}),t.Map.include({showLabel:function(t){return this.addLayer(t)}}),t.FeatureGroup.include({clearLayers:function(){return this.unbindLabel(),this.eachLayer(this.removeLayer,this),this},bindLabel:function(t,e){return this.invoke("bindLabel",t,e)},unbindLabel:function(){return this.invoke("unbindLabel")},updateLabelContent:function(t){this.invoke("updateLabelContent",t)}}),e},window);