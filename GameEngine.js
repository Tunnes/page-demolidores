// Variáveis Globais
var canvas, 
	ctx,
	velocidade = 13, 
	estadoAtual, 
	record,
	carro,

	Total_Altura	= parseInt(document.getElementById("MyDiv").style.height), 	 
	//Total_Largura	= parseInt(document.getElementById("MyDiv").style.width),

	// Para testes de responsividade "window.innerHeight" e "window.innerWidth"

	//Total_Altura	= window.innerHeight, 	 	
	Total_Largura	= window.innerWidth,	

	estados = { jogar: 0, jogando:  1, perdeu: 2 },
	
	carro = new Image();
	carro.src = "imagens/carro.png";

	player = new Image();
	player.src = "imagens/player_sprite.png";

	truck = new Image();
	truck.src = "imagens/truck.png";

	meioFioDi = new Image();
	meioFioDi.src = "imagens/meioFioDi.png";

	meioFioEs = new Image();
	meioFioEs.src = "imagens/meioFioEs.png";

	backRua = new Image();
	backRua.src = "imagens/backRua.png";


	rua = {
		y:0,
		x:0,
		altura:Total_Altura,

		atualiza: function(){
			this.x -= velocidade;
			if(this.x <= -Total_Largura)
				this.x = 0;	},

		desenha: function(){ 
				ctx.drawImage(backRua, 0, 0, 600, 600, this.x, 0, Total_Largura, Total_Altura);
				ctx.drawImage(backRua, 0, 0, 600, 600, this.x + Total_Largura, 0, Total_Largura, Total_Altura);}

	},
	Tela_Inicial = {
		//Tentativa de bolar uma tela inicial 
		x: 0, 
		y: 0,
		altura:  Total_Altura, 	 
		largura:  Total_Largura,	

		desenha: function(cor){
			ctx.fillStyle = cor;
			ctx.fillRect(this.x, this.y ,this.largura , this.altura);
			ctx.fillStyle ="#fff";
			ctx.save();
		},
	},
	

