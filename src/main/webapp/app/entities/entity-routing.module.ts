import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'chinh-demo',
        data: { pageTitle: 'demo1App.chinhDemo.home.title' },
        loadChildren: () => import('./chinh-demo/chinh-demo.module').then(m => m.ChinhDemoModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
