jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { ChinhDemoService } from '../service/chinh-demo.service';
import { IChinhDemo, ChinhDemo } from '../chinh-demo.model';

import { ChinhDemoUpdateComponent } from './chinh-demo-update.component';

describe('Component Tests', () => {
  describe('ChinhDemo Management Update Component', () => {
    let comp: ChinhDemoUpdateComponent;
    let fixture: ComponentFixture<ChinhDemoUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let chinhDemoService: ChinhDemoService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ChinhDemoUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(ChinhDemoUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ChinhDemoUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      chinhDemoService = TestBed.inject(ChinhDemoService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const chinhDemo: IChinhDemo = { id: 456 };

        activatedRoute.data = of({ chinhDemo });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(chinhDemo));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const chinhDemo = { id: 123 };
        spyOn(chinhDemoService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ chinhDemo });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: chinhDemo }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(chinhDemoService.update).toHaveBeenCalledWith(chinhDemo);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const chinhDemo = new ChinhDemo();
        spyOn(chinhDemoService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ chinhDemo });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: chinhDemo }));
        saveSubject.complete();

        // THEN
        expect(chinhDemoService.create).toHaveBeenCalledWith(chinhDemo);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const chinhDemo = { id: 123 };
        spyOn(chinhDemoService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ chinhDemo });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(chinhDemoService.update).toHaveBeenCalledWith(chinhDemo);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
