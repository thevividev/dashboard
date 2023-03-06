import { Component } from '@angular/core';
import {AuthService} from "../../services/auth/auth.service";
import {ToastrService} from "ngx-toastr";

interface RegisterModel {
  username: string;
  password: string;
  confirmPassword: string;
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  data: RegisterModel = {
    username: '',
    password: '',
    confirmPassword: ''
  };

  constructor(private _servAuth: AuthService, private toastr: ToastrService) {
  }

  async register() {
    if (this.data.password !== this.data.confirmPassword) {
      this.toastr.error('Les mots de passe ne correspondent pas !');
      return;
    }

    await this._servAuth.register(this.data.username, this.data.password);
  }
}
