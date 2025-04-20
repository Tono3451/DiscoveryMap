import { Component, OnInit } from '@angular/core';
import { Auth, signOut } from '@angular/fire/auth';
import {Router, RouterLink} from '@angular/router';
import {Firestore, doc, getDoc} from '@angular/fire/firestore';
import { onAuthStateChanged } from '@angular/fire/auth';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-perfil',
  standalone: true,
  templateUrl: './perfil.component.html',
  imports: [
    RouterLink,
    NgIf,
    NgForOf
  ],
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  user: any;
  userData: any = null;
  activeTab: 'posted' | 'saved' = 'posted';
  userMemories: any[] = [];
  savedMemories: any[] = [];

  constructor(private auth: Auth, private router: Router, private firestore: Firestore) {}


  ngOnInit(): void {
    onAuthStateChanged(this.auth, async (user) => {
      if (user) {
        this.user = user;

        const userDocRef = doc(this.firestore, 'users', user.uid);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
          this.userData = docSnap.data();
        } else {
          console.warn('No se encontraron datos adicionales para este usuario.');
        }
      }
    });

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
