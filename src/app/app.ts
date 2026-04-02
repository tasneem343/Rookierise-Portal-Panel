import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './Components/header/header';
import { Footer } from './Components/footer/footer';
import { LoginPage } from './pages/login-page/login-page';
import { SignupPage } from './pages/signup-page/signup-page';
import { Setpasswordpage } from './pages/setpasswordpage/setpasswordpage';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer,LoginPage,SignupPage,Setpasswordpage],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('login-page');
}
