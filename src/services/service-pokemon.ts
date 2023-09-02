import { Pokemon, Sprites } from "../models/pokemon"

export class ServicoPokemon {
    private url: string = 'https://pokeapi.co/api/v2/pokemon';


    public async buscarPokemon(param: string): Promise<Pokemon> {
        const res = await fetch(`${this.url}/${param}`);
        const obj = await this.obterResultado(res);
        return this.mapearPokemon(obj);
    }

    public async listarPokemons(): Promise<Pokemon[]> {
        const res = await fetch(this.url);
        const obj = await this.obterResultado(res);
        return await this.mapearListaPokemons(obj.results);
    }

    private obterResultado(res: Response): any {    
        if (res.ok)
            return res.json();

        throw new Error("Pokemon não encontrado");
    }


    private mapearListaPokemons(obj: any[]): any {
        const pokemons = obj.map((o:any) => this.buscarPokemon(o.name));
        return Promise.all(pokemons);
    }

    private mapearPokemon(obj: any): Pokemon {       
        return {
            id: obj.id,
            nome: obj.name,
            tipo:obj.types[0].type.name,
            sprites: obj.sprites.other['official-artwork'] as Sprites,

        } as Pokemon
    }
}