import { Pokemon } from '../../models/pokemon';
import { ServicoPokemon } from '../../services/service-pokemon';
import '../../views/tela-inicial/tela-inicial.css'

class TelaPokemon {
    galeria: HTMLImageElement[] = [];
    form: HTMLFormElement;
    input: HTMLInputElement;
    grid: HTMLDivElement;
    pokemons: Pokemon[];

    constructor(private service: ServicoPokemon) {
        this.grid = document.getElementById('gridPokemons') as HTMLDivElement;
        this.form = document.getElementById('formulario') as HTMLFormElement;
        this.input = document.getElementById('inputPokemon') as HTMLInputElement;

        this.gerarEventos();
        this.obterListaPokemons();
    }

    private gerarEventos() {
        this.form.addEventListener('submit', (event: SubmitEvent) => this.buscarPorNome(event));
    }

    private async buscarPorNome(event: SubmitEvent): Promise<void> {
        event.preventDefault();
        let nome = this.input.value.toLowerCase();
        try {
            let pokemon = await this.service.buscarPokemon(nome)
            window.location.href = `detalhes-pokemon.html?nome=${pokemon.nome}`;
        }
        catch (error) {
            this.mostrarAviso(error as string);
        }
    }

    private async obterListaPokemons(): Promise<void> {
        try {
            this.pokemons = await this.service.listarPokemons();
            this.configurarGridPokemons(this.pokemons);
        }
        catch (error) {
            this.mostrarAviso(error as string);
        }
    }

    private configurarGridPokemons(pokemons: Pokemon[]) {
        for (let i = 0; i < 4; i++)
            this.gerarQuadro();
        this.incluirImagens(pokemons);
    }

    private gerarQuadro(): void {
        const quadro = document.createElement('img') as HTMLImageElement;
        quadro.addEventListener('click', (event: Event) => this.exibirDetalhesPorClick(event));
        quadro.classList.add('card-pokemons');
        this.grid.appendChild(quadro);
        this.galeria.push(quadro);
    }

    private exibirDetalhesPorClick(event: Event): any {
        let imagem = event.target as HTMLImageElement;
        window.location.href = `detalhes-pokemon.html?nome=${imagem.id}`;
    }

    private incluirImagens(pokemons: Pokemon[]) {
        const array = this.gerarArrayIndex() as number[];
        let index = 0;

        this.galeria.map(x => {
            let pokemom = pokemons[array[index++]] as Pokemon;

            if(pokemom){
                x.id = pokemom.nome;
                x.src = pokemom.sprites.front_default;
            }
        })

    }

    private gerarArrayIndex() {
        let numeros = new Set();

        for (let i = 0; i < 10; i++) {
            const numero = Math.floor(Math.random() * 19);

            if (!numeros.has(numero))
                numeros.add(numero);
        }

        return Array.from(numeros.values());
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

window.addEventListener('load', () => new TelaPokemon(new ServicoPokemon()));
