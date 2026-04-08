import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, effect } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../Core/Services/authservice';
import { ToastrService } from 'ngx-toastr';
import { Languageservice } from '../../Core/Services/languageservice';

@Component({
  selector: 'app-signup',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink],
  templateUrl: './signup.html',
  styleUrls: ['./signup.css'],
})
export class Signup {

  // ================= Validators =================
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

  // ================= Properties =================
  companyForm: FormGroup;

  logoPreview: string | null = null; // Base64 (للـ API)
  selectedFile: File | null = null; // File (للـ preview)

  logoError: string | null = null;
  logoFileName: string = '';

  showSuccess = false;
  showError = false;
  errorMessage = '';
    isArabic = false;


  private readonly ALLOWED_LOGO_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif'];

  // ================= Constructor =================
  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router,
        private langService: Languageservice

  ) {
    effect(() => {
      this.isArabic = this.langService.isArabic();
      this.cdr.detectChanges();
    });
    this.companyForm = this.fb.group({
      companyNameEn: ['', [Validators.required, Signup.englishOnlyValidator]],
      companyNameAr: ['', [Validators.required, Signup.arabicOnlyValidator]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Signup.phoneValidator],
      websiteUrl: ['', [Validators.required, Signup.urlValidator]],
      logo: [null]
    });
  }

  // ================= File Upload =================
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
      this.selectedFile = null;
      this.logoFileName = '';
      this.companyForm.patchValue({ logo: null });
      return;
    }

    this.logoError = null;
    this.logoFileName = file.name;
    this.selectedFile = file; 
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
    this.selectedFile = null;
    this.logoError = null;
    this.companyForm.patchValue({ logo: null });
    this.logoFileName = '';
  }

  // ================= Preview =================
  openLogoPreview(event: Event) {
    event.stopPropagation();
    if (!this.selectedFile) return;

    const url = URL.createObjectURL(this.selectedFile);
     window.open(
    url, 
    '_blank',
    'width=700,height=600,top=100,left=50,scrollbars=yes,resizable=yes'
  );
  }

  // ================= Submit =================
  onSubmit() {
    if (this.companyForm.valid) {

      const formData = {
        companyNameEnglish: this.companyForm.value.companyNameEn,
        companyNameArabic: this.companyForm.value.companyNameAr,
        email: this.companyForm.value.email,
        phoneNumber: this.companyForm.value.phone,
        websiteUrl: this.companyForm.value.websiteUrl,
        companyLogo: this.logoPreview
      };

      this.authService.signup(formData).subscribe({
        next: () => {
          this.showSuccess = true;
          this.cdr.detectChanges();

          setTimeout(() => {
            this.showSuccess = false;
            this.router.navigate(['/login']);
          }, 2000);
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Unknown Error';
          this.showError = true;
           this.cdr.detectChanges();
          setTimeout(() => this.showError = false, 2000);
        }
      });

    } else {
      this.companyForm.markAllAsTouched();
    }
  }
}