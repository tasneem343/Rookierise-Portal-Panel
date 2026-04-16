import { Component } from '@angular/core';
import { Header } from '../../Components/Header/header';
import { Login } from '../../Components/Login/Login';

@Component({
  selector: 'app-login-page',
  imports: [Header,Login],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
})
export class LoginPage {}
