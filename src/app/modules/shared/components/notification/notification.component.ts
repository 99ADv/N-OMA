//#region Angular
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
//#endregion

//#region Interface
import { notification } from 'src/app/interface/others';
//#endregion

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
})

export class NotificationComponent implements OnInit {
  //#region Variable
  
  //#region DOM
  @Input() top :string = 'top-1';

  //#region Event
  @Output() showEvent = new EventEmitter<string>();
  //#endregion

  //#endregion

  //#endregion

  //#region Object
  @Input() modal: notification = {
    modal: 'hide',
    type_of_message: 'message',
    message: ''
  }
  //#endregion

  //#region Index
  constructor() { }

  //#region Live cycle
  ngOnInit() {}
  //#endregion

  //#endregion
}
