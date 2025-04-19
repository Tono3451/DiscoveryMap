import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrl: './create-account.component.css',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
})
export class CreateAccountComponent implements OnInit {
  accountForm!: FormGroup;

  constructor(private fb: FormBuilder, private auth: Auth) {}

  ngOnInit(): void {
    this.accountForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  async onSubmit(): Promise<void> {
    if (this.accountForm.invalid) {
      this.accountForm.markAllAsTouched();
      return;
    }

    const { email, password, name } = this.accountForm.value;

    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;
      console.log('✅ Usuario creado:', user);
    } catch (error: any) {
      console.error('❌ Error al crear usuario:', error.message);
    }
  }
}
