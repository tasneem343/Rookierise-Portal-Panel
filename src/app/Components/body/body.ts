import { Component } from '@angular/core';
import { Footer } from '../footer/footer';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-body',
  imports: [Footer, ReactiveFormsModule,CommonModule],
  templateUrl: './body.html',
  styleUrl: './body.css',
})
export class Body {
  showPassword = false;

  loginForm = new FormGroup({
    userType: new FormControl('company'),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    remember: new FormControl(true)
  });

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    console.log(this.loginForm.value);
  }
}