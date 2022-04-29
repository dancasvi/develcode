import { animate, state, style, transition, trigger } from "@angular/animations";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CadastroDTO, ResponseCadastroDTO, ResponseConsultaDTO } from "../models/model";
import { CadastroService } from "./cadastro.service";

@Component({
    selector: 'app-cadastro',
    templateUrl: 'cadastro.component.html',
    styleUrls: ['cadastro.component.scss'],
    animations: [
        trigger('showMsg', [
            transition(':enter', [
                style({transform: 'translateX(-100%)'}),
                animate('300ms ease-in', style({transform: 'translateX(0%)'}))
              ]),
            transition(':leave', [
                animate('300ms ease-in', style({transform: 'translateX(-100%)'}))
            ])
        ])
    ]
})
export class CadastroComponent implements OnInit {
    formulario!: FormGroup;
    isLoading: boolean = false;

    exibirMsgCodigoObrigatorio: boolean = false;
    exibirMsgNomeObrigatorio: boolean = false;
    exibirMsgDtNascObrigatorio: boolean = false;

    exibirMsg: boolean = false;
    msg: string = 'MENSAGEM';
    msgTipo: number = 0;

    fotoAdicionada!: File;

    listaDeUsuarios: CadastroDTO[] = [];

    isCodigoReadonly: boolean = false;
    isAtualizarDisabled: boolean = true;

    constructor(        
        private formBuilder: FormBuilder,
        private servico: CadastroService
    ) {}

    ngOnInit(): void {
        this.inicializarFormulario();
    }

    cadastrar() {
        let codigo = this.formulario.get("codigo")!.value;
        let nome = this.formulario.get("nome")!.value;
        let dtNascimento = this.formulario.get("dtNascimento")!.value;

        if(this.formulario.valid) {
            this.showLoading();
            this.exibirMsgCodigoObrigatorio = false;
            this.exibirMsgNomeObrigatorio = false;
            this.exibirMsgDtNascObrigatorio = false;

            let dto: CadastroDTO = new CadastroDTO();
            dto.codigo = codigo;
            dto.nome = nome;
            dto.dtNascimento = dtNascimento;
            dto.foto = this.fotoAdicionada;

            this.servico.salvar(dto).subscribe(
                (dados: ResponseCadastroDTO) => {
                    this.hideLoading();
                    if(dados.status == 1) {
                        this.acaoExibirMsg(dados.msg, 1);

                        this.formulario.reset();

                        this.listarUsuarios();
                    } else {
                        if(dados.msg.includes("ER_DUP_ENTRY")) {
                            this.acaoExibirMsg("Já existe um usuário com esse código!", 2);
                        } else {
                            this.acaoExibirMsg(dados.msg, 2);
                        }                        
                    }
                },
                (e) => {;
                    this.hideLoading();

                    this.acaoExibirMsg(e.message, 2);
                }
            );
        } else {
            this.exibirMsgCodigoObrigatorio = false;
            this.exibirMsgNomeObrigatorio = false;
            this.exibirMsgDtNascObrigatorio = false;

            if(!codigo) {
                this.exibirMsgCodigoObrigatorio = true;
            }

            if(!nome) {
                this.exibirMsgNomeObrigatorio = true;
            }

            if(!dtNascimento) {
                this.exibirMsgDtNascObrigatorio = true;
            }
        }
    }

    verificarPreenchimento(nomeCampo: string) {
        if(this.formulario.get(nomeCampo)!.value) {
            switch(nomeCampo) {
                case 'codigo':
                    this.exibirMsgCodigoObrigatorio = false;
                    break;
                case 'nome':
                    this.exibirMsgNomeObrigatorio = false;
                    break;
                case 'dtNascimento':
                    this.exibirMsgDtNascObrigatorio = false;
                    break;
            }
        } else {
            switch(nomeCampo) {
                case 'codigo':
                    this.exibirMsgCodigoObrigatorio = true;
                    break;
                case 'nome':
                    this.exibirMsgNomeObrigatorio = true;
                    break;
                case 'dtNascimento':
                    this.exibirMsgDtNascObrigatorio = true;
                    break;
            }
        }
    }

    verificarDecimalOuNegativo($event:any) {
        if($event.key == "." || $event.key == "," || $event.key == "-" ) {
            $event.preventDefault();
        }
    }

    acaoExibirMsg(msg: string, tipoMsg: number) {
        this.msg = msg;
        this.msgTipo = tipoMsg;

        this.exibirMsg = true;

        setTimeout(() => {
            this.exibirMsg = false;
        }, 2500);
    }

    listarUsuarios() {
        this.showLoading();
        this.servico.listar().subscribe(
            (dados: ResponseConsultaDTO) => {
                this.hideLoading();
                if(dados.status == 1) {
                    this.listaDeUsuarios = dados.data;
                } else {
                    this.acaoExibirMsg(dados.msg, 3);
                }                
            },
            (e) => {
                this.hideLoading();
                this.acaoExibirMsg(e.message, 2);
            }
        );
    }

