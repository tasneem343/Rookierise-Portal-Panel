import { ChangeDetectorRef, Component, effect } from '@angular/core';
import { Footer } from '../footer/footer';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../Core/Services/authservice';
import { Languageservice } from '../../Core/Services/languageservice';

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
    isArabic = false;
  isLoading = false;
  loginForm = new FormGroup({
    userType: new FormControl('company'),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    remember: new FormControl(true)
  });

  constructor(private authService: AuthService, private router: Router,  private cdr: ChangeDetectorRef,private langService: Languageservice
) {effect(() => {
      this.isArabic = this.langService.isArabic();
      this.cdr.detectChanges();
    });

}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
onSubmit() {
  if (this.loginForm.invalid) {
    this.loginForm.markAllAsTouched();
    return;
  }
  this.isLoading = true;
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
this.isLoading = false; 
this.cdr.detectChanges();
setTimeout(() => this.showSuccess = false, 3000);
    },
    error: (err) => {
    this.errorMessage = err.error?.message || 'Login failed.';
        this.showError = true;

     this.cdr.detectChanges();
       setTimeout(() => {
    this.isLoading = false;
    this.cdr.detectChanges();
  }, 100);
    setTimeout(() => this.showError = false, 3000);
    }
  });
}
}