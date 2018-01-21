import { Injectable } from '@angular/core';
import { ConnectivityProvider } from './connectivity-prov';
import { DataCtrlProvider } from './data-ctrl';
import { Logger } from './logger-prov';

declare var google;
declare var launchnavigator: any;

@Injectable()
export class MapProvider {
    private static s_googleMaps_apiKey: string = 'AIzaSyA2blXUQZBxap4jpjOjieSLnixG3pTMUZ4';
    static s_mapInitialised: boolean = false;
    static s_googleMapsScript: any;
    static s_currentLocation: any;
    mapGoogle: any;
    mapCanvas: any;

    static currentPositionAvailable: boolean = false;

    public callbackMapLoaded: () => void;

    constructor(private connectivityService: ConnectivityProvider,
        private logger: Logger,
        private dataCtrl: DataCtrlProvider
    ) {
        Logger.debug(this, "API Key", MapProvider.s_googleMaps_apiKey);

        //Load the SDK
        window['mapInit'] = () => {
            Logger.info(this, 'mapInit Callback Triggered');
            this.initMap();
        }

        // GoogleMaps API script.
        MapProvider.s_googleMapsScript = document.createElement("script");
        MapProvider.s_googleMapsScript.id = "googleMaps";

        if (MapProvider.s_googleMaps_apiKey) {
            MapProvider.s_googleMapsScript.src = 'http://maps.google.com/maps/api/js?key=' + MapProvider.s_googleMaps_apiKey + '&callback=mapInit';
        } else {
            MapProvider.s_googleMapsScript.src = 'http://maps.google.com/maps/api/js?callback=mapInit'
        }

    }

    public setMapCanvas(canvas) {
        this.mapCanvas = canvas;
    }

    public getMap() {
        return this.mapGoogle;
    }

    public isMapInitialized() {
        return MapProvider.s_mapInitialised;
    }

    public centerMap(f_coordinates) {
        if (undefined != this.mapGoogle) {
            if (undefined != f_coordinates) {
                this.mapGoogle.panTo(f_coordinates);
            }
            else {
                Logger.error(this, '[MapProvider] The coordinates are not defined');
            }
        }
        else {
            Logger.error(this, '[MapProvider] The map is not yet created');
        }
    }

    public centerMapPanned(f_coordinates, offset_x, offset_y) {
        if (undefined != this.mapGoogle) {
            if (undefined != f_coordinates) {
                this.mapGoogle.setCenter(f_coordinates);
                this.mapGoogle.panBy(offset_x, offset_y);
            }
            else {
                Logger.error(this, '[MapProvider] The coordinates are not defined');
            }
        }
        else {
            Logger.error(this, '[MapProvider] The map is not yet created');
        }
    }

    public getCenter() {
        return this.mapGoogle.getCenter();
    }

    public loadGoogleMaps() {
        this.connectivityService.waitForOnline(15000)
            .then((msg) => {
                Logger.debug(this, 'waitForOnline - Online', msg);

                // We should not call loadGoogleMaps more than once, so this should always be true
                if (typeof google == "undefined" || typeof google.maps == "undefined") {
                    // GoogleMaps API script.      
                    document.body.appendChild(MapProvider.s_googleMapsScript);
                } else {
                    // If we call loadGoogleMaps more than once, we can check if the map has been initialised. If not we do it there.
                    if (!MapProvider.s_mapInitialised) {
                        this.initMap();
                    }
                }

            })
            .catch((err) => {
                // Connection Timeout - No internet available.
                // TODO: a display message that internet is not available would be here nice.
                Logger.debug(this, 'waitForOnline - Offline', err);
            });
    }

    public initMap() {

        var mapStyleArray = [
            {
                featureType: "all",
                stylers: [
                    { saturation: -50 }
                ]
            }, {
                featureType: "road.arterial",
                elementType: "geometry",
                stylers: [
                    { hue: "#00ffee" },
                    { saturation: 50 }
                ]
            }, {
                featureType: "poi.business",
                elementType: "labels",
                stylers: [
                    { visibility: "off" }
                ]
            }
        ];
        let mapOptions = {
            styles: mapStyleArray,
            zoom: 15,
            maxZoom: 16,
            minZoom: 12,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            fullscreenControl: false,
            zoomControl: true,
            mapTypeControl: false,
            scaleControl: false,
            rotateControl: false,
            streetViewControl: false,
            panControl: false,
            scrollwheel: true,
            disableDefaultUI: true,
            clickableIcons: false,
        }

        this.mapGoogle = new google.maps.Map(this.mapCanvas, mapOptions);
        this.mapGoogle.setCenter({ lat: 48.778574, lng: 9.179708 });
        MapProvider.s_mapInitialised = true;

        this.loadBounderies();
        this.callbackMapLoaded();
    }

    private loadBounderies() {
        Logger.info(this, 'loadBounderies');
        this.dataCtrl.getBounderies()
            .then(bounds => {
                var polygonMask = new google.maps.Polygon({
                    map: this.mapGoogle,
                    strokeColor: '#91B8BD',
                    strokeOpacity: 0.8,
                    strokeWeight: 5,
                    fillColor: '#91B8BD',
                    fillOpacity: 0.0,
                    paths: [
                        // inner quad
                        [new google.maps.LatLng(bounds.southwest.lat, bounds.southwest.lng),
                        new google.maps.LatLng(bounds.southwest.lat, bounds.northeast.lng),
                        new google.maps.LatLng(bounds.northeast.lat, bounds.northeast.lng),
                        new google.maps.LatLng(bounds.northeast.lat, bounds.southwest.lng),
                        new google.maps.LatLng(bounds.southwest.lat, bounds.southwest.lng)]]
                });
            })
            .catch(err => {
                Logger.error(this, 'Error Loading Bounderies', err);
            })
    }


}
