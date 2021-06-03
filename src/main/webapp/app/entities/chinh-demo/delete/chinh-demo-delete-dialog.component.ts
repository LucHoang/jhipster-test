import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IChinhDemo } from '../chinh-demo.model';
import { ChinhDemoService } from '../service/chinh-demo.service';

@Component({
  templateUrl: './chinh-demo-delete-dialog.component.html',
})
export class ChinhDemoDeleteDialogComponent {
  chinhDemo?: IChinhDemo;

  constructor(protected chinhDemoService: ChinhDemoService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.chinhDemoService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
