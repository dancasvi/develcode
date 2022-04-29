export class CadastroDTO {
    codigo!: number;
    nome!: string;
    dtNascimento!: Date;
    foto!: File;
}

export class ResponseCadastroDTO {
    msg!: string;
    status!: number;
    id!: number;
}

export class ResponseConsultaDTO {
    msg!: string;
    status!: number;
    data!: CadastroDTO[];
}

export class ResponsePadraoDTO {
    msg!: string;
    status!: number;
    id!: number;
}