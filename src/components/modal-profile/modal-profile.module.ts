import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { ModalProfileComponent } from './modal-profile';

@NgModule({
    declarations: [
        ModalProfileComponent,
    ],
    imports: [
        IonicModule,
    ],
    exports: [
        ModalProfileComponent
    ]
})
export class ModalProfileComponentModule { }
