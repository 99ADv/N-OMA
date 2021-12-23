//#region Iport

//#region Angular
import { Injectable } from '@angular/core';
//#endregion

//#endregion

@Injectable({
  providedIn: 'root'
})

export class HelpersDevService {

  //#region Start
  constructor() { }
  //#endregion

  //#region Tools methods
  InterpretResponse(result: any) {
    let response: any = {
      message: '',
      status: false
    }
    switch (result.status) {
      case 700:
        response.message = 'succes';
        response.status = true;
        break;
      case 701:
        response.message = '(r701) Error inesperado.';
        break;
      case 702:
        response.message = 'Credenciales incorrectas.';
        break;
      case 801:
        response.message = '(r801) Error inesperado.';
        break;
    }
    return response;
  }
  //#endregion
}