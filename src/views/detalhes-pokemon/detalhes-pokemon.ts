import { Pokemon } from "../../models/pokemon";
import { ServicoPokemon } from "../../services/service-pokemon";
import '../../views/detalhes-pokemon/detalhes-pokemon.css'

export class TelaDetalhes {
    imgPokemon: HTMLImageElement;
    nomePokemon: HTMLElement;
    galeria: HTMLImageElement[] = [];
    btnVoltar: HTMLButtonElement;
    txtTipoPokemon: HTMLElement;
    form: HTMLFormElement;
    input: HTMLInputElement;

    constructor(private service: ServicoPokemon) {
        this.txtTipoPokemon = document.getElementById('tipoPokemon') as HTMLElement;
        this.imgPokemon = document.getElementById('imagemPokemon') as HTMLImageElement;
        this.nomePokemon = document.getElementById('nomePokemon') as HTMLElement;
        this.btnVoltar = document.getElementById('btnVoltar') as HTMLButtonElement;
        this.galeria = Array.from(document.getElementsByClassName('miniImagem')) as HTMLImageElement[];
        this.form = document.getElementById('formulario') as HTMLFormElement;
        this.input = document.getElementById('inputPokemon') as HTMLInputElement;

        this.gerarEventos();
        this.obterParametroURL();
    }

    private gerarEventos() {
        this.galeria.forEach(x => x.addEventListener('click', ((event: Event) => this.alterarImagem(event))));
        this.btnVoltar.addEventListener('click', (event: Event) => this.voltar(event));
        this.form.addEventListener('submit', (event: SubmitEvent) => this.buscarPorNome(event));;
    }

    private buscarPorNome(event: SubmitEvent): void {
        event.preventDefault();

        this.buscarPokemon(this.input.value);
    }

    private async buscarPokemon(nome: string) {
        try {
            let pokemon = await this.service.buscarPokemon(nome);

            this.renderizarPokemon(pokemon);
        }
        catch (error) {
            this.mostrarAviso(error as string)
        }
    }

    private obterParametroURL(): void {
        const url = new URLSearchParams(window.location.search);
        const nome = url.get('nome') as string;

        this.buscarPokemon(nome);
    }

    private renderizarPokemon(pokemon: Pokemon): void {
        this.nomePokemon.textContent = `${pokemon.id}: ${pokemon.nome.toUpperCase()}`;
        this.imgPokemon.src = pokemon.sprites.front_default;
        this.txtTipoPokemon.textContent = pokemon.tipo;
        this.carregarMiniaturas(pokemon);
    }

    private carregarMiniaturas(pokemon: Pokemon): void {
        let miniaturas = this.galeria as HTMLImageElement[];
        miniaturas[0].src = pokemon.sprites.front_shiny;
        miniaturas[1].src = pokemon.sprites.front_default;
    }

    private alterarImagem(event: Event): any {
        let imagem = event.target as HTMLImageElement;
        this.imgPokemon.src = imagem.src;
    }

    public voltar(event: Event) {
        event.preventDefault()
        window.history.back()
    }

    private mostrarAviso(texto: string): void {
        let divAviso = document.createElement('div');
        divAviso.classList.add('aviso');
        let msg = document.createElement('p');
        msg.classList.add('msgAviso');
        msg.textContent = texto;
        document.body.appendChild(divAviso);
        divAviso.appendChild(msg);

        setTimeout(() => {
            document.body.removeChild(divAviso);
            this.input.value = '';
        }, 2000);
    }
}

window.addEventListener('load', () => new TelaDetalhes(new ServicoPokemon()));

