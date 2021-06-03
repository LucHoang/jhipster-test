import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IChinhDemo, ChinhDemo } from '../chinh-demo.model';
import { ChinhDemoService } from '../service/chinh-demo.service';

@Injectable({ providedIn: 'root' })
export class ChinhDemoRoutingResolveService implements Resolve<IChinhDemo> {
  constructor(protected service: ChinhDemoService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IChinhDemo> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((chinhDemo: HttpResponse<ChinhDemo>) => {
          if (chinhDemo.body) {
            return of(chinhDemo.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new ChinhDemo());
  }
}
