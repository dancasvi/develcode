import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { AlertModule } from "../alert-component/alert.module";
import { CadastroComponent } from "./cadastro.component";

@NgModule({
    declarations: [
        CadastroComponent        
    ],
    imports: [
      CommonModule,
      ReactiveFormsModule,
      AlertModule
    ],
    exports: [
        CadastroComponent
    ],
    providers: [
    ]
})
export class CadastroModule {}