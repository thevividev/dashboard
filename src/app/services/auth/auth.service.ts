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
      const { data } = await axios.post(`${environment.apiUrl}/auth/login`, { username, password });
      const { token } = data;

      this.token = token;
      localStorage.setItem('token', token);

      await this.router.navigateByUrl('/');
    } catch (error: any) {
      if (error.response) {
        const { status } = error.response;

        if (status === 401) {
          this.toastr.error('Identifiants incorrects !');
          return;
        }

        this.toastr.error(`Une erreur est survenue (${status}) !`);
      } else {
        this.toastr.error('Mon serveur est down, envoie un mp sur discord !');
      }
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
      const { data } = await axios.post(`${environment.apiUrl}/auth/register`, { username, password });
      const { token } = data;

      this.token = token;
      localStorage.setItem('token', token);

      await this.router.navigateByUrl('/');
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.error) {
        const errorMessage = error.response.data.error;
        this.toastr.error(errorMessage);
      } else {
        this.toastr.error('Une erreur est survenue ! Contact moi Hikudo#1714');
      }
    }
  }

  async refreshToken() {
    try {
      let { data } = await axios.post(`${environment.apiUrl}/auth/refresh-token`, { token: this.getToken() });
      const { token } = data;

      this.token = token;
      localStorage.setItem('token', token);
    } catch (e: any) {
      console.error('Failed to refresh token:', e);
      this.logout();
    }
  }

  getUsername(): string {
    const token = this.getToken();

    if (!token) {
      return "";
    }

    try {
      const decodedToken = this.jwtHelper.decodeToken(token);

      if (decodedToken && decodedToken.username) {
        return decodedToken.username;
      }
    } catch (error) {
      console.error('Failed to decode token:', error);
    }

    return "";
  }
}
