//#region Angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
//#endregion

//#region Others
import { environment } from 'src/environments/environment';
//#endregion

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  //#region Variables
  private url_api = environment.api_url + 'chat/';
  //#endregion

  //#region Start
  constructor(private http: HttpClient) { }
  //#endregion

  //#region Methods
  Create(chat: any, message: any, file: File) {
    const fd = new FormData();
    fd.append('subject', chat.subject);
    fd.append('fromPage', chat.fromPage);
    fd.append('to', message.to);
    fd.append('body', message.body);
    if (file) fd.append('file', file);

    return this.http.post(this.url_api, fd);
  }

  CreateMessage(message: any, file: File) {
    const fd = new FormData();
    fd.append('chatID', message.chatID);
    fd.append('from', message.from);
    fd.append('body', message.body);
    fd.append('to', message.to);
    fd.append('fromPage', message.fromPage);
    if (file) fd.append('file', file);
    return this.http.post(this.url_api + 'message', fd);
  }

  Update(params: any) {
    return this.http.put(this.url_api, params);
  }

  UpdateMessage(params: any) {
    return this.http.put(this.url_api + 'view', params);
  }

  Get(params: any) {
    return this.http.get(this.url_api, { params: params });
  }

  GetNewMessages(params: any) {
    return this.http.get(this.url_api+'new-messages', { params: params });
  }

  GetData(params: any) {
    return this.http.get(this.url_api + 'data', { params: params });
  }

  GetMessage(params: any) {
    return this.http.get(this.url_api + 'message', { params: params });
  }
  //#endregion
}
