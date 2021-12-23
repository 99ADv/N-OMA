//#region Angular
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
//#endregion

//#region Capacitor
import { Storage } from '@capacitor/storage';
//#endregion

import { INTRO_KEY } from 'src/app/core/guards/intro/intro.guard';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.page.html',
  styleUrls: ['./intro.page.scss'],
})

export class IntroPage implements OnInit {
  //#region Variables
  //#endregion

  //#region Index
  constructor(
    private router:Router
  ) { }

  //#region Live cycle
  ngOnInit() {
  }
  //#endregion

  //#endregion

  //#region Events
  async Start() {
    await Storage.set({key: INTRO_KEY, value: 'true'});
    this.router.navigateByUrl('/login', {replaceUrl: true})
  }
  //#endregion
}
