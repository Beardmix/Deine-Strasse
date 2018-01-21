import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';
import { Insertion } from '../../classes/class-insertion';
import { InsertionsProvider } from '../../providers/insertions-prov';
import { DataCtrlProvider } from "../../providers/data-ctrl";
import { Logger } from '../../providers/logger-prov';
import { ToastController } from 'ionic-angular';

@Component({
    selector: 'modal-insertion-fields',
    templateUrl: 'modal-insertion-fields.html'
})
export class ModalInsertionFieldsComponent {

    // insertion to display
    insertion: Insertion = new Insertion();

    viewTitle: string = "";

    constructor(
        public params: NavParams,
        public viewCtrl: ViewController,
        private toastCtrl: ToastController,
        private insertionsProv: InsertionsProvider,
        private dataCtrl: DataCtrlProvider) {

        this.viewTitle = params.get('viewTitle');
        Logger.debug(this, 'viewTitle', this.viewTitle);
    }

    /**
     * Closes modal and returns appropriate data
     */
    public closeModal() {
        let returnData = {};
        this.viewCtrl.dismiss(returnData);
    }

    public addInsertion() {
        this.insertionsProv.addInsertion(this.insertion)
            .then(entry => {
                this.presentToast("Insertion successfully created");
                let returnData = {};
                this.viewCtrl.dismiss(returnData);
            })
            .catch(err => {
                this.presentToast("Insertion's creation failed");
                Logger.error(this, 'addInsertion', err);
            });
    }


    presentToast(message: string) {
        let toast = this.toastCtrl.create({
            message: message,
            duration: 3000,
            position: 'bottom'
        });

        toast.present();
    }

}
