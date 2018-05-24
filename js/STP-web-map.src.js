;
/**
 * Created by tjh on 7/09/2016.
 */

/*jshint esversion: 6 */

"use strict";

var vers = 'VERSION_SNAPSHOT';

console.log('STP Web Map version ' + vers);

// create layers object
var layers = {
    "emet_data": {
        layer: null,
        raw: null
    },
    "emet_connex": {
        layer: null,
        raw: null
    },
    "display": {
        layer: null
    }
};

// create grouping
var groups = {
    "ACT": "NSW"
};

// carto account handle
var account = "acem";

// preset bounds
var presetBounds = {
    ACT: L.latLngBounds(L.latLng(-35.1086749645,148.7397766113), L.latLng(-35.9457711607,149.4827270508)),
    NSW: L.latLngBounds(L.latLng(-27.8585039548,140.5261230469), L.latLng(-37.6490340216,154.1162109375)),
    VIC: L.latLngBounds(L.latLng(-33.6146192923,140.625), L.latLng(-39.3342974298,150.3369140625)),
    SA: L.latLngBounds(L.latLng(-25.5424414701,128.5620117188), L.latLng(-38.6511983323,141.50390625)),
    QLD: L.latLngBounds(L.latLng(-10.1419316861,137.28515625), L.latLng(-29.3821750751,154.9072265625)),
    TAS: L.latLngBounds(L.latLng(-39.1300602421,143.1958007812), L.latLng(-43.9611906389,149.5458984375)),
    WA: L.latLngBounds(L.latLng(-12.8546489056,111.4892578125), L.latLng(-36.2088230928,129.0673828125)),
    NT: L.latLngBounds(L.latLng(-10.1419316861,128.3642578125), L.latLng(-26.3918696718, 138.4716796875)),
    all: L.latLngBounds(L.latLng(-9.7090570686,111.26953125), L.latLng(-43.8662180066,155.2587890625))
};

// theme colours
var colours = {
    hub: {
        curr: '#A51140'
    },
    site: {
        curr: '#556013'
    },
    connex: {
        curr: '#132030',
        hist: '#4D83C4'
    }
}

// STP COLOURS
// STPS     - red and green
// IRTP     - old blue and red
// EDPSCS   hub d95f02 node 7570b3
// TAS      hub fb9a99 node b15928

var stpColours = {
    STPS: {
        //hub: '#EA1F28',
        hub: '#26A7DE'
    },
    IRTP: {
        hub: '#A51140',
        site: '#556013'
    },
    EDPSCS: {
        hub: '#d95f02'//,
        //site: '#7570b3'
    },
    TAS: {
        //hub: '#fb9a99',
        hub: '#7570b3'
    }
}

var map, stateControl, programControl, linkDict, histLinkDict, lookupDict, featureControl;
var toggleObj = { emet_hub_or_training_site: "all", emet_connex: false, historical: null };

// set sidebar off screen
$("#sidebar-content").css("opacity", "0").toggle("slide", { direction: "right" }, 0, function(){
    $("#sidebar-content").css("opacity", "1");
});
var slid = false;

// create search control
// (must be created before map so data can be indexed as added)
var searchControl= new L.control.fuseSearch({
    position: "bottomleft",
    placeholder: "Search hospitals...",
    panelTitle: "Search EMET hospitals",
    maxResultLength: 10,
    threshold: 0.25,
    title: "Search"
});


// set up icons
// var hubIcon = L.icon({
//     iconUrl: "img/map_icons/hubIcon-alt.png",
//     iconAnchor: [8.5, 9],
//     labelAnchor: null
// });

// var siteIcon = L.icon({
//     iconUrl: "img/map_icons/siteIcon-alt.png",
//     iconAnchor: [6.5,6.5],
//     labelAnchor: null
// });

// var hubIconHist = L.icon({
//     iconUrl: "img/map_icons/hubIcon-hist-alt.png",
//     iconAnchor: [8.5, 9],
//     labelAnchor: null
// });

// var siteIconHist = L.icon({
//     iconUrl: "img/map_icons/siteIcon-hist-alt.png",
//     iconAnchor: [6.5,6.5],
//     labelAnchor: null
// });

var stpsIcon = L.icon({
    iconUrl: "img/map_icons/stps-icon.png",
    iconAnchor: [6.5,6.5],
    labelAnchor: null
});

var irtpHubIcon = L.icon({
    iconUrl: "img/map_icons/irtp-hub-icon.png",
    iconAnchor: [6.5,6.5],
    labelAnchor: null
});

var irtpSiteIcon = L.icon({
    iconUrl: "img/map_icons/irtp-site-icon.png",
    iconAnchor: [6.5,6.5],
    labelAnchor: null
});

var edpscsIcon = L.icon({
    iconUrl: "img/map_icons/edpscs-icon.png",
    iconAnchor: [6.5,6.5],
    labelAnchor: null
});

var tasIcon = L.icon({
    iconUrl: "img/map_icons/tas-icon.png",
    iconAnchor: [6.5,6.5],
    labelAnchor: null
});

// line style 
function _lineStyle(feature) {

    var style = {
        weight: 1.5,
        opactiy: 0.9
    };

    style.color = feature.properties.historical != null ? colours.connex.hist : colours.connex.curr;

    return style;

}

