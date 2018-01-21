import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { UsersProvider } from '../../providers/users-prov';
import { InsertionsProvider } from '../../providers/insertions-prov';
import { MapProvider } from '../../providers/map-prov';
import { Logger } from '../../providers/logger-prov';

// This is to prevent any warnings from TypeScript about the google object that the Google Maps SDK makes available 
declare var google;

@Component({
    selector: 'page-map',
    templateUrl: 'map.html'
})
export class MapPage {

    @ViewChild('map') mapElement: ElementRef;
    map: any;
    home: any;
    insertionsMarkers: any = [];

    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        private users: UsersProvider,
        private insertions: InsertionsProvider,
        private mapProvider: MapProvider) {
        this.mapProvider.callbackMapLoaded = () => this.mapLoaded();
    }

    ionViewDidLoad() {
        Logger.info(this, 'ionViewDidLoad');

        this.users.getCurrentUser()
            .then(currentUser => {
                this.loadMap();
            })
            .catch(err => {
                Logger.error(this, 'getCurrentUser', err);
            })
    }

    ionViewDidEnter() {
        // refreshes the map when reentering the view
        if (this.map) {
            google.maps.event.trigger(this.map, 'resize');
        }
    }

    loadMap() {
        this.mapProvider.setMapCanvas(this.mapElement.nativeElement);
        this.mapProvider.loadGoogleMaps();
    }


    // Initialize the map
    public mapLoaded() {
        this.map = this.mapProvider.getMap();


        this.users.getCurrentUser()
            .then(currentUser => {
                this.home = new google.maps.Marker();
                this.home.setIcon("assets/img/homeMapIcon.png");
                this.home.setPosition(currentUser.location);
                this.home.setMap(this.map);

                this.map.setCenter(currentUser.location);
                google.maps.event.trigger(this.map, 'resize');
            })
            .catch(err => {
                Logger.error(this, 'getCurrentUser', err);
            })

        this.insertions.getInsertions()
            .then(insertions => {
                Logger.debug(this, 'insertions received', insertions);
                insertions.forEach(insertion => {
                    var marker = new google.maps.Marker();
                    marker.setIcon(insertion.icon);
                    marker.setPosition(insertion.location);
                    marker.setMap(this.map);
                    this.insertionsMarkers.push(marker);
                });
            })
            .catch(err => {
                Logger.error(this, 'getInsertions', err);
            });

    }


}
