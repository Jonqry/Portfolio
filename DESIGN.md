# DESIGN.md: redesenho do portfólio

Direção escolhida: **da planta à maquete**. A rolagem conta o que acontece no estande de vendas: o cliente vê a planta humanizada do folder, as paredes sobem e a planta vira a maquete iluminada. O 3D é modelado e iluminado no Blender, e não montado com caixas em código.

Este arquivo é a referência do projeto. Toda decisão visual nova entra aqui antes de entrar no código.

## 1. A estratégia antes do visual

O problema de muito portfólio hoje é ser bonito no post do LinkedIn e ninguém abrir de verdade. Este site precisa fazer o contrário:

1. **A home é uma porta, não uma vitrine.** Em qualquer ponto da home, um projeto funcionando está a um clique, e a demo do Simulador está na própria página (seção 7).
2. **O 3D tem que puxar a pessoa para dentro.** Ele é a planta navegável, e não uma animação para assistir. Todo cômodo é clicável desde o primeiro quadro.
3. **O destaque é a história:** você é corretor e constrói as ferramentas que usa no trabalho. O visual existe para contar isso, e não para competir com isso.
4. **No LinkedIn, divulgue projeto, não portfólio.** Um vídeo curto de um projeto resolvendo um caso real, com link direto para testar. O portfólio fica para quem quiser ver mais.

## 2. Suposições

- O fundo é o **estande escuro** do começo ao fim. A casa é um apartamento, então não tem terreno: a unidade aparece como a maquete de planta do estande, e o prédio inteiro aparece na abertura da rolagem.
- O seu nome continua na home. O portfólio é a sua casa.
- Nos sites dos projetos, a sua autoria aparece só no carimbo do rodapé (seção 9).

## 3. A home, quadro a quadro

A planta fica fixa na tela (`position: sticky`) numa seção de cerca de 250vh. A rolagem conduz a câmera e as paredes. **Os cômodos são clicáveis em todas as etapas.**

| Etapa | Rolagem | O que se vê |
|---|---|---|
| 0. Chegada | 0% | Nome, uma frase, o botão "Testar o simulador" e os cômodos como links. Atrás, a maquete do prédio com a sua unidade marcada em marca-texto. Tudo isso aparece sem rolar. Até o prédio ficar pronto (passo 9 do plano), a chegada mostra direto a planta da unidade. |
| 1. Planta | 0–25% | A câmera desce até a unidade marcada, o prédio sai de cena e fica a planta humanizada vista de cima, com os nomes no piso e as paredes como traço de grafite. O cômodo sob o mouse ou o foco acende em marca-texto. |
| 2. As paredes sobem | 25–60% | As paredes externas sobem primeiro e as internas depois, passando do grafite ao branco de maquete. Os móveis vêm por último. |
| 3. Maquete | 60–100% | A câmera inclina para uns 35° e gira devagar. A planta se revela a maquete da unidade: laje recortada, trecho do corredor do prédio e base de MDF, sob o spot quente do estande. |
| 4. Saída | depois | O "Agora / Formação / Procurando" atual, e a demo do Simulador se ela não estiver acima. |

**Entrar num cômodo, em qualquer etapa:** a porta abre, a câmera mergulha no cômodo em cerca de 900 ms e a navegação acontece com View Transition. O piso do cômodo vira o fundo da página nova, e as paredes do cômodo viram a moldura da página. Voltar faz o caminho inverso.

### A planta

