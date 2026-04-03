import { Component } from '@angular/core';
import { Footer } from '../footer/footer';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../Core/Services/authservice';

@Component({
  selector: 'app-body',
  imports: [Footer, ReactiveFormsModule, CommonModule],
  templateUrl: './body.html',
  styleUrl: './body.css',
})
export class Body {
  showPassword = false;
  showError = false;
  errorMessage = '';
  showSuccess = false;
  loginForm = new FormGroup({
    userType: new FormControl('company'),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    remember: new FormControl(true)
  });

  constructor(private authService: AuthService, private router: Router) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const data = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    };

    this.authService.login(data).subscribe({
      next: (res) => {
       if (this.loginForm.value.remember) {
    localStorage.setItem('token', res.token);
  } else {
    sessionStorage.setItem('token', res.token);
  }
  this.showSuccess = true;
  setTimeout(() => this.showSuccess = false, 3000);
      },
      error: (err) => {
        this.errorMessage =  'Invalid email or password';
        this.showError = true;
        setTimeout(() => this.showError = false, 3000);
      }
    });
  }
}