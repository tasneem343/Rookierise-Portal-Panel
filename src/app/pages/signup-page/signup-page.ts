import { Component } from '@angular/core';
import { Header } from '../../Components/header/header';
import { Signup } from '../../Components/signup/signup';

@Component({
  selector: 'app-signup-page',
  standalone: true,
  imports: [Header,Signup],
  templateUrl: './signup-page.html',
  styleUrl: './signup-page.css',
})
export class SignupPage {}