var onEachMarker = function(feature, latlng){
    /**
     * creates icons for point features then assigns them based on hub/site status
     * @type {{leaflet marker}}
     */

    // change value if in group
    if(feature.properties.state in groups) feature.properties.state = groups[feature.properties.state];

    // TODO done opt
    // if(feature.properties.emet_hub_or_training_site == "EMET Training Site"){
    //     if(feature.properties.historical == null) return L.marker(latlng, {icon: siteIcon, title: feature.properties.hospital_name})
    //         .setZIndexOffset(50);
    //     else return L.marker(latlng, {icon: siteIconHist, title: feature.properties.hospital_name})
    //     .setZIndexOffset(75);
    // } else {
    //     if(feature.properties.historical == null) return L.marker(latlng, {icon: hubIcon, title: feature.properties.hospital_name})
    //         .setZIndexOffset(100);
    //     else return L.marker(latlng, {icon: hubIconHist, title: feature.properties.hospital_name})
    //     .setZIndexOffset(100);
    // }

    if(feature.properties.state == 'VIC' || feature.properties.state == 'NT') {
        return L.marker(latlng, {icon: stpsIcon, title: feature.properties.hospital_name})
            .setZIndexOffset(50);
    } else if(feature.properties.state == 'NSW' || feature.properties.state == 'SA') {
        return L.marker(latlng, {icon: edpscsIcon, title: feature.properties.hospital_name})
            .setZIndexOffset(50);
    } else if(feature.properties.state == 'QLD' || feature.properties.state == 'WA') {
        if(feature.properties.emet_hub_or_training_site == "EMET Training Site") {
            return L.marker(latlng, {icon: irtpSiteIcon, title: feature.properties.hospital_name})
                .setZIndexOffset(50);
        } else {
            return L.marker(latlng, {icon: irtpHubIcon, title: feature.properties.hospital_name})
                .setZIndexOffset(100);
        } 
    } else if(feature.properties.state == 'TAS') {
        return L.marker(latlng, {icon: tasIcon, title: feature.properties.hospital_name})
            .setZIndexOffset(50);
    }
};

var onEachFeature = function(feature, layer) {
    /**
     * Bind listeners to each feature (ie click, hover, etc)
     */
    layer.on({
        click: triggerClickEvents
    });
};

// CONTROL PROTOTYPING

var EmetControl = L.Control.extend({
	cssClasses: ["leaflet-bar","emet-control"],
	htmlString: "",
    onAdd: function() {
		var div = L.DomUtil.create("div", this.cssClasses.join(" "));
        div.innerHTML = this.htmlString;
		L.DomEvent.disableClickPropagation(div);
        return div;  
    }
});

// LAYER PROTOTYPING

var emetGeoJSON = L.GeoJSON.extend({
    setPointType: function(layer){

        // set point type
        layer.feature.pointType = layer.feature.properties.emet_hub_or_training_site == "EMET Training Site" ? "site" : "hub";

        // set layer property for searching
        layer.feature.layer = layer;
    },
    setMarkerType: function(layer){
        //pass
    },
    options: {
        pointToLayer: onEachMarker,
        onEachFeature: onEachFeature
    },
    onAdd: function (map) {

        for (let i in this._layers) {
            map.addLayer(this._layers[i]);
            this.setPointType(this._layers[i]);
        }

    }
});

var _geojsonNameLookup = function(obj) {

    var lookup = {};
    
    for(let idx = 0; idx < obj.features.length; idx++) {

        let id = obj.features[idx].properties.acem_id;

        lookup[id] = obj.features[idx].properties.hospital_name;

    }

    return lookup;

}

// TODO AS MUCH OTHER PROTOTYPING AS POSSIBLE!
// TODO IE on clicks, on each features

