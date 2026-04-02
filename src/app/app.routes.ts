import { Routes } from '@angular/router';
import { Signup } from './Components/signup/signup';
import { Body } from './Components/body/body';
import { LoginPage } from './pages/login-page/login-page';
import { SignupPage } from './pages/signup-page/signup-page';
import { Setpasswordpage } from './pages/setpasswordpage/setpasswordpage';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginPage },
    { path: 'signup', component: SignupPage },
    { path: 'setpassword', component: Setpasswordpage },
];
