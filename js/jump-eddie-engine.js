
//Variáveis do game



var canvas, ctx, Total_Altura, Total_Largura, frames = 0, maxPulos = 3, velocidade = 6, estadoAtual, record,


Total_Altura = (window.innerHeight)/2, 	 // Falta Terminar..
Total_Largura  = window.innerWidth/1.16,

//Total_Altura = parseInt(document.getElementById("MyDiv").style.height), 	 // Falta Terminar..
//Total_Largura  = parseInt(document.getElementById("MyDiv").style.width),   // Falta Terminar.. Obs: apenas 600 o score funciona --'

estados = { jogar: 0, jogando:  1, perdeu: 2 },



chao = { 
			y: Total_Altura/1.1, 	 	 // Posição relativa no eixo y
			altura: Total_Altura/16,	 // Altura relativa do chão
			cor:"#e8da78",

			desenha: function(){
					ctx.fillStyle = this.cor;
					ctx.fillRect(0, this.y, Total_Largura, this.altura);
			}
		},

bloco = {
			x:(Total_Largura/100)*5, 		// Posição relativa de 5% no eixo x.
			y:0,					 		// Eixo y igual à 0 pois sera afetado pela gravidade.
			altura:(Total_Altura/100)*7, 	// Altura relativa de 7% do tamanho da tela 
			largura:(Total_Altura/100)*7,	// Altura relativa de 7% do tamanho da tela. 
			cor:"#ff9239",
			gravidade: 1.6,
			velocidade: 0,
			forcaDoPulo: 23.6,
			qntPulos:0,
			score: 0,

			atualiza: function(){
					this.velocidade += this.gravidade;
					this.y += this.velocidade;

					if(this.y >  chao.y  - this.altura && estadoAtual != estados.perdeu){
					this.y = chao.y  - this.altura;
					this.qntPulos  	= 0;
					this.velocidade = 0;}
								},

			pula: function(){
					if(this.qntPulos < maxPulos){
					this.velocidade = -this.forcaDoPulo;
					this.qntPulos++;}
							},

			reset: function(){
					this.velocidade = 0;
					this.y = 0;

					if(this.score > record){
						localStorage.setItem("record",this.score);
						record = this.score;}

					this.score = 0;

					
							},

			desenha: function(){
					ctx.fillStyle = this.cor;
					ctx.fillRect(this.x, this.y, this.largura, this.altura);
							   }
		}, // FimDoBloco

obstaculos = {

			_obs: [],
			cores: ["#ffbc1c","#ff1c1c","#ff85e1","#52a7ff","#78ff5d"],
			tempoInsere:0,

			insere: function(){
				 	this._obs.push({
						x:Total_Largura,
						largura:(Total_Altura/100)*7,  // Altura relativa de 7% do tamanho da tela. 
						altura: ((Total_Altura/100)*5) + Math.floor(120 * Math.random()),
						cor: this.cores[Math.floor(5 * Math.random())] 
					});
					this.tempoInsere = 30 +  Math.floor(31 *Math.random());
			},

			atualiza: function(){
					if(this.tempoInsere == 0)
						this.insere();
					else
						this.tempoInsere--;
					

					for(var i = 0, tam = this._obs.length; i < tam; i++)
					{
						var  obs = this._obs[i];
						obs.x -= velocidade;
						obs.x--; //VAOOO SE FODER!! DOMINATION PANTERA KRL!!!

						if(bloco.x < obs.x + obs.largura && bloco.x + bloco.largura > obs.x && bloco.y + bloco.altura >= chao.y -obs.altura){

							estadoAtual = estados.perdeu;
						}
							else if(obs.x <= 0 && obs.x >= -6 ){
							// se fode ai
							bloco.score++;

						}
						else if(obs.x <= -obs.largura){
							this._obs.splice(i, 1);
							tam--;
							i--;
						}
					} // ta muito estranho isso.. NAO TA MAIS NAO KKK

					},

			limpa: function(){
					this._obs = [];
			},

			desenha: function(){
					for(var i = 0, tam = this._obs.length; i < tam; i++){
						var obs = this._obs[i];
						ctx.fillStyle = obs.cor;
						ctx.fillRect(obs.x, chao.y - obs.altura, obs.largura, obs.altura);
																		}
								}
			};

function clique(event){
	if(estadoAtual == estados.jogando)
	bloco.pula();

	else if(estadoAtual == estados.jogar){
		estadoAtual = estados.jogando;
	}
	else if(estadoAtual == estados.perdeu && bloco.y >=  2* Total_Altura){
		estadoAtual  = estados.jogar;
		obstaculos.limpa();
		bloco.reset();
	}
}
function main(){

	Total_Altura = Total_Altura;

	Total_Largura = Total_Largura;
	// Tamanho da tela...
	/*
		Total_Altura = window.innerHeight;
		Total_Largura = window.innerWidth;

		if(Total_Largura>= 500){
			Total_Largura = 600;
			Total_Altura = 600;
		}
	*/
	// Criando o componente canvas no html 
		canvas = document.getElementById("canvas");
		canvas.width = Total_Largura;
		canvas.height = Total_Altura;
	// FimCanvas

	// fim tamanho da tela..

	// canvas.style.border = "1px solid #000";
	// Não precisa mais de border man..

	ctx = canvas.getContext("2d");
	document.body.appendChild(canvas);

	// adicionando o evento clique do mouse..
	document.getElementById("canvas").addEventListener("click", clique);
	estadoAtual = estados.jogar;
	record = localStorage.getItem("record");
	if (record == null)
		record = 0;

	roda();
}
function roda() {
	atualiza();
	desenha();
	window.requestAnimationFrame(roda);

}
function atualiza() {
	bloco.atualiza();

	if(estadoAtual == estados.jogando){
		obstaculos.atualiza();
	}
}
function desenha() {
	
	//Background do game.
	ctx.fillStyle = "#FFF";
	ctx.fillRect(0,0, Total_Largura, Total_Altura);
	//Background do game.

	//================Header-Game=================================================================

	ctx.fillStyle ="black";
	ctx.font = ((Total_Altura/100)*11)+"px Roboto Black";
	ctx.fillText(bloco.score, (Total_Altura/100)*10, (Total_Altura - (Total_Altura/1.12)));

	ctx.fillStyle ="black";
	ctx.font = ((Total_Altura/100)*11)+"px Roboto Black";
	ctx.fillText("RECORD "+record, Total_Largura - 220, (Total_Altura - (Total_Altura/1.12)));
	
	//============================================================================================
	if(estadoAtual == estados.jogar){
		ctx.fillStyle ="black";
		ctx.font ="70px Roboto Black";
		ctx.fillText("INICIAR",(Total_Largura / 2) - 100, (Total_Altura / 2) - 10);
		
	}
	else if(estadoAtual == estados.perdeu){
		ctx.fillStyle ="black";
		ctx.font ="70px Roboto Black";
		ctx.fillText("PERDEU =(",(Total_Largura / 2) - 150, (Total_Altura / 2) - 10);

		ctx.save();
		ctx.translate(Total_Largura/2, Total_Altura/2 );
		ctx.fillStyle ="black";

		if(bloco.score > record)
			ctx.font = ((Total_Altura/100)*11)+"px Roboto Black";
			ctx.fillText("NOVO RECORD!", Total_Largura - 220, (Total_Altura - (Total_Altura/1.12)));
		
		

		ctx.restore();
	}
	else if(estadoAtual == estados.jogando)
		obstaculos.desenha();
	
	chao.desenha();
	bloco.desenha();
}
//inicializando o game Patrick *--*
main();
