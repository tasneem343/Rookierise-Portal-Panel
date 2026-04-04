import { ChangeDetectorRef, Component, effect, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../Core/Services/authservice';
import { Languageservice } from '../../Core/Services/languageservice';

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
function passwordLowercaseValidator(control: AbstractControl): ValidationErrors | null {
  const v = control.value;
  if (v == null || v === '') return null;
  return /[a-z]/.test(v) ? null : { passwordLowercase: true };
}

function passwordDigitValidator(control: AbstractControl): ValidationErrors | null {
  const v = control.value;
  if (v == null || v === '') return null;
  return /[0-9]/.test(v) ? null : { passwordDigit: true };
}

function passwordSpecialCharValidator(control: AbstractControl): ValidationErrors | null {
  const v = control.value;
  if (v == null || v === '') return null;
  return /[\x21-\x2F\x3A-\x40\x5B-\x60\x7B-\x7E]/.test(v) ? null : { passwordSpecialChar: true };
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
  isArabic = false;


  passwordForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
  Validators.minLength(8),
  Validators.maxLength(16),
  passwordUppercaseValidator,
  passwordLowercaseValidator,
  passwordDigitValidator,
  passwordSpecialCharValidator,
  passwordAllowedCharsValidator,
    ]),
    confirmPassword: new FormControl('', [Validators.required]),
  }, { validators: this.passwordMatchValidator });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
      private langService: Languageservice

  ) {
    effect(() => {
    this.isArabic = this.langService.isArabic();
    this.cdr.detectChanges();
  });
  }

  ngOnInit() {
      const email = this.route.snapshot.queryParamMap.get('email');
  if (email) this.passwordForm.patchValue({ email });
  
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
        }, 3000);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Invalid or expired OTP.';
        this.showError = true;
        setTimeout(() => this.showError = false, 2000);
      }
    });
  }

  onCancel() { this.passwordForm.reset(); }

get passwordErrorsInlineText(): string {
  const c = this.passwordForm.get('password');
  if (!c || (!c.dirty && !c.touched) || c.valid) return '';
  
  if (c.hasError('required')) return this.isArabic ? 'كلمة المرور مطلوبة.' : 'Password is required.';
  
  if (c.hasError('minlength') || c.hasError('maxlength') || 
      c.hasError('passwordUppercase') || c.hasError('passwordLowercase') || 
      c.hasError('passwordDigit') || c.hasError('passwordSpecialChar') || 
      c.hasError('passwordAllowedChars')) {
    return this.isArabic ?'كلمة المرور يجب أن تكون ٨ أحرف على الأقل. يجب أن تحتوي كلمة المرور على حرف كبير واحد على الأقل. كلمة المرور يجب أن تحتوي على أحرف إنجليزية فقط، أرقام ورموز.'
      : 'Password must be at least 8 and no more than 16 characters, contain at least one uppercase letter, one lowercase letter, one digit, one special character, and only English characters.';
  }
  
  return '';
}
}