var createInfoHTML = function(props, pointType, state, text){
    /**
     * build html for info window.
     * input feature properties object, and type of point (hub or node)
     * returns HTML str to populate div
     */

    //console.log(Object.keys(linkDict).length,linkDict,Object.keys(histLinkDict).length,histLinkDict);

    var hist = props.historical != null ? true : false;
    var histText = props.historical_desc.length > 0 ? props.historical_desc : null;
    var histConnex = props.historical_hub_acem_id;
    var name = props.hospital_name;
    var emetClass = hist ? "Historical" : props.emet_hub_or_training_site;
    var desc = props.description;
    var lastActive = new Date(props.last_date).toLocaleDateString();

    // look for photos and create thumb variables
    var thumbUrl1 = props.photo1 ? props.photo1 : false;
    var thumbUrl2 = props.photo2 ? props.photo2 : false;

    // create full url variables if photos exist
    // find and replace '_thumb', if it can't be found then replace will return original url anyway
    var fullUrl1 = thumbUrl1 ? thumbUrl1.replace('_thumb', '') : false;
    var fullUrl2 = thumbUrl2 ? thumbUrl2.replace('_thumb', '') : false;

    var html = "";

    // temp random program stuff
    let rand = Math.floor(Math.random()*5);
    let rand2 = Math.floor(Math.random()*4);

    let discArr = ['Rural & Remote','ED / Anaesthetics','ED / ICU', 'Ultrasound','Critical Care (ICU or Anaesthetics)'];
    let remoteArr = ['RA1','RA2','RA3','RA4'];

    // TEMP classify into prog based on state
    // temp program selection
    let STPS = ['VIC', 'NT'];
    let EDPSCS = ['NSW', 'SA'];
    let IRTP = ['QLD','WA'];
    let TAS = ['TAS'];

    var prog;

    if(STPS.indexOf(state) > -1) prog = 'STPS';
    else if(EDPSCS.indexOf(state) > -1) prog = 'EDPSCS';
    else if(IRTP.indexOf(state) > -1) prog = 'IRTP';
    else if(TAS.indexOf(state) > -1) prog = 'TAS';

    // opening
    html += "<div class='sidebar-title' style='background-color: " + stpColours[prog].hub + "'><h1 id='side-title'>" + name + "</h1></div>";
    // html += "<div class='sidebar-top'><img src='img/state_icons/" + state + "-" + pointType.toUpperCase() + "-ICON.png' alt='" + state + " " + pointType +  " ' />" + "<div><span>" + emetClass + "</span></div></div>";
    html += "<div class='sidebar-top'><object type='image/svg+xml' data='img/state_icons/" + state + "-ICON.svg' id='state-icon'>State Logo</object>" + "<div class='title-text' style='background-color: " + stpColours[prog].hub + "'><span>" + prog + " Hospital" + "</span></div></div>";
    html += "<p class='desc'>" + desc + "</p>";
    html += "<div class='discipline'><h2>Discipline / specialty</h2><p>" + discArr[rand] + "</p></div>";
    html += "<div class='discipline'><h2>Remoteness</h2><p>" + remoteArr[rand2] + "</p></div>";
    if(histText != null) html += "<p class='desc'>" + histText + "</p>";
    html += "<div class='hosp-list'>";
    
    // if non-historical site
    if (pointType == "site" && !hist) {

        // standard site
        html += "<h2>" + text.site.heading + "</h2>";
        html += "<ul><li>" + props.linked_emet_hub + "</li></ul>";
        if(props.secondary_linked_hub) html += "<ul><li>" + props.secondary_linked_hub + "</li></ul>";

        // check for hist connections
        if(histConnex) { 
            html += "<h2>"+text.site.historical+"</h2>";
            html += "<ul><li>" + lookupDict[histConnex] + "</li></ul>";
        }
    
    // if the site is historical
    } else if (pointType == "site" && hist) {
        html += "<h2>" + text.site.historical + "</h2>";
        html += "<ul><li>" + props.linked_emet_hub + "</li></ul>";
        if(props.secondary_linked_hub) html += "<ul><li>" + props.secondary_linked_hub + "</li></ul>";

    // if non-historical hub
    } else if (pointType == "hub" && !hist) {

        html += "<h2>"+text.hub.heading+"</h2>";
        html += "<ul>";
        for (let x=0; x<linkDict[props.acem_id].length; x++){
            html += "<li>" + linkDict[props.acem_id][x] + "</li>";
        }
        html += "</ul>";

        if(histLinkDict[props.acem_id]) {
            html += "<h2>"+text.hub.historical+"</h2>";
            html += "<ul>";
            for (let x=0; x<histLinkDict[props.acem_id].length; x++){
                html += "<li>" + histLinkDict[props.acem_id][x] + "</li>";
            }
            html += "</ul>";
        }

    // if the hub is historical
    } else if (pointType == "hub" && hist) {
        html += "<h2>"+text.hub.historical+"</h2>";
        html += "<ul>";
        for (let x=0; x<histLinkDict[props.acem_id].length; x++){
            html += "<li>" + histLinkDict[props.acem_id][x] + "</li>";
        }
        html += "</ul>";
    }
    html += "</div>";
    if(props.photo1) {
		html += !props.photo2 ? "<div id='view-images'><img dest='"+fullUrl1+"' src='"+ thumbUrl1 +"' /></div>" : "<div id='view-images'><img dest='"+fullUrl1+"' src='"+ thumbUrl1 +"' /><img dest='"+fullUrl2+"' src='"+ thumbUrl2 +"' /></div>";
	}
	if(props.email) {
        if(props.url) {
            html += "<p class='foot'>" + text.contact + "<br> <a href='" + props.url + "'>" + props.url + "</a><br>";
        } else html += "<p class='foot'>" + text.contact + "<br>";
		html += "<a href='mailto:" + props.email + "'>" + props.email + "</a></p>";
	} else {
		html += "<p class='foot'>" + text.contact + " <br> <a href='mailto:EMET@acem.org.au'>EMET@acem.org.au</a></p>";
	}
	
    html += "";

    return html;
};

var createLinkDict = function(data){
    /**
     * Creates a dictionary (object) of hospitals by acem id of their linked sites.
     * This is to make the list of hospitals in the info window
     * @type {{object}}
     */
    var dict = {};
    for(let hosp in data.features){

        let props = data.features[hosp].properties;
        let type = props.emet_hub_or_training_site;
        let link1 = props.linked_emet_hub_acem_id;
        let link2 = props.secondary_hub_acem_id;
        let name = props.hospital_name;
        let id = props.acem_id;
        let historical = props.historical != null ? true : false;

        if(historical) continue;

        // check point type
        // if it's a site...
        if(type == "EMET Training Site") {
            // see if linked hosp 1 exists in dict
            // add the hosp if it is, create it if it's not
            if(link1 in dict) dict[link1].push(name);
            else dict[link1] = [name];

            // see if linked hosp 2 exists in dict
            // add the hosp if it is, create it if it's not
            if(link2 in dict) dict[link2].push(name);
            else dict[link2] = [name];

        // if it's a hub see if it exists in the dict, if not add it
        } else if(!dict[id]) dict[id] = [];
    }
    return dict;
};

var createHistLinkDict = function(data){
    /**
     * Creates a dictionary (object) of hospitals by acem id of their linked sites.
     * This is to make the list of hospitals in the info window
     * @type {{object}}
     */
    var dict = {};
    for(let hosp in data.features){

        let props = data.features[hosp].properties;
        let type = props.emet_hub_or_training_site;
        let link1 = props.historical_hub_acem_id;
        let link2 = props.historical != null ? props.linked_emet_hub_acem_id : false;
        let link3 = props.historical != null? props.secondary_hub_acem_id : false;
        let name = props.hospital_name;
        let id = props.acem_id;

        // check point type
        // if it's a site...
        if(type == "EMET Training Site") {
            // see if linked hosp 1 exists in dict
            // add the hosp if it is, create it if it's not
            if(link1 in dict) dict[link1].push(name);
            else dict[link1] = [name];

            // check other links
            if(link2 && link2 in dict) dict[link2].push(name);
            else dict[link2] = [name];
            
            if(link3 && link3 in dict) dict[link3].push(name);
            else dict[link3] = [name];

        // if it's a hub see if it exists in the dict, if not add it
        } else if(!dict[id]) dict[id] = [];
    }
    return dict;
};

