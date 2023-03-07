import { Component } from '@angular/core';
import axios from 'axios';
import { ToastrService } from 'ngx-toastr';
import {AuthService} from "../../services/auth/auth.service";
import {environment} from "../../../environments/environment";
import {NotificationData, NotificationsService} from "../../services/notifications/notifications.service";

interface Options {
  persistentData: boolean;
}

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
})
export class HomepageComponent {
  showValidation = false;
  initValidation = false;
  apiUrl: string = environment.apiUrl;

  formData: NotificationData = {
    title: '',
    message: ''
  };
  confirmationFormData: NotificationData = {
    title: '',
    message: ''
  };

  options: Options = {
    persistentData: false
  };

  constructor(private toastr: ToastrService,
              private _servNotifications: NotificationsService,
              private _servAuth: AuthService
              ) {}

  ngOnInit(): void {
    this._servAuth.refreshToken();
  }

  activateValidation(): void {
    if (!this.formData.message || !this.formData.title) {
      this.toastr.warning('Il faut remplir tous les champs !');
      return;
    }

    this.initValidation = true;
    this.showValidation = true;
    this.confirmationFormData = { ...this.formData };
  }

  deactivateValidation(): void {
    this.showValidation = false;
    this.resetFields();
  }

  resetFields(): void {
    if (this.options.persistentData) {
      return;
    }

    this.formData = { title: '', message: '' };
    this.initValidation = false;
  }

  async sendNotification() {
    await this._servNotifications.sendNotification(this.formData);
    this.deactivateValidation();

  }

  setOption(key: keyof Options, value: boolean): void {
    this.options[key] = value;
  }
}
