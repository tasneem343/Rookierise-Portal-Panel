import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

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
export class Setpassword {
  showPassword = false;
  showConfirmPassword = false;

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

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit() {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }
    console.log(this.passwordForm.value);
  }

  onCancel() {
    this.passwordForm.reset();
  }

  get passwordErrorsInlineText(): string {
    const c = this.passwordForm.get('password');
    if (!c || (!c.dirty && !c.touched) || c.valid) {
      return '';
    }
    const parts: string[] = [];
    if (c.hasError('required')) {
      parts.push('Password is required.');
    }
    if (c.hasError('minlength') && c.value?.length) {
      parts.push('Password must be at least 8 characters.');
    }
    if (c.hasError('passwordUppercase')) {
      parts.push('Password must include at least one uppercase letter.');
    }
    if (c.hasError('passwordAllowedChars')) {
      parts.push('Password can only contain English letters, numbers, and symbols.');
    }
    return parts.join(' ');
  }
}