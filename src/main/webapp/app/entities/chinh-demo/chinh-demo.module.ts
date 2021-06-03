import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { ChinhDemoComponent } from './list/chinh-demo.component';
import { ChinhDemoDetailComponent } from './detail/chinh-demo-detail.component';
import { ChinhDemoUpdateComponent } from './update/chinh-demo-update.component';
import { ChinhDemoDeleteDialogComponent } from './delete/chinh-demo-delete-dialog.component';
import { ChinhDemoRoutingModule } from './route/chinh-demo-routing.module';

@NgModule({
  imports: [SharedModule, ChinhDemoRoutingModule],
  declarations: [ChinhDemoComponent, ChinhDemoDetailComponent, ChinhDemoUpdateComponent, ChinhDemoDeleteDialogComponent],
  entryComponents: [ChinhDemoDeleteDialogComponent],
})
export class ChinhDemoModule {}
