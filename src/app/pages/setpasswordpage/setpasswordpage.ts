import { Component } from '@angular/core';
import { Header } from '../../Components/Header/header';
import { Setpassword } from '../../Components/setpassword/setpassword';

@Component({
  selector: 'app-setpasswordpage',
  imports: [Header,Setpassword],
  templateUrl: './setpasswordpage.html',
  styleUrl: './setpasswordpage.css',
})
export class Setpasswordpage {}
