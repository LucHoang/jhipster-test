import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IChinhDemo } from '../chinh-demo.model';

@Component({
  selector: 'jhi-chinh-demo-detail',
  templateUrl: './chinh-demo-detail.component.html',
})
export class ChinhDemoDetailComponent implements OnInit {
  chinhDemo: IChinhDemo | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ chinhDemo }) => {
      this.chinhDemo = chinhDemo;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