    editarUsuario(codigo:any) {
        this.showLoading();
        this.isCodigoReadonly = false;
        this.isAtualizarDisabled = true;
        this.servico.listarPorId(codigo).subscribe(
            (dados: ResponseConsultaDTO) => {
                var dtNasc = new Date(dados.data[0].dtNascimento);
                this.hideLoading();
                if(dados.status == 1) {
                    this.formulario.patchValue({
                        codigo: dados.data[0].codigo,
                        nome: dados.data[0].nome,
                        dtNascimento: this.formatarDataNascimento(dtNasc)
                    });

                    this.isCodigoReadonly = true;
                    this.isAtualizarDisabled = false;
                } else {
                    this.acaoExibirMsg(dados.msg, 3);
                }                
            },
            (e) => {
                this.hideLoading();
                this.acaoExibirMsg(e, 2);
            }
        );
    }

    atualizar() {
        let codigo = this.formulario.get("codigo")!.value;
        let nome = this.formulario.get("nome")!.value;
        let dtNascimento = this.formulario.get("dtNascimento")!.value;

        if(this.formulario.valid) {
            this.showLoading();
            this.exibirMsgCodigoObrigatorio = false;
            this.exibirMsgNomeObrigatorio = false;
            this.exibirMsgDtNascObrigatorio = false;

            let dto: CadastroDTO = new CadastroDTO();
            dto.codigo = codigo;
            dto.nome = nome;
            dto.dtNascimento = dtNascimento;
            dto.foto = this.fotoAdicionada;

            this.servico.atualizarUsuario(dto).subscribe(
                (dados: ResponseCadastroDTO) => {
                    this.hideLoading();
                    if(dados.status == 1) {
                        this.acaoExibirMsg(dados.msg, 1);

                        this.formulario.reset();
                        this.isAtualizarDisabled = true;
                        this.isCodigoReadonly = false;
                        this.listarUsuarios();
                    } else {
                        this.acaoExibirMsg(dados.msg, 2);                  
                    }
                },
                (e) => {
                    this.hideLoading();
                    this.acaoExibirMsg(e.message, 2);
                }
            );
        } else {
            this.exibirMsgCodigoObrigatorio = false;
            this.exibirMsgNomeObrigatorio = false;
            this.exibirMsgDtNascObrigatorio = false;

            if(!codigo) {
                this.exibirMsgCodigoObrigatorio = true;
            }

            if(!nome) {
                this.exibirMsgNomeObrigatorio = true;
            }

            if(!dtNascimento) {
                this.exibirMsgDtNascObrigatorio = true;
            }
        }
    }

    addFoto($event:any) {
        if(!$event.target.files[0].type.includes("image")) {
        } else {
            this.fotoAdicionada = $event.target.files[0];
        }
    }

    limpar() {
        if(confirm("Deseja limpar a tela?")) {
            this.formulario.reset();
            this.listaDeUsuarios = [];
            this.isCodigoReadonly = false;
        }
    }

    removerUsuario(codigo:number) {
        if(confirm("Deseja excluir esse usuário?")) {
            this.showLoading();

            this.servico.removerUsuario(codigo).subscribe(
                (dados: ResponseCadastroDTO) => {
                    this.hideLoading();

                    if(dados.status == 1) {
                        this.acaoExibirMsg("Usuário removido.", 1);

                        this.listarUsuarios();
                    } else {
                        this.acaoExibirMsg("Usuário não pode ser removido.", 2);
                    }
                },
                (e) => {
                    this.hideLoading();

                    this.acaoExibirMsg(e.message, 2);
                }
            )
        }
    }

    testar() {
        this.servico.testar(this.fotoAdicionada).subscribe(
            (dados: ResponseCadastroDTO) => {
            },
            (e) => {   
            }
        );
    }

    private inicializarFormulario() {
        this.formulario = this.formBuilder.group({
            codigo: ['', Validators.required],
            nome: ['', Validators.required],
            dtNascimento: ['', Validators.required],
            // foto: ['', Validators.required]
        });
    }

    private formatarDataNascimento(dtNasc: Date) {
        let ano = dtNasc.getFullYear();
        let mes = dtNasc.getMonth()+1 > 9 ? dtNasc.getMonth()+1 : '0'+(dtNasc.getMonth()+1);
        let dia = dtNasc.getDate() > 9 ? dtNasc.getDate() : '0'+dtNasc.getDate();

        return ano+'-'+mes+'-'+dia;
    }

    private showLoading() {
        this.isLoading = true;
    }

    private hideLoading() {
        this.isLoading = false;
    }
}