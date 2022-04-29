import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs";
import { CadastroDTO, ResponseCadastroDTO, ResponseConsultaDTO, ResponsePadraoDTO } from "../models/model";

@Injectable({ providedIn: 'root' })
export class CadastroService {
    constructor(private http: HttpClient) {}

    salvar(dto: CadastroDTO) {
        let json: CadastroDTO = this.cadastroDtoToJson(dto);

        return this.http.post<ResponseCadastroDTO>('http://dancasvi.com.br:21075/develcode/create', json).pipe(map((dados: ResponseCadastroDTO) => dados));

        // let file: File = dto.foto;
        // let formData:FormData = new FormData();
        // formData.append('foto', file, file.name);
        // formData.append('codigo', dto.codigo.toString());
        // formData.append('nome', dto.nome);
        // formData.append('dtNascimento', dto.dtNascimento.toString());
        // let headers = new Headers();
        // /** In Angular 5, including the header Content-Type can invalidate your request */
        // headers.append('Content-Type', 'multipart/form-data');
        // headers.append('Accept', 'application/json');
        // return this.http.post<ResponseCadastroDTO>("http://dancasvi.com.br:21075/develcode/create", formData).pipe(map((dados: ResponseCadastroDTO) => dados));
    }

    listar() {
        return this.http.get<ResponseConsultaDTO>('http://dancasvi.com.br:21075/develcode/read').pipe(map((dados: ResponseConsultaDTO) => dados));
    }

    listarPorId(codigo: number) {
        return this.http.get<ResponseConsultaDTO>('http://dancasvi.com.br:21075/develcode/'+codigo).pipe(map((dados: ResponseConsultaDTO) => dados));
    }

    atualizarUsuario(dto: CadastroDTO) {
        let json: CadastroDTO = this.cadastroDtoToJson(dto);

        return this.http.put<ResponseCadastroDTO>('http://dancasvi.com.br:21075/develcode/update', json).pipe(map((dados: ResponseCadastroDTO) => dados));
    }

    removerUsuario(id: number) {
        return this.http.delete<ResponsePadraoDTO>('http://dancasvi.com.br:21075/develcode/remove/'+id).pipe(map((dados: ResponsePadraoDTO) => dados));
    }

    testar(file: File) {
        let formData:FormData = new FormData();
        formData.append('arquivo', file, file.name);
        console.log(formData.get('arquivo'));
        return this.http.post<ResponseCadastroDTO>("http://dancasvi.com.br:21075/teste", formData).pipe(map((dados: ResponseCadastroDTO) => dados));
    }

    private cadastroDtoToJson(dto: CadastroDTO) {
        return {
            codigo: dto.codigo,
            nome: dto.nome,
            dtNascimento: dto.dtNascimento,
            foto: dto.foto
        }
    }
}