jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IChinhDemo, ChinhDemo } from '../chinh-demo.model';
import { ChinhDemoService } from '../service/chinh-demo.service';

import { ChinhDemoRoutingResolveService } from './chinh-demo-routing-resolve.service';

describe('Service Tests', () => {
  describe('ChinhDemo routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: ChinhDemoRoutingResolveService;
    let service: ChinhDemoService;
    let resultChinhDemo: IChinhDemo | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(ChinhDemoRoutingResolveService);
      service = TestBed.inject(ChinhDemoService);
      resultChinhDemo = undefined;
    });

    describe('resolve', () => {
      it('should return IChinhDemo returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultChinhDemo = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultChinhDemo).toEqual({ id: 123 });
      });

      it('should return new IChinhDemo if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultChinhDemo = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultChinhDemo).toEqual(new ChinhDemo());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultChinhDemo = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultChinhDemo).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
