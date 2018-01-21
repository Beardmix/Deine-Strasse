import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ViewController, LoadingController } from 'ionic-angular';
import { Logger } from '../../providers/logger-prov';
import { DataCtrlProvider } from '../../providers/data-ctrl';

/**
 * Generated class for the LoginPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
    selector: 'page-login',
    templateUrl: 'login.html',
})
export class LoginPage {
    signin = {
        email: "",
        password: ""
    };

    constructor(
        public navCtrl: NavController,
        public viewCtrl: ViewController, 
        public loadingCtrl: LoadingController,
        public dataCtrl: DataCtrlProvider, 
        public navParams: NavParams) {

    }

    ionViewDidLoad() {
        Logger.info(this, 'ionViewDidLoad');
    }

    signIn() {
        let signin_loading = this.loadingCtrl.create({
            content: 'Signing in...'
        });
        signin_loading.present();

        // code here
        this.dataCtrl.login(this.signin.email, this.signin.password)
        .then(() => {
            signin_loading.dismiss();
            this.dismiss();
        })
        .catch((err) => {
            Logger.error(this, 'Sign In Error', err);
            signin_loading.dismiss();
        });

    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

}
