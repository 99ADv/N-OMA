//#region Angular
import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';
//#endregion

export const TOKEN_KEY = 'my-token';

//#region Service
import { UserService } from '../../services/user/user.service';
//#endregion

//#region Capacitor
import { Storage } from '@capacitor/storage';
//#endregion

@Injectable({
  providedIn: 'root'
})
export class AutoLoginGuard implements CanLoad {
  
  constructor (private userService: UserService,private router: Router) {} 

  async canLoad(): Promise<boolean> {
    const token = await Storage.get({key: TOKEN_KEY})
    if(token && token.value != null && token.value != undefined && token.value != ''){
      this.router.navigate(['/home'])
      return false;
    }
    else  {
      return true;
    }
  }
}
