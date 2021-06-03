import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ChinhDemoComponent } from '../list/chinh-demo.component';
import { ChinhDemoDetailComponent } from '../detail/chinh-demo-detail.component';
import { ChinhDemoUpdateComponent } from '../update/chinh-demo-update.component';
import { ChinhDemoRoutingResolveService } from './chinh-demo-routing-resolve.service';

const chinhDemoRoute: Routes = [
  {
    path: '',
    component: ChinhDemoComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ChinhDemoDetailComponent,
    resolve: {
      chinhDemo: ChinhDemoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ChinhDemoUpdateComponent,
    resolve: {
      chinhDemo: ChinhDemoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ChinhDemoUpdateComponent,
    resolve: {
      chinhDemo: ChinhDemoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(chinhDemoRoute)],
  exports: [RouterModule],
})
export class ChinhDemoRoutingModule {}