A casa é a planta tipo de um apartamento de 2 quartos, um deles suíte, com varanda gourmet: 9,20 × 5,30 m por fora, o tipo de imóvel do MCMV. A base é uma planta cotada real, sem o nome do empreendimento nem da construtora. As medidas estão em `app/planta.json`, com paredes de 10 cm (a parede entre a varanda e a sala tem 15 cm na planta cotada e ficou com 10, centrada). A sala é em L e se divide na horizontal: o estar fica junto à varanda, e o jantar, com o cantinho do café, junto à parede da entrada. O pedaço entre a circulação e o estar é só passagem. A cozinha e a área de serviço são abertas para a sala, a varanda tem guarda-corpo de vidro de 1,10 m, a laje técnica fica atrás dos quartos e um trecho do corredor do prédio fica na porta de entrada. O canto do jantar junto ao banheiro é reto, como na planta cotada. A curva que aparece ali no folder dessa planta é marcenaria (o painel ripado do cantinho do café), então entra como móvel no `maquete.py`, em `MOVEIS_CURVOS`, e não no JSON. No piso, o nome da seção vem grande e o tipo do cômodo vem pequeno embaixo, para quem não conhece a metáfora entender igual.

| Cômodo | Seção |
|---|---|
| Suíte | Simulador |
| Quarto | Place Brokers |
| Cozinha | CashFlow (as contas da casa) |
| Área de serviço | Mais projetos (Currículo Express e EcoCiclo) |
| Sala de estar | Sobre |
| Mesa de jantar | Experiência e currículo |
| Varanda gourmet | Contato |
| Banheiros, circulações, laje técnica e corredor | Nenhuma: só dão realismo à planta |

## 4. Tokens

### Cor

**Cor dominante:** o azul-ardósia do estande, do começo ao fim. O calor vem dos materiais da maquete (MDF, taco e a luz do spot), e o marca-texto aparece só para marcar a sua unidade e o cômodo em foco.

| Nome | Hex | Uso |
|---|---|---|
| Estande | `#26313A` | Fundo da home e das transições (texto Maquete por cima: 11,8:1) |
| Marca-texto | `#F5D547` | A sua unidade no prédio e o cômodo em foco (texto Tinta por cima: 10,3:1) |
| Maquete | `#F3F2EE` | Paredes, móveis e fundo das páginas internas (texto Tinta: 13:1 ou mais) |
| Porcelanato | `#D8D6CF` | Piso dos cômodos neutros |
| Taco | `#B98A57` | Piso dos quartos e detalhes em madeira (nunca fundo de texto) |
| Cerâmica | `#E4E2DC` | Piso da cozinha, do banheiro e da área de serviço |
| Laje | `#BDBAB2` | Corte da laje e o corredor do prédio |
| MDF | `#B0916A` | Borda da placa da maquete (só texto grande por cima: 4,5:1) |
| Móvel | `#C9AE84` | Móveis da maquete, em madeira clara, para não se confundirem com as paredes (nunca fundo de texto) |
| Spot | `#FFE9B8` | A luz do estande e o anel de foco sobre o Estande (nas páginas claras, o anel de foco é o Marca-texto) |
| Tinta | `#1E2A22` | Texto |
| Grafite | `#23292B` | Paredes na etapa de planta e as cotas |

### Tipografia

**Bricolage Grotesque** variável, com os eixos de tamanho óptico, largura e peso. É uma família só: o tamanho óptico separa título de corpo. Os nomes dos cômodos ficam escritos no piso, na mesma fonte (vão como textura no 3D e como `<text>` no SVG). Carregada com `next/font/google` (eixos `opsz` e `wdth`), que hospeda os arquivos junto com o site, como a Bitter da demo do Simulador.

Escala: 16 / 20 / 25 / 31 / 39 / 61 px (razão de 1,25, com saltos no topo). O corpo fica em 17px com altura de linha de 1,6 e no máximo 70 caracteres por linha.

### Tratamento de imagem

- **Na planta:** o projeto aparece no piso do cômodo, como tapete, na identidade do próprio projeto. A textura do piso sai de um print real e é estilizada no Blender ou no Figma.
- **Nas páginas:** prints em cor cheia e sem moldura de navegador falsa. Cada print vem acompanhado de um vídeo curto (5–8 s, sem som, em loop) mostrando o uso real. O vídeo para quando há movimento reduzido.
- **A sua foto:** aparece só no cômodo Sobre, em cor natural, sem filtro.

## 5. O 3D: como fica bonito