var updateInfoWindow = function(layer, divID){
    /**
     * Update infowindow content to display properties of click-on feature
     * Takes layer and the id of the div to be populated
     */
    var props = layer.target.feature.properties;
    var pointType = layer.target.feature.properties.emet_hub_or_training_site == "EMET Training Site" ? "site" : "hub";
    var state = props.state;

    // temp program selection
    let STPS = ['VIC', 'NT'];
    let EDPSCS = ['NSW', 'SA'];
    let IRTP = ['QLD','WA'];
    let TAS = ['TAS'];

    var prog;

    if(STPS.indexOf(state) > -1) prog = 'STPS';
    else if(EDPSCS.indexOf(state) > -1) prog = 'EDPSCS';
    else if(IRTP.indexOf(state) > -1) prog = 'IRTP';
    else if(TAS.indexOf(state) > -1) prog = 'TAS';

    // calc sidebar height minus legend
    var sidebarHeight = $( window ).height() - $("#legend").height();

    // select sidebar, reclass it, repopulate the HTML, set relative height
    // $("#" + divID).removeClass().addClass(pointType).html(createInfoHTML(props, pointType, state, sidebarText))
    //     .css("height", sidebarHeight);

    // TEMPORARY
    // select sidebar, reclass it, repopulate the HTML, set relative height
    $("#" + divID).removeClass().addClass(prog).html(createInfoHTML(props, pointType, state, sidebarText))
        .css("height", sidebarHeight);

    // SVG styling
    // add listen for the icon to load
    $('#state-icon').on('load', function(){

        // get svg jquery obj
        let el = $('#state-icon').getSVG();

        // get polygon
        let polygon = el.find("#highlight polygon");

        // remove existing class style
        polygon.removeClass();

        // change fill to match feature type
        polygon.attr('fill', _getSidebarColour())
        
        // set title height to match state thumbnail
        let imgHeight = $('#state-icon').css('height');
        $('.title-text').css('height',imgHeight);

    });

    // define viewer options and
    // add viewer to images AFTER creating the div
    var viewOpts = {
        toolbar: false,
        movable: false,
        zoomable: false,
        rotatable: false,
        scalable: false,
		title: false,
        url: 'dest'
    };
    $("#view-images").viewer(viewOpts);
};

var _getSidebarColour = function(){

    let className = $('#sidebar-content').attr('class');

    // return colours[className].curr;
    return stpColours[className].hub;

}

var _resizeSidebar = function(){

    // calc sidebar height minus legend
    var sidebarHeight = $( window ).height() - $("#legend").height();

    // select sidebar, reclass it, repopulate the HTML, set relative height
    $("#sidebar-content").css("height", sidebarHeight);

}

var _showHistoricalLegend = function(){
    // show historical legend
    $('.legend-historical').css('display', 'table-row');
     _resizeSidebar();
}
var _hideHistoricalLegend = function(){
    // hide historical legend
    $('.legend-historical').css('display', 'none');
    _resizeSidebar();
}

var _featureInDisplay = function(id) {

    var ret = false;

    layers.display.eachLayer(function(layer){
        if(layer.feature.properties.acem_id == id) ret = true;
    });

    return ret;
}

