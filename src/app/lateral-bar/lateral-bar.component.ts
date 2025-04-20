import { Component, Output, EventEmitter, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { Auth, onAuthStateChanged, User} from '@angular/fire/auth';

@Component({
  selector: 'app-lateral-bar',
  templateUrl: './lateral-bar.component.html',
  styleUrls: ['./lateral-bar.component.css']
})
export class LateralBarComponent implements OnInit {
  @Output() filterClick = new EventEmitter<void>();
  @Output() userClick = new EventEmitter<void>();
  user: User | null = null;

  constructor(private router: Router, private auth: Auth) {}

  ngOnInit(): void {
    onAuthStateChanged(this.auth, (user) =>{
      this.user = user;
    });
  }

  onFilterClick() {
    this.filterClick.emit();
  }

  onUserClick() {
    this.userClick.emit();
    console.log('User:', this.user); //
    if (this.user) {
      this.router.navigate(['/perfil']);
    } else {
      this.router.navigate(['/login']);
    }
  }

}