O 3D anterior ficou simples porque eram caixas com luz calculada em tempo real. Maquete digital bonita é **luz assada (baked)** no Blender: sombra suave, oclusão nos cantos e luz rebatida ficam gravadas na textura. O navegador só mostra a imagem pronta. Fica com cara de render e quase não pesa.

### Pipeline

1. **`planta.json` é a fonte única.** Cômodos, paredes, portas e janelas em metros. O SVG da planta e o modelo 3D saem do mesmo arquivo, então nunca ficam diferentes.
2. **`blender/maquete.py`** lê o JSON e monta a base no Blender. As paredes saem com chanfro e vãos de porta, as folhas de porta ficam como objetos separados com a dobradiça no lugar certo, e o script cria também a placa com borda de MDF, o piso por cômodo e as coleções organizadas. As paredes são cortadas a 1,20 m, e os móveis altos e as folhas de porta a 1,00 m, como numa planta humanizada 3D, para os cômodos aparecerem de qualquer ângulo da câmera.
3. **Sua etapa de arte, no Blender:** móveis, materiais (isopor fosco, MDF com veio, acrílico nas janelas) e a luz do spot. É aqui que o resultado sai do "programador fez 3D". O `blender/arte.py` faz uma primeira passada automática depois do `maquete.py`: roupa de cama clara, ripado no painel do jantar, piso cinza nos banheiros e um pouco mais de contraste.
4. **Bake:** lightmap por coleção (paredes e móveis numa, pisos noutra, placa noutra), em Cycles. O piso de cada projeto fica numa textura separada, para trocar sem refazer o bake.
5. **Exportação:** glTF binário (`.glb`) com compressão de geometria (Draco ou meshopt) e texturas KTX2 ou WebP.
6. **Render parado:** uma imagem da etapa 3 em alta, que serve como pôster, fallback e imagem de compartilhamento.
7. **`blender/bake.py`** faz os passos 4 a 6 de uma vez, depois do `maquete.py` e do `arte.py`: assa só a luz (as cores ficam nos materiais, então o piso de um projeto troca sem refazer o bake), exporta `public/maquete/maquete.glb` com Draco e a UV 1 "Luz", grava `luz-<grupo>.webp`, `luz.json` (arquivo, intensidade e objetos de cada lightmap) e `poster.webp`, e confere o orçamento abaixo.

### No site

- React Three Fiber + drei, carregados **só na home** e **só depois** que a página está interativa (`dynamic import` com `ssr: false`).
- Materiais sem luz em tempo real (`MeshBasicMaterial` com o lightmap). As únicas partes vivas são o realce do cômodo, as portas abrindo e as paredes subindo.
- A câmera segue uma curva definida no Blender, exportada como animação e lida pela rolagem. Assim você ajusta o movimento de câmera no lugar onde sabe trabalhar.

### Orçamento

| Item | Meta |
|---|---|
| Modelo `.glb` | até 1 MB |
| Texturas somadas | até 1,5 MB |
| Polígonos | até 150 mil |
| JS do 3D | carregado depois do LCP e fora do caminho crítico |
| LCP da home | abaixo de 2,5 s em 4G, com o pôster ou o SVG como elemento do LCP |
| Taxa de quadros | 60 fps em notebook comum e 30 fps no mínimo em celular médio |

## 6. Acessibilidade e "ninguém passa direto"

- **A planta SVG é a página.** Ela é renderizada no servidor, vem com links reais e funciona sem JavaScript. O 3D entra por cima como camada visual, com `aria-hidden`, e aponta para os mesmos links. Foco de teclado num link do SVG acende o cômodo no 3D.
- **Movimento reduzido:** sem rolagem conduzida e sem 3D animado. Aparece o render parado da maquete com a planta clicável por cima.
- **Celular:** o 3D só liga se o aparelho aguenta (checagem simples de GPU e memória). Senão, aparecem o render parado e os cômodos como lista de links.
- **Sem WebGL ou com erro no 3D:** a planta SVG fica, e nada quebra.
- **O que se vê sem rolar:** o nome, uma frase, "Testar o simulador" e a planta clicável. Quem não rolar nada ainda chega aos projetos.
- O contraste do texto corrido fica em 4,5:1 ou mais (os valores da seção 4 já foram conferidos).

