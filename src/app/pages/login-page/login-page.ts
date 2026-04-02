import { Component } from '@angular/core';
import { Footer } from '../../Components/footer/footer';
import { Header } from '../../Components/header/header';
import { Body } from '../../Components/body/body';

@Component({
  selector: 'app-login-page',
  imports: [Footer,Header,Body],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
})
export class LoginPage {}
