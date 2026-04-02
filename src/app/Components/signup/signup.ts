import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-signup',
  imports: [CommonModule, ReactiveFormsModule, FormsModule,RouterLink],
  templateUrl: './signup.html',
  styleUrls: ['./signup.css'],
})
export class Signup {
  // Custom Validators - defined as static methods
  private static arabicOnlyValidator(control: AbstractControl): ValidationErrors | null {
    const arabicRegex = /^[\u0600-\u06FF\s]+$/;
    return control.value && !arabicRegex.test(control.value) ? { arabicOnly: true } : null;
  }

  private static englishOnlyValidator(control: AbstractControl): ValidationErrors | null {
    const englishRegex = /^[a-zA-Z\s]+$/;
    return control.value && !englishRegex.test(control.value) ? { englishOnly: true } : null;
  }

  private static phoneValidator(control: AbstractControl): ValidationErrors | null {
    const phoneRegex = /^[0-9+\s\-()]+$/;
    return control.value && !phoneRegex.test(control.value) ? { invalidPhone: true } : null;
  }

  private static urlValidator(control: AbstractControl): ValidationErrors | null {
    try {
      const url = new URL(control.value);
      return url.protocol === 'http:' || url.protocol === 'https:' ? null : { invalidUrl: true };
    } catch {
      return control.value ? { invalidUrl: true } : null;
    }
  }

  // Form and UI Properties
  companyForm: FormGroup;
  logoPreview: string | null = null;
  logoError: string | null = null;
  logoFileName: string = '';


  // Constants
  private readonly ALLOWED_LOGO_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif'];

  constructor(private fb: FormBuilder,private cdr: ChangeDetectorRef) {
    this.companyForm = this.fb.group({
      companyNameEn: ['', [Validators.required, Signup.englishOnlyValidator]],
      companyNameAr: ['', [Validators.required, Signup.arabicOnlyValidator]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Signup.phoneValidator],
      websiteUrl: ['', [Validators.required, Signup.urlValidator]],
      logo: [null]
      
    });
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) this.validateAndReadFile(file);
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    const file = event.dataTransfer?.files[0];
    if (file) this.validateAndReadFile(file);
  }

  validateAndReadFile(file: File) {
    const extension = file.name.split('.').pop()?.toLowerCase();
  
    if (!extension || !this.ALLOWED_LOGO_EXTENSIONS.includes(extension)) {
      this.logoError = `Invalid file type. Allowed: ${this.ALLOWED_LOGO_EXTENSIONS.map(e => '.' + e).join(', ')}`;
      this.logoPreview = null;
      this.logoFileName = '';
      this.companyForm.patchValue({ logo: null });
      return;
    }
  
    this.logoError = null;
    this.logoFileName = file.name; 
    const reader = new FileReader();
    reader.onload = () => {
      this.logoPreview = reader.result as string;
      this.companyForm.patchValue({ logo: file });
      this.cdr.detectChanges();
    };
    reader.readAsDataURL(file);
  }
  removeLogo(event: Event) {
    event.stopPropagation();
    this.logoPreview = null;
    this.logoError = null;
    this.companyForm.patchValue({ logo: null });
    this.logoFileName = '';

  }

  /** Opens the uploaded logo preview in a new browser tab. */
  openLogoPreview(event: Event) {
    event.stopPropagation();
    if (!this.logoPreview) return;
    const win = window.open('', '_blank', 'noopener,noreferrer');
    if (!win) return;
    win.document.write(
      '<!DOCTYPE html><html><head><meta charset="utf-8"><title>Logo preview</title>' +
        '<style>body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#1a1a1a}' +
        'img{max-width:100%;max-height:100vh;object-fit:contain}</style></head><body></body></html>'
    );
    win.document.close();
    const img = win.document.createElement('img');
    img.src = this.logoPreview;
    img.alt = 'Logo preview';
    win.document.body.appendChild(img);
  }

  onSubmit() {
    if (this.companyForm.valid) {
      console.log(this.companyForm.value);
    } else {
      this.companyForm.markAllAsTouched();
    }
  }
}