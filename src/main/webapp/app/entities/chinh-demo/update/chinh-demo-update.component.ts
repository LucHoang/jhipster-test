import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IChinhDemo, ChinhDemo } from '../chinh-demo.model';
import { ChinhDemoService } from '../service/chinh-demo.service';

@Component({
  selector: 'jhi-chinh-demo-update',
  templateUrl: './chinh-demo-update.component.html',
})
export class ChinhDemoUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required]],
  });

  constructor(protected chinhDemoService: ChinhDemoService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ chinhDemo }) => {
      this.updateForm(chinhDemo);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const chinhDemo = this.createFromForm();
    if (chinhDemo.id !== undefined) {
      this.subscribeToSaveResponse(this.chinhDemoService.update(chinhDemo));
    } else {
      this.subscribeToSaveResponse(this.chinhDemoService.create(chinhDemo));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IChinhDemo>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(chinhDemo: IChinhDemo): void {
    this.editForm.patchValue({
      id: chinhDemo.id,
      name: chinhDemo.name,
    });
  }

  protected createFromForm(): IChinhDemo {
    return {
      ...new ChinhDemo(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
    };
  }
}
