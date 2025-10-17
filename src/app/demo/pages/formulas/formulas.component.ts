import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormulasService } from './service/formulas.service';
import { FormulaMedica } from './models/formula';

@Component({
  selector: 'app-formulas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './formulas.component.html',
  styleUrl: './formulas.component.scss'
})
export class FormulasComponent {
  formulas: FormulaMedica[] = [];
  constructor(private svc: FormulasService) {
    this.svc.list().subscribe(d => this.formulas = d);
  }
}


