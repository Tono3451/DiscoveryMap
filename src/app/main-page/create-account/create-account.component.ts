import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { UserService } from '../../services/users.service';
import {Router, RouterLink} from '@angular/router'; // Ajusta la ruta según tu estructura

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrl: './create-account.component.css',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf,
    RouterLink],
})
export class CreateAccountComponent implements OnInit {
  accountForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: Auth,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.accountForm = this.fb.group({
      username: ['', Validators.required],
      lastName: ['', Validators.required],
      birthdate: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  async onSubmit(): Promise<void> {
    if (this.accountForm.invalid) {
      this.accountForm.markAllAsTouched();
      return;
    }

    const { username, lastName, birthdate, email, password } = this.accountForm.value;

    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;

      // Guardar en Firestore usando el uid del usuario creado
      await this.userService.saveUser(user.uid, {
        username,
        lastName,
        birthdate,
        email
      });

      console.log('✅ Cuenta creada y datos guardados');
      this.router.navigate(['/login']);
    } catch (error: any) {
      console.error('❌ Error al crear cuenta:', error.message);
    }
  }
}
