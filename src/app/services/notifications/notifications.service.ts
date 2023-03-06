import { Injectable } from '@angular/core';
import axios from "axios";
import {environment} from "../../../environments/environment";
import {AuthService} from "../auth/auth.service";
import {ToastrService} from "ngx-toastr";

export interface NotificationData {
  title: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  apiUrl: string = environment.apiUrl;

  constructor(private _servAuth: AuthService, private toastr: ToastrService) { }

  async sendNotification(data: NotificationData) {
    try {
      await axios.post(this.apiUrl + 'send-notification', {...data, token: this._servAuth.getToken()});
      this.toastr.success('Notification envoyé avec succès !');
      return true;
    } catch (error: any) {
      console.log(error)
      if ([401, 403].includes(error.response.status)) {
        this.toastr.error("Vous n'êtes pas autorisé à envoyer une notification !");
        return false;
      }


      const errorMessage = `Ok ya un bug, ptetre que mon serveur est down, envoie moi un MP sur discord (Hikudo#1714)`;
      this.toastr.error(errorMessage, "Erreur");
      return false;
    }
  }
}
