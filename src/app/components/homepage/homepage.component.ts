import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

interface Data {
  title?: string;
  message?: string;
}

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
})
export class HomepageComponent {
  showValidation = false;
  initValidation = false;

  data: Data = {};

  confirmationData: Data = {};

  constructor(private toastr: ToastrService) {}

  activateValidation(): void {
    if (!this.data.message || !this.data.title) {
      return;
    }

    this.initValidation = true;
    this.showValidation = true;
    this.confirmationData = { ...this.data };
  }

  deactivateValidation(): void {
    this.showValidation = false;
    this.resetFields();
  }

  resetFields(): void {
    this.data = { title: '', message: '' };
    this.initValidation = false;
  }

  sendNotification() {
    this.toastr.success('Notification envoyé avec succès !');
    this.deactivateValidation();
  }
}
