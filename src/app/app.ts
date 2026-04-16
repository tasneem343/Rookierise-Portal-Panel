import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './Components/Header/header';
import { LoginPage } from './Pages/login-page/login-page';
import { SignupPage } from './Pages/signup-page/signup-page';
import { Setpasswordpage } from './Pages/setpasswordpage/setpasswordpage';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header,LoginPage,SignupPage,Setpasswordpage],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('login-page');
}
