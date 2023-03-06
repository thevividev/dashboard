import { Injectable } from '@angular/core';
import {JwtHelperService} from "@auth0/angular-jwt";
import {Router} from "@angular/router";
import { environment } from '../../../environments/environment';
import axios from "axios";
import {ToastrService} from "ngx-toastr";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  token: string = "";

  constructor(private jwtHelper: JwtHelperService,
              private router: Router,
              private toastr: ToastrService) { }

  isAuthenticated(): boolean {
    this._updateToken();

    return !this.jwtHelper.isTokenExpired(this.token);
  }

  async login(username: string, password: string) {
    try {
      let response = await axios.post(`${environment.apiUrl}/auth/login`, {username, password});

      if (response.status === 401) {
        this.toastr.error('Identifiants incorrects !');
        return;
      }

      this.token = response.data.token;
      localStorage.setItem('token', this.token);

      await this.router.navigateByUrl('/');

    } catch (e: any) {
      if (e.response.status === 401) {
        this.toastr.error('Identifiants incorrects !');
        return;
      }

      this.toastr.error('Une erreur est survenue !');
    }
  }

  getToken(): string {
    this._updateToken();
    return this.token;
  }

  logout() {
    localStorage.removeItem('token');
    this.toastr.success('Vous avez été déconnecté(e) !');
    this.router.navigateByUrl('/login');
  }

  private _updateToken() {
    this.token = localStorage.getItem('token') || "";
  }

  async register(username: string, password: string) {
    try {
      let response = await axios.post(environment.apiUrl + "auth/register", {username, password});

      this.token = response.data.token;
      localStorage.setItem('token', this.token);

      await this.router.navigateByUrl('/');
    } catch (e: any) {
      if (e.response.data.error) {
        this.toastr.error(e.response.data.error);
        return;
      }

      this.toastr.error('Une erreur est survenue ! Contact moi Hikudo#1714');
    }
  }

  getUsername() {
    let decoded = this.jwtHelper.decodeToken(this.getToken());
    return decoded.username;
  }
}
