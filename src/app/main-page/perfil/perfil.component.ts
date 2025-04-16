import { Component, OnInit } from '@angular/core';
import { Auth, signOut } from '@angular/fire/auth';
import {Router, RouterLink} from '@angular/router';

@Component({
  selector: 'app-perfil',
  standalone: true,
  templateUrl: './perfil.component.html',
  imports: [
    RouterLink
  ],
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  user: any;  // Esto almacenará la información del usuario

  constructor(private auth: Auth, private router: Router) {}

  ngOnInit(): void {
    this.user = this.auth.currentUser;
  }

  logout() {
    signOut(this.auth)
      .then(() => {
        console.log('Sesión cerrada');
        this.router.navigate(['/']); // Redirige al inicio
      })
      .catch((error) => {
        console.error('Error al cerrar sesión:', error);
      });
  }

}