var triggerClickEvents = function(layer){
    /**
     * Wrapper function to fire multiple onClick events
     */

    // fire link dictionary generation only if it has not been generated already
    if(jQuery.isEmptyObject(linkDict) || jQuery.isEmptyObject(histLinkDict) || jQuery.isEmptyObject(lookupDict)){
        linkDict = createLinkDict(layers.emet_data.raw);
        histLinkDict = createHistLinkDict(layers.emet_data.raw);
        lookupDict = _geojsonNameLookup(layers.emet_data.raw)
    }
    // fire update info window
    updateInfoWindow(layer, "sidebar-content");

    // close all popups
    map.closePopup();
    layers.emet_data.layer.unbindLabel();

    // set point type
    var pointType = layer.target.feature.properties.emet_hub_or_training_site == "EMET Hub" ? "hub" : "site";

    var saveFeat = false;
    
    // check if feature is from display layer
    if(layers.display.getLayers().length > 0 && _featureInDisplay(layer.target.feature.properties.acem_id)) {

        // if clicked feature is in 'display' layer, save it for later
        saveFeat = $.extend( {}, layer.target.feature );
    }

    // reset layers to current filter
    _resetLayers(false);
	
    // highlight network around point (if 'all connex' and hospital type filter toggle is off)
    if(!toggleObj.emet_connex && toggleObj.emet_hub_or_training_site == "all") {

        var showLegend = false;

        for(let idx in layers.emet_connex.raw.features) { 

            let feature = layers.emet_connex.raw.features[idx];

            // see if connex id does not equal the clicked id
            // TODO done opt

            let connex_id = feature.properties.acem_id;
            let clicked_id = layer.target.feature.properties.acem_id;
            let clicked_type = pointType;
            let connex_link1 = feature.properties.linked_emet_hub_acem_id;
            let connex_link2 = feature.properties.secondary_hub_acem_id;
            let hub_id = feature.properties.hub_id;
            let histLink = feature.properties.historical;

            // if the clicked point is a site
            if(clicked_type == "site") {

                // if the connex id is from the point
                if (connex_id == clicked_id

                    // and if the linked hub ID1 or the linked hub ID2 is the clicked ID
                    || connex_link1 == clicked_id
                    || connex_link2 == clicked_id
                ) {

                    // add connex data to layer
                    let geoJson = {
                        type: "FeatureCollection",
                        features: [feature]
                    };

                    if(histLink) showLegend = histLink;

                    layers.emet_connex.layer.addData(geoJson);

                }
            // if the clicked point is a hub
            } else {
                // and if it's either a primary or secondary connection, and the connex hub id matches the clicked hub id
                if ((connex_link1 == clicked_id || connex_link2 == clicked_id) && clicked_id == hub_id
                ) {
                    // add connex data to layer
                    let geoJson = {
                        type: "FeatureCollection",
                        features: [feature]
                    };

                    if(histLink) showLegend = histLink;

                    layers.emet_connex.layer.addData(geoJson);
                } 
            }
        }
    }

    // if there are any historical sites shown as linkages, show the historical legend
    if(showLegend) {
        _showHistoricalLegend()

    // otherwise hide it
    } else {
        _hideHistoricalLegend();
    }

    // show hubs and sites around clicked feature
    for(let idx2 in layers.emet_data.raw.features) {

        // if all is set
        if(toggleObj.emet_hub_or_training_site == "all") { 

            let feature = layers.emet_data.raw.features[idx2];
            
            // if clicked feature is a hub
            if (($.inArray(feature.properties.hospital_name,
                linkDict[layer.target.feature.properties.acem_id]) > -1) 
                || ($.inArray(feature.properties.hospital_name,
                    histLinkDict[layer.target.feature.properties.acem_id]) > -1)) {
                
                // if the feature was clicked and saved, add it to the display layer
                let feats = saveFeat ? [feature, saveFeat] : [feature];

                // add feature data to layer
                let geoJson = {
                    type: "FeatureCollection",
                    features: feats
                };

                layers.display.addData(geoJson);

            // if clicked feature is a site
            } else if (layer.target.feature.properties.linked_emet_hub_acem_id == feature.properties.acem_id ||
                layer.target.feature.properties.secondary_hub_acem_id == feature.properties.acem_id ||
                layer.target.feature.properties.historical_hub_acem_id == feature.properties.acem_id) {
                
                // if the feature was clicked and saved, add it to the display layer
                let feats = saveFeat ? [feature, saveFeat] : [feature];

                // add feature data to layer
                let geoJson = {
                    type: "FeatureCollection",
                    features: feats
                };

                layers.display.addData(geoJson);

            }

        }

    }

    // bind labels to adjacent features
    layers.display.eachLayer(function(feature){ 

        feature.bindLabel(feature.feature.properties.hospital_name.replace(/([\w\s]{20,}?)\s?\b/g, "$1\n"), {
            noHide: true,
            opacity: 1,
            pane: "popupPane",
            direction: 'auto'
        }).showLabel();

        let pointType = feature.feature.properties.emet_hub_or_training_site == "EMET Hub" ? "hub" : "site";

        if(pointType == "site") $(feature.label._container).addClass("site-label");

        if(pointType == "hub") $(feature.label._container).addClass("hub-label");

    });

    // check if window needs sliding, and slide it
    if(!slid) {
        $("#sidebar-content").toggle("slide", {direction: "right"}).css("opacity", "1");
        slid = true;
    }

    // bind label to clicked feature    
    layer.target.bindLabel(layer.target.feature.properties.hospital_name.replace(/([\w\s]{20,}?)\s?\b/g, "$1\n"), {
        noHide: true,
        opacity: 1,
        pane: "popupPane",
        direction: "auto"
    }).showLabel();

    // if site
    if(pointType == "site"){
        
        $(layer.target.label._container).addClass("site-label");

    // if hub
    } else if (pointType == "hub"){

        $(layer.target.label._container).addClass("hub-label");
    }

};

var filterFeatures = function(type, divId, filterProp, layer, htmlProp, all, reindex, fit, toggle, change){
    /**
     * generic-ish function to filter data based on a few parameters
     *
     * type (str):          type of jQuery selector (id, class, or null). all others default to id
     * divId (str):         the name of the element (id, class or type) that is listened to
     * filterProp (str):    the property of the geojson to be filtered on
     * layer (L.layer:      the target layer to be filtered
     * htmlProp (str):      the html property to be listened for change on (eg: 'value' will listen
     *                      for a change in the value property
     * all (bool):          does this filter need an "all" value?
     * reindex (bool):      should we reindex the search after performing the filter?
     * fit (bool):          do we want to map.fitToBounds() the results? (only set up for
     * toggle (bool):       is this filter a simple on/off toggle?
     */
        // TODO: get bounds of whatever filtered features, not presets. Copy filtered features to layer? get bounds of
        // TODO: layer, fit to bounds, then delete layer?
    // set values of type for jQuery call
    var typeChar;
    if(type == "id") typeChar = "#";
    else if(type == "class") typeChar = ".";
    else if(type === null) typeChar = "";
    else typeChar = "#";

	// TODO done opt
    // make jQuery call using "change"
    if(change) { $(typeChar+divId).change( function(){ 

            filterExec($(this).prop(htmlProp), filterProp, layer, htmlProp, all, reindex, fit, toggle, change);
        });
    
    } else 

    // make jQuery call using "click"
    { $(typeChar+divId).click( function(){

            filterExec($(this).prop(htmlProp), filterProp, layer, htmlProp, all, reindex, fit, toggle, change);

        });
    }

};

