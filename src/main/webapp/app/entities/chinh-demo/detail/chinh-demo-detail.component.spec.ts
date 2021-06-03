import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ChinhDemoDetailComponent } from './chinh-demo-detail.component';

describe('Component Tests', () => {
  describe('ChinhDemo Management Detail Component', () => {
    let comp: ChinhDemoDetailComponent;
    let fixture: ComponentFixture<ChinhDemoDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [ChinhDemoDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ chinhDemo: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(ChinhDemoDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(ChinhDemoDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load chinhDemo on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.chinhDemo).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
