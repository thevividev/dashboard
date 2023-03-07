import {Injectable} from '@angular/core';
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

  constructor(private _servAuth: AuthService, private toastr: ToastrService) {
  }

  async sendNotification(notificationData: NotificationData): Promise<boolean> {
    try {
      await axios.post(
        this.apiUrl + '/send-notification',
        {...notificationData, token: this._servAuth.getToken()},
        // use named parameters for readability
        {
          headers: {
            // set any additional headers here
          }
        }
      );
      this.toastr.success('Notification envoyé avec succès !');
      return true;
    } catch (error: any) {
      console.error(error);
      if ([401, 403].includes(error.response?.status)) {
        this.toastr.error("Vous n'êtes pas autorisé à envoyer une notification !");
        return false;
      }

      // use more specific error messages instead of a generic one with a personal contact method
      const errorMessage = `Une erreur s'est produite lors de l'envoi de la notification : ${error.message}`;
      this.toastr.error(errorMessage, "Erreur");
      return false;
    }
  }
}
