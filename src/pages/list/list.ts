import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ModalController } from 'ionic-angular';
import { ModalInsertionComponent } from '../../components/modal-insertion/modal-insertion';
import { ModalInsertionFieldsComponent } from '../../components/modal-insertion-fields/modal-insertion-fields';
import { InsertionsProvider } from '../../providers/insertions-prov';
import { Insertion } from '../../classes/class-insertion';
import { Logger } from '../../providers/logger-prov';

@Component({
    selector: 'page-list',
    templateUrl: 'list.html',
})
export class ListPage {
    insertions: Insertion[] = [];
    loading: any;

    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        public modalCtrl: ModalController,
        private insertionsProv: InsertionsProvider,
        public loadingCtrl: LoadingController) {

        // starts the loading UI element
        this.presentLoadingDefault();
    }

    /**
     * Function triggered when the View has been loaded
     */
    ionViewDidLoad() {
        Logger.info(this, 'ionViewDidLoad');

        // fetch insertions from the local datacache
        this.insertionsProv.getInsertions()
            .then(insertions => {
                Logger.debug(this, 'insertions received', insertions);
                // stop the loading action as over
                this.loading.dismiss();
                // copies insertions to the display
                this.insertions = insertions;
            })
            .catch(err => {
                Logger.error(this, 'getInsertions', err);
                // stop the loading action as a bug occured
                this.loading.dismiss();
            });
    }

    /**
     * Shows the default loading element
     */
    presentLoadingDefault() {
        this.loading = this.loadingCtrl.create({});
        this.loading.present();
    }

    /**
     * Presents the insertion modal when clicked on a list element
     * @param insertionId ID of the insertion to display
     */
    presentInsertionModal(insertionId) {
        let profileModal = this.modalCtrl.create(ModalInsertionComponent, { insertionId: insertionId });
        profileModal.present();
    }

    presentNewInsertionModal() {
        let profileModal = this.modalCtrl.create(ModalInsertionFieldsComponent, { viewTitle: "New Insertion" });
        profileModal.present();
    }

}