var filterExec = function(id, filterProp, layer, htmlProp, all, reindex, fit, toggle, change){
    /**
     * sub-function to execute filtering using jquery call.
     * needed to implement this additional function because 2 different jQuery methods are used, i.e. 'click' and 'change'
     *
     * id (jQuery selector):id from $(this) jquery call - does not carry down to sub-function, so needs to be executed in direct callback 
     * filterProp (str):    the property of the geojson to be filtered on
     * layer (L.layer:      the target layer to be filtered
     * htmlProp (str):      the html property to be listened for change on (eg: 'value' will listen
     *                      for a change in the value property
     * all (bool):          does this filter need an "all" value?
     * reindex (bool):      should we reindex the search after performing the filter?
     * fit (bool):          do we want to map.fitToBounds() the results? (only set up for
     * toggle (bool):       is this filter a simple on/off toggle?
     */
    
    // if this is a toggle switch and it is currently OFF, toggle the value to "none"
    // and set option in toggle switch object to "true" for layer
    // TODO done opt

    if(toggle) {
		if(id == "all" && !toggleObj[layer]) {
			$(this).prop(htmlProp, "none");
			toggleObj[layer] = true;
		}

    // otherwise if it's a toggle switch but is currently ON, toggle value back to "all"
    // and set option in toggle to "false" for layer
		else if(id == "none") {
			$(this).prop(htmlProp, "all");
			toggleObj[layer] = false;
		}
	}

    // hide connections
    if((id != "connex" && filterProp == "emet_hub_or_training_site") || filterProp === "historical"){

        toggleObj.emet_connex = false;
    }

    // show historical legend
    if(filterProp === "historical"){
        _showHistoricalLegend();
    }

    // hide historical legend
    if(filterProp !== "historical"){
        _hideHistoricalLegend();
    }


    // show connections
    if(id == "connex" && !toggleObj.emet_connex){
        layers.emet_connex.layer.setStyle( function(feature) {
            if(!toggleObj.state || toggleObj.state == feature.properties.state) {
                return {opacity: 1};
            } else return {opacity: 0};
        });
        id = "all";
        toggleObj.emet_connex = true;
    }

    // set toggle tracker if filtering by hospital type
    if (filterProp == "emet_hub_or_training_site" && id != "connex") {
        toggleObj[filterProp] = id;
    }

    // set toggle tracker if filtering by historical
    if (filterProp == "historical") {
        toggleObj[filterProp] = "Y";
        toggleObj.emet_hub_or_training_site = "all";
    } else if (filterProp != "state") {
        toggleObj.historical = null;
    }

    // if filtering by state
    if (filterProp == "state") {

        // hide sidebar on state toggle
        if(slid){
            $("#sidebar-content").toggle("slide", { direction: "right" });
            slid = false;
        }

        // set toggle tracker
		// TODO done opt
        if (id != "all") {
			toggleObj[filterProp] = id;
        } else delete toggleObj[filterProp];

    }

    console.log('filterProp: ', filterProp, 'toggleObj: ', toggleObj);

    // perform filter
    _filterData(true, true);

    // reindex if necessary
    if(reindex) _reindexFeatures(layers.emet_data.filtering, ["hospital_name","suburb","state"]);

    _resetLayers();

    // if you want to zoom to your selection, zoom it
    if(fit) map.fitBounds(presetBounds[id]);

};

function _resetLayers(refreshAll) {

    refreshAll = refreshAll === undefined ? true : refreshAll;

    // refresh all layers
    if(refreshAll) {
        // clear current layers
        layers.emet_data.layer.clearLayers();
        layers.emet_connex.layer.clearLayers();
        layers.display.clearLayers();

        // readd filtered data
        if(layers.emet_data.filtering) layers.emet_data.layer.addData(layers.emet_data.filtering);
        else layers.emet_data.layer.addData(layers.emet_data.raw);
        
        if(layers.emet_connex.filtering) layers.emet_connex.layer.addData(layers.emet_connex.filtering);
        else layers.emet_connex.layer.addData(layers.emet_connex.raw);
    
    // just refresh display and connex
    } else {
        // clear
        layers.emet_connex.layer.clearLayers();
        layers.display.clearLayers();

        //readd
        if(layers.emet_connex.filtering) layers.emet_connex.layer.addData(layers.emet_connex.filtering);
        else layers.emet_connex.layer.addData(layers.emet_connex.raw);

    }

}

function _reindexFeatures(source, params) {
    
    // recreate search index with specified features
    searchControl.indexFeatures(source, params);

}

function _featFilter(feat, idx){

    var ret = [];
    
    // loop over filters
    for(let filter in toggleObj) {

        // set value
        let val = toggleObj[filter];

        // skip connex filter for points
        if(filter == "emet_connex" && this == "points") continue;

        // skip point filter for connex
        else if(filter == "emet_hub_or_training_site" && this == "connex") continue;

        // check if showing connex and keep
        else if(filter == "emet_hub_or_training_site" && val == "all") ret.push(true);
        else if(filter == "emet_connex" && val) ret.push(true);

        // check if filtering all, and keep
        else if(filter == "emet_hub_or_training_site" && val == "all") ret.push(true);

        // check if filtering historical
        else if(filter == "historical" && val == "Y") ret.push(true);

        // check if value matches, and keep
        else if(val == feat.properties[filter]) ret.push(true);

        // otherwise do not keep
        else ret.push(false);

    }

    ret = ret.indexOf(false) > -1 ? false : true;

    return ret;

}

function _filterData(point, conn){

    // if filtering points
    if(point) {

        layers.emet_data.filtering = {};

        // perform filter (points)
        layers.emet_data.filtering = {
            type: "FeatureCollection",
            features: layers.emet_data.raw.features.filter(_featFilter, "points")
        };

        console.log("point feats: ", layers.emet_data.filtering.features.length + " of " + layers.emet_data.raw.features.length);

    } 
    if(conn) {
        layers.emet_connex.filtering = {};

        // perform filter (connex)
        layers.emet_connex.filtering = {
            type: "FeatureCollection",
            features: layers.emet_connex.raw.features.filter(_featFilter, "connex")
        };

        console.log("connex feats: ", layers.emet_connex.filtering.features.length + " of " + layers.emet_connex.raw.features.length);
    }

}