## 7. A demo do Simulador na home

É o que faz o recrutador parar: em 10 segundos ele mexe numa ferramenta real.

- Tem **dois campos:** renda bruta mensal e valor do imóvel. Mostra três resultados: a faixa do MCMV, a parcela estimada e se cabe nos 30% da renda.
- Usa **a mesma função de cálculo do Simulador**, copiada do repositório dele (só o necessário), com os testes dela.
- Termina em **"Abrir o simulador completo"**, com os valores preenchidos via parâmetros na URL.
- Aparece na identidade do Simulador, e não na do portfólio, com uma moldura de cômodo em volta.

## 8. Páginas internas

- Cada página é um cômodo. A moldura é a parede grossa nas bordas, com uma abertura de porta onde fica "Voltar à planta".
- O piso do cômodo aparece como uma faixa entre a parede e o conteúdo, e o texto fica sempre sobre a Maquete. Hoje cada página usa o piso do próprio cômodo: Projetos, Sobre e Experiência em Porcelanato, Place Brokers em Taco. Com o mergulho do passo 5, passa a ser o piso do cômodo de onde a pessoa veio.
- É o componente `<Comodo piso="...">`, em `app/components/Comodo.js`.
- A página de projeto mostra o vídeo de uso, o problema, o que você fez e os links ("Testar", "Ver o código", "Ler o estudo de caso").

## 9. Identidade dos projetos e o carimbo

O portfólio **emoldura** os projetos e não os **marca**. Nos sites dos projetos não entram o seu nome no cabeçalho, as cores do portfólio nem a fonte do portfólio.

A assinatura é o **carimbo**, o selo do canto de uma prancha de arquitetura:

```
┌──────────────────────────────┐
│ Projeto e desenvolvimento    │
│ João Victor Varela, 2026     │
└──────────────────────────────┘
```

- Fica no rodapé, à direita, com borda de 1px e texto de 12–13px. O nome leva ao portfólio.
- Usa as cores e a fonte do projeto, com contraste de pelo menos 4,5:1.
- Em projeto de equipe, diz qual parte é sua ("Área do corretor: João Victor Varela").
- É um componente `<Carimbo />` copiado em cada repositório, sem pacote compartilhado.

O primeiro projeto a ganhar identidade própria é o **Simulador**, porque ele aparece na home.

## 10. Plano

1. `planta.json` + SVG da home lendo dele → verificar: a planta atual continua idêntica. Feito; o apartamento novo está em `planta.json`, e a home atual lê `planta-antiga.json` até o redesenho, quando esse arquivo é apagado.
2. `blender/maquete.py` → verificar: rodando no seu Blender, a base sai com paredes, vãos, portas e placa nas medidas do JSON.
3. Sua etapa de arte e bake no Blender → verificar: render parado aprovado por você e `.glb` dentro do orçamento da seção 5.
4. Cena 3D na home com a rolagem → verificar: funciona com teclado, sem WebGL e com movimento reduzido; LCP dentro da meta.
5. Mergulho no cômodo + View Transition → verificar: ida, volta e botão voltar do navegador.
6. Demo do Simulador na home → verificar: os testes da função copiada passam e os valores batem com o Simulador completo. Feito.
7. Identidade própria do Simulador + carimbo → verificar: nada do portfólio aparece no Simulador além do carimbo.
8. Tokens e páginas internas como cômodos → verificar: contraste e navegação por teclado em todas as páginas. Feito; o fundo Estande entra na home com o passo 4.
9. Abertura com o prédio: script que gera os andares a partir da mesma planta, com a unidade marcada em marca-texto → verificar: o prédio pesa pouco (só volumes), a câmera desce até a unidade certa e os cômodos continuam clicáveis desde a chegada.
