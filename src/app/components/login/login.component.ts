import { Component } from '@angular/core';
import {AuthService} from "../../services/auth/auth.service";

interface LoginModel {
  username: string;
  password: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  data: LoginModel = {
    username: '',
    password: ''
  };

  constructor(private _servAuth: AuthService) {}

  async login() {
    await this._servAuth.login(this.data.username, this.data.password);
  }
}