var getCartoJSON = function(user, layer, map, query){
    /**
     * Makes request for GeoJSON to Carto SQL API, then checks whether data is for Point or Line, and creates layers
     * based on feature type
     */

    query = query || "SELECT * FROM " + layer;

    layer = layer === "emet_data_dev" ? "emet_data" : layer;

    // make ajax call for json
    $.getJSON("https://"+ user +".carto.com/api/v2/sql/?q="+query+"&format=geojson", function(data) {

        // process layers containing point data
		// TODO done opt
        if(data.features[0].geometry && data.features[0].geometry.type == "Point") {

            // store raw data in obj
            layers[layer].raw = data;

            _filterData(true, false);

            // store layer obj in obj
            layers[layer].layer = new emetGeoJSON(layers.emet_data.filtering);

            // index points for searching
            searchControl.indexFeatures(layers.emet_data.filtering, ["hospital_name","suburb","state"]);

            // add layer to map
            layers[layer].layer.addTo(map);

        // process layers containing line data
        } else if(data.features[0].geometry && data.features[0].geometry.type == "LineString"){

            let year = JSON.stringify(new Date().getFullYear()).substring(2);

            layers[layer].raw = data;

            layers[layer].layer = new emetGeoJSON({"type": "FeatureCollection", "features": [] },{
                style: _lineStyle,
                attribution: "© 2017-" + year + " <a href='https://www.acem.org.au/' target='blank'>ACEM</a>"
            }).addTo(map);
        }
        

    }).done(function(){
        // check if both layers have been received
        if(layers.emet_data.layer && layers.emet_connex.layer) {
            console.log("...Data received");
            // stop spin
            map.spin(false);

            _filterData(true, true);
        }
    });
};

