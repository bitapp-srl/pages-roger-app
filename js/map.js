jQuery(document).ready(function($) {

    'use strict';
    //set your google maps parameters
    var $latitude = 44.511663,
        $longitude = 11.342605,
        $map_zoom = 13;

    //define the basic color of your map, plus a value for saturation and brightness
    var $main_color = '#2d313f',
        $saturation = -20,
        $brightness = 5;

    //we define here the style of the map
    var style = [{
            //set saturation for the labels on the map
            elementType: "labels",
            stylers: [
                { saturation: $saturation }
            ]
        },
        { //poi stands for point of interest - don't show these lables on the map 
            featureType: "poi",
            elementType: "labels",
            stylers: [
                { visibility: "off" }
            ]
        },
        {
            //don't show highways lables on the map
            featureType: 'road.highway',
            elementType: 'labels',
            stylers: [
                { visibility: "off" }
            ]
        },
        {
            //don't show local road lables on the map
            featureType: "road.local",
            elementType: "labels.icon",
            stylers: [
                { visibility: "off" }
            ]
        },
        {
            //don't show arterial road lables on the map
            featureType: "road.arterial",
            elementType: "labels.icon",
            stylers: [
                { visibility: "off" }
            ]
        },
        {
            //don't show road lables on the map
            featureType: "road",
            elementType: "geometry.stroke",
            stylers: [
                { visibility: "off" }
            ]
        },
        //style different elements on the map
        {
            featureType: "transit",
            elementType: "geometry.fill",
            stylers: [
                { hue: $main_color },
                { visibility: "on" },
                { lightness: $brightness },
                { saturation: $saturation }
            ]
        },
        {
            featureType: "poi",
            elementType: "geometry.fill",
            stylers: [
                { hue: $main_color },
                { visibility: "on" },
                { lightness: $brightness },
                { saturation: $saturation }
            ]
        },
        {
            featureType: "poi.government",
            elementType: "geometry.fill",
            stylers: [
                { hue: $main_color },
                { visibility: "on" },
                { lightness: $brightness },
                { saturation: $saturation }
            ]
        },
        {
            featureType: "poi.attraction",
            elementType: "geometry.fill",
            stylers: [
                { hue: $main_color },
                { visibility: "on" },
                { lightness: $brightness },
                { saturation: $saturation }
            ]
        },
        {
            featureType: "poi.business",
            elementType: "geometry.fill",
            stylers: [
                { hue: $main_color },
                { visibility: "on" },
                { lightness: $brightness },
                { saturation: $saturation }
            ]
        },
        {
            featureType: "transit",
            elementType: "geometry.fill",
            stylers: [
                { hue: $main_color },
                { visibility: "on" },
                { lightness: $brightness },
                { saturation: $saturation }
            ]
        },
        {
            featureType: "transit.station",
            elementType: "geometry.fill",
            stylers: [
                { hue: $main_color },
                { visibility: "on" },
                { lightness: $brightness },
                { saturation: $saturation }
            ]
        },
        {
            featureType: "landscape",
            stylers: [
                { hue: $main_color },
                { visibility: "on" },
                { lightness: $brightness },
                { saturation: $saturation }
            ]

        },
        {
            featureType: "road",
            elementType: "geometry.fill",
            stylers: [
                { hue: $main_color },
                { visibility: "on" },
                { lightness: $brightness },
                { saturation: $saturation }
            ]
        },
        {
            featureType: "road.highway",
            elementType: "geometry.fill",
            stylers: [
                { hue: $main_color },
                { visibility: "on" },
                { lightness: $brightness },
                { saturation: $saturation }
            ]
        },
        {
            featureType: "water",
            elementType: "geometry",
            stylers: [
                { hue: $main_color },
                { visibility: "on" },
                { lightness: $brightness },
                { saturation: $saturation }
            ]
        }
    ];

    //set google map options
    var map_options = {
            center: new google.maps.LatLng($latitude, $longitude),
            zoom: $map_zoom,
            panControl: false,
            mapTypeControl: false,
            streetViewControl: false,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            styles: style,
            clickableIcons: false,
        }
        //inizialize the map
    var map = new google.maps.Map(document.getElementById('container-map'), map_options);

    var areeRilascioLayer = new google.maps.KmlLayer({
        url: 'https://corrente.bo.it/assets/kml/aree-rilascio.kml',
        suppressInfoWindows: true,
        preserveViewport: true,
        map: map
    });

    var parcheggiLayer = new google.maps.KmlLayer({
        url: 'https://corrente.bo.it/assets/kml/parcheggi-carsharing.kml',
        suppressInfoWindows: true,
        preserveViewport: true,
        map: null
    });

    var zoneNoTransitoLayer = new google.maps.KmlLayer({
        url: 'https://corrente.bo.it/assets/kml/zone-no-transito.kml',
        suppressInfoWindows: true,
        preserveViewport: true,
        map: null
    });

    $('.btn-mappa').click(function() {
        var active = $(this).data('active') == '1';

        if (active) {
            eval($(this).data('layer')).setMap(null);

            $(this).removeClass('active');

            $(this).data('active', '0')
        } else {
            eval($(this).data('layer')).setMap(map);

            $(this).addClass('active');

            $(this).data('active', '1');
        }
    });
});