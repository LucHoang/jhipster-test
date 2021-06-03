import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IChinhDemo, getChinhDemoIdentifier } from '../chinh-demo.model';

export type EntityResponseType = HttpResponse<IChinhDemo>;
export type EntityArrayResponseType = HttpResponse<IChinhDemo[]>;

@Injectable({ providedIn: 'root' })
export class ChinhDemoService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/chinh-demos');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(chinhDemo: IChinhDemo): Observable<EntityResponseType> {
    return this.http.post<IChinhDemo>(this.resourceUrl, chinhDemo, { observe: 'response' });
  }

  update(chinhDemo: IChinhDemo): Observable<EntityResponseType> {
    return this.http.put<IChinhDemo>(`${this.resourceUrl}/${getChinhDemoIdentifier(chinhDemo) as number}`, chinhDemo, {
      observe: 'response',
    });
  }

  partialUpdate(chinhDemo: IChinhDemo): Observable<EntityResponseType> {
    return this.http.patch<IChinhDemo>(`${this.resourceUrl}/${getChinhDemoIdentifier(chinhDemo) as number}`, chinhDemo, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IChinhDemo>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IChinhDemo[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addChinhDemoToCollectionIfMissing(
    chinhDemoCollection: IChinhDemo[],
    ...chinhDemosToCheck: (IChinhDemo | null | undefined)[]
  ): IChinhDemo[] {
    const chinhDemos: IChinhDemo[] = chinhDemosToCheck.filter(isPresent);
    if (chinhDemos.length > 0) {
      const chinhDemoCollectionIdentifiers = chinhDemoCollection.map(chinhDemoItem => getChinhDemoIdentifier(chinhDemoItem)!);
      const chinhDemosToAdd = chinhDemos.filter(chinhDemoItem => {
        const chinhDemoIdentifier = getChinhDemoIdentifier(chinhDemoItem);
        if (chinhDemoIdentifier == null || chinhDemoCollectionIdentifiers.includes(chinhDemoIdentifier)) {
          return false;
        }
        chinhDemoCollectionIdentifiers.push(chinhDemoIdentifier);
        return true;
      });
      return [...chinhDemosToAdd, ...chinhDemoCollection];
    }
    return chinhDemoCollection;
  }
}
