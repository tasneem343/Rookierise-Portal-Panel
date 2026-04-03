import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../Core/Services/authservice';

const PASSWORD_ALLOWED_PATTERN = /^[\x21-\x7E]*$/;

function passwordUppercaseValidator(control: AbstractControl): ValidationErrors | null {
  const v = control.value;
  if (v == null || v === '') return null;
  return /[A-Z]/.test(v) ? null : { passwordUppercase: true };
}

function passwordAllowedCharsValidator(control: AbstractControl): ValidationErrors | null {
  const v = control.value;
  if (v == null || v === '') return null;
  return PASSWORD_ALLOWED_PATTERN.test(v) ? null : { passwordAllowedChars: true };
}

@Component({
  selector: 'app-setpassword',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './setpassword.html',
  styleUrl: './setpassword.css',
})
export class Setpassword implements OnInit {
  showPassword = false;
  showConfirmPassword = false;
  showSuccess = false;
  showError = false;
  errorMessage = '';

  passwordForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      passwordUppercaseValidator,
      passwordAllowedCharsValidator,
    ]),
    confirmPassword: new FormControl('', [Validators.required]),
  }, { validators: this.passwordMatchValidator });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const email = this.route.snapshot.queryParamMap.get('email');
    if (email) {
      this.passwordForm.patchValue({ email });
    }
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  togglePassword() { this.showPassword = !this.showPassword; }
  toggleConfirmPassword() { this.showConfirmPassword = !this.showConfirmPassword; }

  onSubmit() {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    const data = {
      email: this.passwordForm.value.email,
      password: this.passwordForm.value.password
    };

    this.authService.setPassword(data).subscribe({
      next: () => {
        this.showSuccess = true;
        this.cdr.detectChanges();
        setTimeout(() => {
          this.showSuccess = false;
          this.router.navigate(['/login']);
        }, 4000);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Invalid or expired OTP.';
        this.showError = true;
        setTimeout(() => this.showError = false, 4000);
      }
    });
  }

  onCancel() { this.passwordForm.reset(); }

  get passwordErrorsInlineText(): string {
    const c = this.passwordForm.get('password');
    if (!c || (!c.dirty && !c.touched) || c.valid) return '';
    const parts: string[] = [];
    if (c.hasError('required')) parts.push('Password is required.');
    if (c.hasError('minlength') && c.value?.length) parts.push('Password must be at least 8 characters.');
    if (c.hasError('passwordUppercase')) parts.push('Password must include at least one uppercase letter.');
    if (c.hasError('passwordAllowedChars')) parts.push('Password can only contain English letters, numbers, and symbols.');
    return parts.join(' ');
  }
}