import { Routes } from '@angular/router';
import { Signup } from './Components/signup/signup';
import { LoginPage } from './Pages/login-page/login-page';
import { SignupPage } from './Pages/signup-page/signup-page';
import { Setpasswordpage } from './Pages/setpasswordpage/setpasswordpage';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginPage },
    { path: 'signup', component: SignupPage },
    { path: 'setpassword', component: Setpasswordpage },
];
