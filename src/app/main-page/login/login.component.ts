import { Component, OnInit } from '@angular/core';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import {FormsModule} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  imports: [
    FormsModule,
    RouterLink
  ],
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email = '';
  password = '';

  constructor(private auth: Auth, private router: Router) { }

  login(event: Event) {
    event.preventDefault();

    signInWithEmailAndPassword(this.auth, this.email, this.password)
      .then(userCredential => {
        console.log('Sesión iniciada:', userCredential.user);
        this.router.navigate(['/']);
      })
      .catch(error => {
        console.error('Error al iniciar sesión:', error.message);
        alert('Error: ' + error.message);
      });
  }

  ngOnInit(): void {
    console.log('LoginComponent cargado correctamente');
  }
}
