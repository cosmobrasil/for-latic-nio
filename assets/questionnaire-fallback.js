window.foodQuestionnaireFallback = {
  "metadata": {
    "titulo": "Autodiagnóstico de Circularidade para Laticínios",
    "data": "2026-10-07",
    "versao": "v4-matriz-ok-laticinio-2026",
    "idioma": "pt-BR",
    "setor": "laticinios",
    "fonte": "OK_LATICINIO 2.0 _2026.xlsx — aba Matriz Limpa",
    "escala_pontuacao": {
      "0": "prática de baixa circularidade ou desconhecida",
      "1": "prática intermediária ou parcial",
      "2": "prática mais aderente à circularidade",
      "3": "pontuação específica indicada pela anotação da Q3 na matriz"
    },
    "metodologia_pontuacao": "A matriz não continha coluna de pontuação. As pontuações foram associadas por alternativa usando a escala 0–2 do aplicativo; para a alternativa Sim da Q3, foi aplicado 3 conforme a anotação 'AQUI PRECISARIA PUNTUACAO 3' na célula da pergunta.",
    "metodologia_recomendacoes": "A matriz não continha recomendações nem prioridades. As recomendações e prioridades por alternativa foram elaboradas para esta versão do questionário."
  },
  "sections": [
    {
      "id": "q1",
      "stageId": "entrada",
      "titulo": "ORIGEM E TIPOLOGIA DAS MATÉRIAS-PRIMAS - ETAPA 1",
      "descricao": "Por que medir? A gestão das matérias-primas pode atrair novos consumidores modernos. Clientes priorizam marcas associadas ao cuidado ambiental e ao bem-estar animal e ao uso de matéria-prima saudável.",
      "temaFonte": "ORIGEM E TIPOLOGIA DAS MATÉRIAS-PRIMAS (Etapa 1). Por que medir? A gestão das matérias-primas pode atrair novos consumidores modernos. Clientes priorizam marcas associadas ao cuidado ambiental e ao bem-estar animal e ao uso de matéria-prima saudável.",
      "pergunta": "Qual a origem e tipologia das matérias-primas: qual é o tipo de matérias-primas predominantes (mais que 80%) do produto que você indicou?",
      "type": "single_choice",
      "options": [
        {
          "id": "q1_01",
          "texto": "A) Utilizamos majoritariamente matéria-prima agropecuária com certificação de origem rastreável e fornecedores formalizados.",
          "pontuacao": 2,
          "recomendacao": "Manter a rastreabilidade dos insumos e a formalização dos fornecedores; revisar periodicamente os critérios de qualidade e conformidade.",
          "prioridade": "Médio prazo"
        },
        {
          "id": "q1_02",
          "texto": "B) Utilizamos majoritariamente matéria-prima de fornecedores com segurança sanitária, porém sem rastreabilidade ou certificação de origem.",
          "pontuacao": 1,
          "recomendacao": "Mapear os fornecedores principais e estabelecer critérios de origem, qualidade, conformidade e rastreabilidade para as compras.",
          "prioridade": "Curto prazo"
        },
        {
          "id": "q1_03",
          "texto": "C) Utilizamos majoritariamente matéria-prima proveniente do aproveitamento de resíduos de outros processos produtivos.",
          "pontuacao": 2,
          "recomendacao": "Documentar a origem, a segurança e o destino dos insumos reaproveitados e ampliar seu uso quando compatível com os requisitos sanitários.",
          "prioridade": "Médio prazo"
        },
        {
          "id": "q1_04",
          "texto": "Não aplicável, não, não sei etc.",
          "pontuacao": 0,
          "recomendacao": "Levantar as principais matérias-primas e fornecedores e registrar origem, qualidade, conformidade e rastreabilidade disponíveis.",
          "prioridade": "Curto prazo"
        }
      ]
    },
    {
      "id": "q2",
      "stageId": "gestao_residuos",
      "titulo": "GESTÃO INTERNA DE RESÍDUOS - ETAPA 2",
      "descricao": "Apresenta diversos benefícios. Essa prática pode contribuir para a melhoria da imagem da marca, protegendo a reputação da empresa e transmitindo confiança e qualidade ao cliente final. Além disso, a redução de custos permite a oferta de preços mais competitivos no ponto de venda.",
      "temaFonte": "A gestão interna de resíduos (Etapa 2) apresenta diversos benefícios.  Essa prática pode contribuir para a melhoria da imagem da marca, protegendo a reputação da empresa e transmitindo confiança e qualidade ao cliente final. Além disso, a redução de custos permite a oferta de preços mais competitivos no ponto de venda.",
      "pergunta": "Capacidade de utilizar os resíduos gerados pelos processos produtivos do produto que você indicou.",
      "type": "single_choice",
      "options": [
        {
          "id": "q2_01",
          "texto": "A) A maioria (mais de 80%) dos resíduos de produção segue para descarte sem reaproveitamento. Exemplo: destinados a aterros sanitários.",
          "pontuacao": 0,
          "recomendacao": "Quantificar resíduos e rejeitos, identificar as causas de geração e priorizar prevenção, segregação e alternativas de valorização antes do descarte.",
          "prioridade": "Curto prazo"
        },
        {
          "id": "q2_02",
          "texto": "B) A maioria (mais de 80%) dos resíduos de produção segue para processos de reciclagem, reúso e reaproveitamento. Exemplo: reutilização da água e do soro, etc.",
          "pontuacao": 2,
          "recomendacao": "Manter registros dos volumes e destinos e consolidar parceiros para reciclagem, reúso, reaproveitamento e compostagem adequados.",
          "prioridade": "Médio prazo"
        },
        {
          "id": "q2_03",
          "texto": "C) Não aplicável, não, não sei etc.",
          "pontuacao": 0,
          "recomendacao": "Fazer um inventário dos resíduos e destinos atuais e definir um plano básico para reduzir descartes e verificar opções de valorização.",
          "prioridade": "Curto prazo"
        }
      ]
    },
    {
      "id": "saida_produto",
      "titulo": "EMBALAGEM (FIM DE VIDA) - ETAPA 3",
      "descricao": "Utilização e descarte da embalagem após o consumo do produto. Qual a importância da medição? A prática do design e embalagens ecológicas diferencia queijo, leite ou iogurte dos concorrentes tradicionais. (Etapa 3: Fim de vida do produto)",
      "pergunta": "",
      "type": "grouped_single_choice",
      "subsections": [
        {
          "id": "q3",
          "titulo": "Questão Q3",
          "pergunta": "A sua empresa adota embalagens feitas com material reciclado, como, por exemplo, papelão reciclado nas caixas de transporte e plástico reciclado nas garrafas?",
          "options": [
            {
              "id": "q3_01",
              "texto": "A) Sim",
              "pontuacao": 3,
              "recomendacao": "Manter e documentar o conteúdo reciclado das embalagens, verificando origem dos materiais, conformidade para contato com alimentos e desempenho da embalagem.",
              "prioridade": "Médio prazo"
            },
            {
              "id": "q3_02",
              "texto": "Não aplicável, não, não sei etc.",
              "pontuacao": 0,
              "recomendacao": "Avaliar alternativas seguras de embalagem com conteúdo reciclado e verificar fornecedores, especificações e requisitos aplicáveis antes da adoção.",
              "prioridade": "Curto prazo"
            }
          ]
        },
        {
          "id": "q5",
          "titulo": "Questão Q5",
          "pergunta": "A embalagem possui informações ou soluções que facilitem sua reutilização. Exemplo: logística reversa e valorização energética, promovendo o reaproveitamento?",
          "options": [
            {
              "id": "q5_01",
              "texto": "A) Sim",
              "pontuacao": 2,
              "recomendacao": "Manter soluções de separação, retorno ou reaproveitamento e acompanhar os volumes efetivamente recuperados e seus destinos.",
              "prioridade": "Médio prazo"
            },
            {
              "id": "q5_02",
              "texto": "B) Não aplicável, não, não sei etc.",
              "pontuacao": 0,
              "recomendacao": "Mapear as embalagens e seus destinos pós-consumo e estruturar opções de separação, retorno ou reaproveitamento com parceiros.",
              "prioridade": "Curto prazo"
            }
          ]
        },
        {
          "id": "q6",
          "titulo": "Questão Q6",
          "pergunta": "Os materiais dos quais as embalagens são realizadas poderão ser destinados principalmente para descarte em aterros sanitários?",
          "options": [
            {
              "id": "q6_01",
              "texto": "A) Sim",
              "pontuacao": 0,
              "recomendacao": "Reduzir o envio de embalagens a aterros e priorizar alternativas viáveis de redução, reúso, reciclagem ou valorização material.",
              "prioridade": "Curto prazo"
            },
            {
              "id": "q6_02",
              "texto": "B) Não",
              "pontuacao": 2,
              "recomendacao": "Manter evidências dos destinos das embalagens e monitorar os fluxos para confirmar que não seguem predominantemente a aterros.",
              "prioridade": "Médio prazo"
            }
          ]
        }
      ]
    },
    {
      "id": "vida_util",
      "titulo": "VIDA ÚTIL DO PRODUTO - ETAPA 4",
      "descricao": "A vida útil do produto refere-se às características do produto, tais como durabilidade, segurança e qualidade do alimento. A medição da vida útil do produto é importante, pois o aumento da mesma contribui para o crescimento das vendas, reduzindo o desperdício, diminuindo as devoluções e permitindo o atendimento a mercados mais distantes.",
      "pergunta": "",
      "type": "grouped_single_choice",
      "subsections": [
        {
          "id": "q7",
          "titulo": "Questão Q7",
          "pergunta": "A vida útil do produto (shelf life) indica o período entre a produção do leite, a fabricação do produto e o vencimento final. Sua empresa ou fornecedores utilizam sistemas que garantem o rastreamento até o consumidor final?",
          "options": [
            {
              "id": "q7_01",
              "texto": "A) Sim",
              "pontuacao": 2,
              "recomendacao": "Manter as tecnologias e controles de vida útil e cadeia fria e acompanhar temperatura, perdas e ocorrências ao longo da distribuição.",
              "prioridade": "Médio prazo"
            },
            {
              "id": "q7_02",
              "texto": "B) Não aplicável, não, não sei etc.",
              "pontuacao": 0,
              "recomendacao": "Mapear pontos críticos da cadeia fria e implantar controles de temperatura, rastreamento e resposta a desvios para reduzir perdas.",
              "prioridade": "Curto prazo"
            }
          ]
        },
        {
          "id": "q8",
          "titulo": "Questão Q8",
          "pergunta": "Alimentos deterioram-se rapidamente devido à proliferação bacteriana. Você ou seu fornecedor dispõem de testes ou medidas de controle que garantam a durabilidade do produto aumentando a vida útil do produto?",
          "options": [
            {
              "id": "q8_01",
              "texto": "A) Sim",
              "pontuacao": 2,
              "recomendacao": "Manter as medidas de eficiência da cadeia fria e acompanhar consumo de energia, perdas de matéria-prima e desempenho logístico.",
              "prioridade": "Médio prazo"
            },
            {
              "id": "q8_02",
              "texto": "B) Não aplicável, não, não sei etc.",
              "pontuacao": 0,
              "recomendacao": "Avaliar refrigeração, transporte e perdas desde a fazenda e definir medidas e indicadores para melhorar eficiência e segurança alimentar.",
              "prioridade": "Curto prazo"
            }
          ]
        },
        {
          "id": "q9",
          "titulo": "Questão Q9",
          "pergunta": "A empresa adota práticas como a etiqueta de Identificação Geográfica, Selos e Certificações, visando à valorização da qualidade do produto?",
          "options": [
            {
              "id": "q9_01",
              "texto": "A) Sim",
              "pontuacao": 2,
              "recomendacao": "Manter a política de vida útil, os padrões de qualidade e as especificações de processo e revisar os resultados periodicamente.",
              "prioridade": "Médio prazo"
            },
            {
              "id": "q9_02",
              "texto": "C) Não sei. Não aplicável.",
              "pontuacao": 0,
              "recomendacao": "Levantar os controles e padrões existentes e definir responsáveis, procedimentos e indicadores para a política de vida útil do produto.",
              "prioridade": "Curto prazo"
            }
          ]
        }
      ]
    },
    {
      "id": "monitoramento",
      "titulo": "MONITORAMENTO - ETAPA 5",
      "descricao": "O monitoramento engloba os serviços pós-venda, incluindo rastreabilidade e obtenção de feedbacks dos clientes. A medição é fundamental para acompanhar a jornada do produto, desde o produtor de leite até a gôndola, e analisar o comportamento do cliente, garantindo a máxima qualidade e a confiança na marca.",
      "pergunta": "",
      "type": "grouped_single_choice",
      "subsections": [
        {
          "id": "q10",
          "titulo": "Questão Q10",
          "pergunta": "Monitoramento da saúde do consumidor: a documentação e as informações do produto, incluindo a composição e os ingredientes utilizados, são facilmente acessíveis e compreensíveis para o consumidor final?",
          "options": [
            {
              "id": "q10_01",
              "texto": "A) Sim",
              "pontuacao": 2,
              "recomendacao": "Manter a documentação e as informações sobre materiais e composição atualizadas, acessíveis e compreensíveis para o consumidor.",
              "prioridade": "Médio prazo"
            },
            {
              "id": "q10_02",
              "texto": "B) Não aplicável, não, não sei etc.",
              "pontuacao": 0,
              "recomendacao": "Revisar rótulos e materiais informativos e verificar se composição e informações essenciais estão disponíveis e fáceis de entender.",
              "prioridade": "Curto prazo"
            }
          ]
        },
        {
          "id": "q11",
          "titulo": "Questão Q11",
          "pergunta": "Serviços pós-venda: a empresa possui mecanismos de monitoramento pós-venda para identificar a localização e o perfil dos consumidores dos produtos? Essa prática pode otimizar os seus processos e a comunicação e o marketing de mercado.",
          "options": [
            {
              "id": "q11_01",
              "texto": "A) Sim",
              "pontuacao": 2,
              "recomendacao": "Manter indicadores de rastreabilidade do ciclo de vida e usar os dados pós-venda para orientar melhorias e comunicação com o mercado.",
              "prioridade": "Médio prazo"
            },
            {
              "id": "q11_02",
              "texto": "B) Não aplicável, não, não sei etc.",
              "pontuacao": 0,
              "recomendacao": "Mapear os registros do ciclo de vida e definir indicadores que conectem produção, distribuição e informações pós-venda.",
              "prioridade": "Curto prazo"
            }
          ]
        },
        {
          "id": "q12",
          "titulo": "Questão Q12",
          "pergunta": "Valorização das certificações: você comunica que pode oferecer apoio ao cliente em relação à qualidade do produto? Essa prática pode contribuir para a fidelização do cliente.",
          "options": [
            {
              "id": "q12_01",
              "texto": "A) Sim",
              "pontuacao": 2,
              "recomendacao": "Manter e comunicar os canais de pós-venda e o apoio ao cliente sobre qualidade e certificações, aproveitando o retorno recebido.",
              "prioridade": "Médio prazo"
            },
            {
              "id": "q12_02",
              "texto": "B) Não, não aplicável, não, não sei etc.",
              "pontuacao": 0,
              "recomendacao": "Definir como oferecer apoio ao cliente, documentar informações de qualidade e certificação e estabelecer um canal para dúvidas e retorno.",
              "prioridade": "Curto prazo"
            }
          ]
        }
      ]
    }
  ]
};