var createMap = function() {
    /**
     * map initialisation. create instance, add basemap, add map click events, add controls (search, zoom, toggles),
     * add filter listeners, get layers, add layers
     *
     * no return
     */
    var baseMap = L.tileLayer("https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}.png",{
        attribution: "&copy; <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
    });

    // create map
    map = new L.Map("map", {
        layers: [baseMap],
        zoomControl: false
    }).on("click", function(){
        /**
         * Hide/show sidebar content and connex lines on map body click
         */
        if(slid){
            $("#sidebar-content").toggle("slide", { direction: "right" });
            slid = false;
        }

        // hide legend if not filtering by historical sites
        if(!toggleObj.historical && $('.legend-historical').css('display', 'table-row')) {
            _hideHistoricalLegend();
        }

        // reset layers
        _resetLayers();

    });

    // set spinner
    map.spin(true);

    // zoom to extents
    map.fitBounds(presetBounds.all);

    // add search control to map
    searchControl.options.mapObj = map;
    searchControl.addTo(map);

    // add zoom control
    L.control.zoom({ position: "bottomleft" }).addTo(map);
	
    // add connex control
    featureControl = new EmetControl({
        position: "topleft"
    });
	
	var featHtml = "";
	featHtml += "<h3>Layers</h3>";
	// divString += "<input type='checkbox' name='connex' value='all'> Show all connections<br>";
	featHtml += "<input type='radio' name='point-filter' value='EMET Hub' class='hubs'> STP Hubs<br>";
	featHtml += "<input type='radio' name='point-filter' value='all' checked class='hubs'> All Hubs and Training Sites<br>";
    featHtml += "<input type='radio' name='point-filter' value='connex' class='hubs'> STP Hubs and Training Sites with connections<br>";
    // featHtml += "<input type='radio' name='point-filter' value='Y' class='historical'> EMET historical and current sites<br>";
	
	featureControl.htmlString = featHtml;
	
    featureControl.addTo(map);
	
	featureControl.getContainer().className += " feature-control";

    // add hospital filter listener
    filterFeatures(null, "input[type='radio'][name='point-filter'].hubs",
        "emet_hub_or_training_site", "emet_data", "value", true, true, false, false, true);

    filterFeatures(null, "input[type='radio'][name='point-filter'].historical",
        "historical", "emet_data", "value", true, true, false, false, true);

    // add state control toggle
    stateControl = new EmetControl({
        position: "topleft"
    });
	
	var stateHtml = "";
	stateHtml += "<a href='#' id='all' class='dropdown-selection'>Show all states</a>";
	stateHtml += "<a href='#' id='NSW' class='dropdown-selection'>NSW & ACT</a>";
	stateHtml += "<a href='#' id='NT' class='dropdown-selection'>NT</a>";
	stateHtml += "<a href='#' id='QLD' class='dropdown-selection'>QLD</a>";
	stateHtml += "<a href='#' id='SA' class='dropdown-selection'>SA</a>";
	stateHtml += "<a href='#' id='TAS' class='dropdown-selection'>TAS</a>";
	stateHtml += "<a href='#' id='VIC' class='dropdown-selection'>VIC</a>";
	stateHtml += "<a href='#' id='WA' class='dropdown-selection'>WA</a>";
	stateHtml = "<div class='dropdown-content'>" + stateHtml + "</div>";
    stateHtml = "<button class='dropbtn'>Filter by state        &#x25BC;</button>" + stateHtml;
    stateHtml = "<h3 class='dropdown-label'>State</h3>" + stateHtml;
	stateHtml = "<div class='dropdown'>" + stateHtml + "</div>";
	
	stateControl.htmlString = stateHtml;

    stateControl.addTo(map);
	
    stateControl.getContainer().className += " state-control";

    // add filter listener
    filterFeatures("class", "dropdown-selection", "state", "emet_data", "id", true, true, true, false, false );
    
    programControl = new EmetControl({
        position: "topleft"
    });

    var programHtml = "";
	programHtml += "<a href='#' id='all' class='dropdown-selection'>Show all</a>";
	programHtml += "<a href='#' id='STPS' class='dropdown-selection'>STPS</a>";
	programHtml += "<a href='#' id='IRTP' class='dropdown-selection'>IRTP</a>";
	programHtml += "<a href='#' id='EDPSCS' class='dropdown-selection'>EDPSCS</a>";
	programHtml += "<a href='#' id='TAS' class='dropdown-selection'>TAS</a>";
	programHtml = "<div class='dropdown-content'>" + programHtml + "</div>";
    programHtml = "<button class='dropbtn'>Filter by program        &#x25BC;</button>" + programHtml;
    programHtml = "<h3 class='dropdown-label'>Program</h3>" + programHtml;
	programHtml = "<div class='dropdown'>" + programHtml + "</div>";
	
	programControl.htmlString = programHtml;

    programControl.addTo(map);
	
    programControl.getContainer().className += " program-control";

    // add filter listener
    // filterFeatures("class", "dropdown-selection", "program", "emet_data", "id", true, true, true, false, false );
	
	// add label control toggle
    var labelControl = new EmetControl({
        position: "topleft"
    });
	
	labelControl.htmlString = '<input id="labelToggle" type="checkbox" checked class="on">Labels</input>';
	
    labelControl.addTo(map);
	
	labelControl.getContainer().className += " label-control";
	
	$("#labelToggle").change(function(){
		// TODO done opt
		if($(this).hasClass("on")) {
			$(this).toggleClass("on");
			var style = $('<style class="hack-style">.leaflet-label { display: none; }</style>');
			$('html > head').append(style);
		} else {
			$(this).toggleClass("on");
			$(".hack-style").remove();
			
		}
	});

    // menu jQuery
    $(".dropdown").click(function(){
        if($(this).children(".dropdown-content").css("display") == "none") {
            $(this).children(".dropdown-content").show();
        } else $(this).children(".dropdown-content").hide();

    });

    // menu click jQuery
    $(".dropdown-selection").click(function() {
        $(this).parent().parent().children(".dropbtn").html("Showing: " + $(this).prop("id"));
    });

    // get layers from carto
    console.log("Getting data...");

    var connexQuery = "SELECT ed.acem_id as acem_id, " +
	    "case when (ed.historical_hub_acem_id is not null AND ed.historical_hub_acem_id = ec.acem_id) then ed.historical_hub_acem_id " +
		"else ed.linked_emet_hub_acem_id end as linked_emet_hub_acem_id, " +
	    "ed.secondary_hub_acem_id as secondary_hub_acem_id, " +
	    "ST_GeomFromGeoJSON(CONCAT('{\"type\":\"LineString\",\"coordinates\":[[',ed.longitude, ', ', ed.latitude,'],[',ec.longitude, ', ', ec.latitude,']] }')) as the_geom, " +
	    "ec.acem_id as hub_id, " +
	    "ed.state as state, " +
        "case when (ed.historical IS TRUE) then TRUE when (ec.historical IS TRUE) then TRUE  " +
        "when (ed.historical_hub_acem_id is not null AND ed.historical_hub_acem_id = ec.acem_id) then TRUE " +
		"else NULL end as historical " +
        "FROM emet_data ed JOIN emet_data ec ON ed.linked_emet_hub_acem_id = ec.acem_id " +
	    "OR ed.secondary_hub_acem_id = ec.acem_id OR ed.historical_hub_acem_id = ec.acem_id";

    // raw sql query
    /*
    SELECT 
        ed.acem_id as acem_id, 
        case 
            when (ed.historical_hub_acem_id is not null AND CAST(ed.historical_hub_acem_id as INTEGER) = ec.acem_id) then CAST(ed.historical_hub_acem_id as INTEGER)
            else ed.linked_emet_hub_acem_id end as linked_emet_hub_acem_id, 
        ed.secondary_hub_acem_id as secondary_hub_acem_id, 
        ST_GeomFromGeoJSON(CONCAT('{"type":"LineString","coordinates":[[',ed.longitude, ', ', ed.latitude,'],[',ec.longitude, ', ', ec.latitude,']] }')) as the_geom,
        ec.acem_id as hub_id, 
        ed.state as state, 
        case 
            when (ed.historical IS TRUE) then TRUE
            when (ec.historical IS TRUE) then TRUE 
            when (ed.historical_hub_acem_id is not null AND ed.historical_hub_acem_id = ec.acem_id) then TRUE 
            else NULL end as historical 
    FROM 
        emet_data_dev ed 
    JOIN 
        emet_data_dev ec 
    ON 
        ed.linked_emet_hub_acem_id = ec.acem_id
        OR ed.secondary_hub_acem_id = ec.acem_id
        OR ed.historical_hub_acem_id = ec.acem_id;
    */

    // go get json from carto
    // points
    getCartoJSON(account, "emet_data", map);

    // lines
    getCartoJSON(account, "emet_connex", map, connexQuery);

    // empty geojson for "display" layer
    var nullGeoJson = {
        type: "FeatureCollection",
        features: []
    };

    // make display layer to hold historical / out of state sites on click
    layers.display = new emetGeoJSON(nullGeoJson).addTo(map);

};

// main function
window.onload = createMap;
;
var sidebarText = {
  'contact': 'For more information on this  program, contact:',
  'site': {
    'heading': 'Serviced by:',
    'historical': 'Formerly serviced by:'
  },
  'hub': {
    'heading': 'Servicing hospitals:',
    'historical': 'Formerly servicing hospitals:'
  }
};
