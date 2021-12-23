//#region Angular
import { Component, Input, OnInit } from '@angular/core';
//#endregion

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})

export class FooterComponent implements OnInit {
  //#region Variables

  //#region DOM
  @Input() styleFooter: string = 'below';
  //#endregion

  //#endregion

  //#region Index
  constructor() { }

  //#region Live cycle
  ngOnInit() {}
  //#endregion

  //#endregion
}