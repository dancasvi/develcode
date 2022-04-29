import { Component, Input, OnInit } from "@angular/core";

@Component({
    selector: 'app-alert',
    templateUrl: 'alert.component.html',
    styleUrls: ['alert.component.scss']
})
export class AlertComponent implements OnInit {

    @Input() msg:  string = '';
    @Input() msgTipo: number = 0;

    msgTipoString: string = '';

    ngOnInit(): void {
        switch(this.msgTipo) {
            case 1:
                this.msgTipoString = "Sucesso!";
                break;
            case 2:
                this.msgTipoString = "Erro!";
                break;
            case 3:
                this.msgTipoString = "Aviso!";
                break;
        }
    }
}

/*
ENUM
1 - SUCCESS
2 - ERROR
3 - WARNING
*/