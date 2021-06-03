import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IChinhDemo, ChinhDemo } from '../chinh-demo.model';

import { ChinhDemoService } from './chinh-demo.service';

describe('Service Tests', () => {
  describe('ChinhDemo Service', () => {
    let service: ChinhDemoService;
    let httpMock: HttpTestingController;
    let elemDefault: IChinhDemo;
    let expectedResult: IChinhDemo | IChinhDemo[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(ChinhDemoService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        name: 'AAAAAAA',
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign({}, elemDefault);

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a ChinhDemo', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new ChinhDemo()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a ChinhDemo', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            name: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a ChinhDemo', () => {
        const patchObject = Object.assign({}, new ChinhDemo());

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of ChinhDemo', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            name: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a ChinhDemo', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addChinhDemoToCollectionIfMissing', () => {
        it('should add a ChinhDemo to an empty array', () => {
          const chinhDemo: IChinhDemo = { id: 123 };
          expectedResult = service.addChinhDemoToCollectionIfMissing([], chinhDemo);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(chinhDemo);
        });

        it('should not add a ChinhDemo to an array that contains it', () => {
          const chinhDemo: IChinhDemo = { id: 123 };
          const chinhDemoCollection: IChinhDemo[] = [
            {
              ...chinhDemo,
            },
            { id: 456 },
          ];
          expectedResult = service.addChinhDemoToCollectionIfMissing(chinhDemoCollection, chinhDemo);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a ChinhDemo to an array that doesn't contain it", () => {
          const chinhDemo: IChinhDemo = { id: 123 };
          const chinhDemoCollection: IChinhDemo[] = [{ id: 456 }];
          expectedResult = service.addChinhDemoToCollectionIfMissing(chinhDemoCollection, chinhDemo);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(chinhDemo);
        });

        it('should add only unique ChinhDemo to an array', () => {
          const chinhDemoArray: IChinhDemo[] = [{ id: 123 }, { id: 456 }, { id: 17673 }];
          const chinhDemoCollection: IChinhDemo[] = [{ id: 123 }];
          expectedResult = service.addChinhDemoToCollectionIfMissing(chinhDemoCollection, ...chinhDemoArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const chinhDemo: IChinhDemo = { id: 123 };
          const chinhDemo2: IChinhDemo = { id: 456 };
          expectedResult = service.addChinhDemoToCollectionIfMissing([], chinhDemo, chinhDemo2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(chinhDemo);
          expect(expectedResult).toContain(chinhDemo2);
        });

        it('should accept null and undefined values', () => {
          const chinhDemo: IChinhDemo = { id: 123 };
          expectedResult = service.addChinhDemoToCollectionIfMissing([], null, chinhDemo, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(chinhDemo);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
