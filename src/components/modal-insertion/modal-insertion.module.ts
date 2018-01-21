import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { ModalInsertionComponent } from './modal-insertion';

@NgModule({
    declarations: [
        ModalInsertionComponent,
    ],
    imports: [
        IonicModule,
    ],
    exports: [
        ModalInsertionComponent
    ]
})
export class ModalInsertionComponentModule { }
