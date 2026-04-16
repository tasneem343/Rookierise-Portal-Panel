import { ChangeDetectorRef, Component, effect } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../Services/AccountService/AccountService';
import { Languageservice } from '../../Services/LanguageService/Languageservice';

@Component({
  selector: 'app-Login',
  imports: [ ReactiveFormsModule, CommonModule,RouterLink],
  templateUrl: './Login.html',
  styleUrl: './Login.css',
})
export class Login {
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

  this.authService.signIn(data).subscribe({
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