//Objetos Globais
	meioFioDireito = { 
		y: Total_Altura/1.084, 	 	 // Posição no eixo y da tela
		x: 0,
		altura: Total_Altura/13,	 // Altura relativa do chão
		cor:"#e8da78",				 // Cor do meio fio

		atualiza: function(){
			this.x -= 5.5;
			if(this.x <= -30)
				this.x = 0;	},

		desenha: function(){ 
				ctx.drawImage(meioFioDi, 0, 0, 600, 55, this.x, this.y, Total_Largura, this.altura);
				ctx.drawImage(meioFioDi, 0, 0, 600, 55, this.x + Total_Largura, this.y, Total_Largura, this.altura); }
	},

	meioFioEsquerdo = { 
		y: Total_Altura/7, 	 	 	 // Posição no eixo y da tela
		x: 0,
		altura: Total_Altura/13,	 // Altura relativa do chão
		cor:"#e8da78",				 // Cor do meio fio

		atualiza: function(){
			this.x -= 5.5;
			if(this.x <= -30)
				this.x = 0;},

		desenha: function(){ 
				ctx.drawImage(meioFioEs, 0, 0, 600, 55, this.x, this.y, Total_Largura, this.altura);
				ctx.drawImage(meioFioEs, 0, 0, 600, 55, this.x + Total_Largura, this.y, Total_Largura, this.altura);}

	},

	bloco = {
		x:(Total_Largura/100)*5, 		// Posição relativa de 5% no eixo x.
		y:0,					 		// Eixo y igual à 0 pois sera afetado pela gravidade.
		altura:(Total_Altura/100)*13, 	// Altura relativa de 7% do tamanho da tela 
		largura:(Total_Altura/100)*25,	// Altura relativa de 7% do tamanho da tela. 
		cor:"#ff9239",
		gravidade: 0.4,
		velocidade: 0,
		forcaDoPulo: 6.9,
		qntPulos:0,
		score: 0,

		atualiza: function(){
			this.velocidade += this.gravidade;
			this.y += this.velocidade;

			if(this.y >  meioFioDireito.y  - this.altura && estadoAtual != estados.perdeu){
				this.y = meioFioDireito.y  - this.altura;
				this.qntPulos  	= 0;
				this.velocidade = 0;}

			else if(this.y <  meioFioEsquerdo.y  + meioFioEsquerdo.altura && estadoAtual != estados.perdeu){
				this.y = meioFioEsquerdo.y  + meioFioEsquerdo.altura;			
				this.velocidade = 0;}	},


		pula: function(){
			this.velocidade = -this.forcaDoPulo; },

		reset: function(){
			this.velocidade = 0;
			this.y = 0;

			if(this.score > record){
				localStorage.setItem("record",this.score);
				record = this.score;}

			this.score = 0; },

		desenha: function(){
			ctx.drawImage(player, 0, 0, 298, 136, this.x, this.y, this.largura, this.altura);}	
	},
	//FimDoBloco

	GameOver = {
		//Funçãozinha marota pra economizar dedos..
		//Devo estilizar isso de acordo com o padrão de tudo no site veremos...
		x: Total_Largura / 2 - ((((Total_Altura/100)*8)*10)/2),
		y: Total_Altura / 2 - ((((Total_Altura/100)*8)*5)/2),
		//cor: "red",
		altura: ((Total_Altura/100)*8)*5,
		largura: ((Total_Altura/100)*8)*10,

		desenha: function(cor){
			ctx.fillStyle = cor;
			ctx.fillRect(this.x, this.y ,this.largura , this.altura);
			ctx.fillStyle ="#fff";
			ctx.save();
		},
		verifica:function(){
			//Só escreveessa poha na tela affs
			
			ctx.translate(Total_Largura/1.8, Total_Altura/1.7);

			if(bloco.score > record)
				ctx.fillText("Novo Record!",-150,-65);
			else if(record < 10)
				ctx.fillText("Record "+record,-99,-65);
			else if(record >= 10 && record < 100)
				ctx.fillText("Record "+record,-112,-65);
			else 
				ctx.fillText("Record "+record, -125, -65)

			ctx.font = (bloco.altura*2)+"px Arial";

			if(bloco.score < 10)
				
				ctx.fillText(bloco.score,-13, 19);
			else if(bloco.score >= 10 && bloco.score < 100)
				ctx.fillText(bloco.score,-26, 19);
			else if(bloco.score >= 100)
				ctx.fillText(bloco.score,-39, 19);
				ctx.restore();
		}
	},

	obstaculosDireita = {
		_obs: [],
		cores: ["#ffbc1c","#ff1c1c","#ff85e1","#52a7ff","#78ff5d"],
		tempoInsere:0,

		insere: function(){
			this._obs.push({
				x:Total_Largura,
				altura:(Total_Altura/100)*20,									// Largura relativa de 7% do tamanho da tela. esta ok
				largura: (bloco.altura * Math.floor((Math.random() * 3) + 4)),	// Altura randomica com max de 4 * o tamanho da tela.  
				cor: this.cores[Math.floor(5 * Math.random())] });
				
			this.tempoInsere = 40 +  Math.floor(21 * Math.random());
		},

		atualiza: function(){
			if(this.tempoInsere == 0)
				this.insere();
			else
				this.tempoInsere--;
								
			for(var i = 0, tam = this._obs.length; i < tam; i++){
				var  obs = this._obs[i];
				obs.x -= velocidade;
				obs.x--; 

				if(bloco.x < obs.x + obs.largura && bloco.x + bloco.largura > obs.x && bloco.y + bloco.altura >= meioFioDireito.y -obs.altura){
					estadoAtual = estados.perdeu;}

				else if(obs.x <= 0 && obs.x >= -6 ){
					bloco.score++;}

				else if(obs.x <= -obs.largura){
					this._obs.splice(i, 1);
					tam--;
					i--;}
			} //Fim do For
		},

		limpa: function(){
			this._obs = [];
		},

		desenha: function(){
			for(var i = 0, tam = this._obs.length; i < tam; i++){
				var obs = this._obs[i];
					ctx.fillStyle = obs.cor;
					if (obs.largura < (bloco.altura*5))
						ctx.drawImage(carro, 50, 50, 1327, 621, obs.x, meioFioDireito.y - obs.altura, obs.largura, obs.altura);
					else
						ctx.drawImage(truck, 50, 50, 2443, 713, obs.x, meioFioDireito.y - obs.altura, obs.largura, obs.altura);
					
				}

					
			}
		},
	//Fim obstaculosDireita			

	obstaculosEsquerda = {
		_obs: [],
		cores: ["#ffbc1c","#78ff5d","#ff85e1","#52a7ff","#ff1c1c"],
		tempoInsere:0,

		insere: function(){
			this._obs.push({
			y: meioFioEsquerdo.y + meioFioEsquerdo.altura,
			x:Total_Largura,
				altura:(Total_Altura/100)*20,									// Largura relativa de 7% do tamanho da tela. esta ok
				largura: (bloco.altura * Math.floor((Math.random() * 5) + 4)),	// Altura randomica com max de 4 * o tamanho da tela.  
			cor: this.cores[Math.floor(5 * Math.random())] });

			//DISTANCIA ENTRE UM E OUTRO.. PRECISO MEDITAR SOBRE ISSO MAIS TARDE.
		this.tempoInsere = 51 +  Math.floor(11 *Math.random());
		},

		atualiza: function(){
			if(this.tempoInsere == 0)
				this.insere();
			else
				this.tempoInsere--;
								
			for(var i = 0, tam = this._obs.length; i < tam; i++){
				var  obs = this._obs[i];
				obs.x -= velocidade;
				obs.x--; //VAOOO SE FODER!! DOMINATION PANTERA KRL!!!

				if((bloco.y + bloco.altura) < (obs.y + obs.altura + meioFioEsquerdo.altura) && bloco.x < obs.x + obs.largura && bloco.x + bloco.largura > obs.x  ){
					estadoAtual = estados.perdeu;}

				else if(obs.x < 0 && obs.x >= -20 ){
					bloco.score++;
				//	obstaculosDireita.enable = False;
					}

				else if(obs.x <= -obs.largura){
					this._obs.splice(i, 1);
					tam--;
					i--;}

			} // ta muito estranho isso.. NAO TA MAIS NAO KKK

		},//Fim atualiza

		limpa: function(){
			this._obs = [];
		},

		desenha: function(){
			for(var i = 0, tam = this._obs.length; i < tam; i++){
				var obs = this._obs[i];
				//ctx.fillStyle = obs.cor;
				//ctx.fillRect(obs.x, obs.y, obs.largura, obs.altura);



				if (obs.largura < (bloco.altura*5))
						ctx.drawImage(carro, 50, 50, 1327, 621, obs.x, obs.y, obs.largura, obs.altura);
					else
						ctx.drawImage(truck, 50, 50, 2443, 713, obs.x, obs.y, obs.largura, obs.altura);

			}
		}
	};

	//Funções do Game

	function clique(event){
		if(estadoAtual == estados.jogando)
			bloco.pula();

		else if(estadoAtual == estados.jogar){
			estadoAtual = estados.jogando;}

		else if(estadoAtual == estados.perdeu && bloco.y >=  2* Total_Altura){
			estadoAtual  = estados.jogar;
			obstaculosDireita.limpa();
			obstaculosEsquerda.limpa();
			bloco.reset();}

	}
	
	function main(){

		// Criando o componente canvas no html 
		canvas = document.getElementById("canvas");
		canvas.width = Total_Largura;
		canvas.height = Total_Altura;
		// FimCanvas

		// fim tamanho da tela..

		//canvas.style.border = "1px solid #000";

		ctx = canvas.getContext("2d");
		document.body.appendChild(canvas);

		// adicionando o evento clique do mouse..
		//document.addEventListener("click", clique);
		//Somente quando clicado no canvas..
		document.getElementById("canvas").addEventListener("click", clique);

		estadoAtual = estados.jogar;
		record = localStorage.getItem("record");

		if (record == null)
			record = 0;

		roda();
	}

	function roda(){
		atualiza();
		desenha();
		window.requestAnimationFrame(roda);
	}

	function atualiza() {
		bloco.atualiza();
		

		if(estadoAtual == estados.jogando){
			obstaculosDireita.atualiza(),
			obstaculosEsquerda.atualiza(),
			meioFioDireito.atualiza();
			meioFioEsquerdo.atualiza();
			rua.atualiza();

			
		}
	}

	function desenha() {
		//tela
		//ctx.fillStyle = "#80daff";
		//ctx.fillRect(0,0, LARGURA, ALTURA);
		//fim tela

		rua.desenha();


		
		//ctx.drawImage(backRua, 0, 0, 600, 600, 0, 0, Total_Largura, Total_Altura);

		ctx.fillStyle ="#fff";
		ctx.font = ((Total_Altura/100)*11)+"px Arial";

		ctx.fillText(bloco.score, (Total_Altura/100)*10, (Total_Altura - (Total_Altura/1.12)));
		//document.getElementById("sc").innerHTML = bloco.score; 
		//Joda pra dentro da poha da div ali encima


		if(estadoAtual == estados.jogar){
			GameOver.desenha("green");}

		else if(estadoAtual == estados.perdeu){
			GameOver.desenha("red");
			GameOver.verifica();}

		else if(estadoAtual == estados.jogando)
			obstaculosDireita.desenha(),
			obstaculosEsquerda.desenha();
			meioFioDireito.desenha();
			meioFioEsquerdo.desenha();
			
			bloco.desenha();
			
	}

	//inicializando o game Patrick *--*
	main();

		