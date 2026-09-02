window.foodQuestionnaireFallback = {
  "metadata": {
    "titulo": "Autodiagnóstico de Circularidade para Alimentos",
    "data": "2026-09-01",
    "versao": "v3-alimentos",
    "idioma": "pt-BR",
    "setor": "alimentos",
    "escala_pontuacao": {
      "2": "prática mais aderente à circularidade",
      "1": "prática intermediária ou parcial",
      "0": "prática de baixa circularidade ou desconhecida"
    }
  },
  "sections": [
    {
      "id": "entrada",
      "titulo": "Etapa 1 - Entrada",
      "pergunta": "Quais são as principais matérias-primas e ingredientes utilizados na fabricação do alimento?",
      "type": "single_choice",
      "options": [
        { "id": "etapa1_01", "texto": "Utilizamos majoritariamente matérias-primas e ingredientes com origem rastreável, fornecedores formalizados e critérios de qualidade e conformidade.", "pontuacao": 2, "recomendacao": "Parabéns, você alcançou a pontuação máxima. Manter a rastreabilidade de origem e a conformidade dos fornecedores." },
        { "id": "etapa1_02", "texto": "O alimento utiliza predominantemente matérias-primas, ingredientes ou subprodutos provenientes do aproveitamento de outros processos produtivos compatíveis com a segurança dos alimentos.", "pontuacao": 2, "recomendacao": "Parabéns, você alcançou a pontuação máxima. Ampliar o uso seguro e rastreável de matérias-primas circulares." },
        { "id": "etapa1_03", "texto": "Utilizamos majoritariamente insumos comprados de fornecedores convencionais com controle básico de qualidade, porém sem rastreabilidade ou certificação de origem consistente.", "pontuacao": 1 },
        { "id": "etapa1_04", "texto": "Não existe uma política definida sobre a origem e o perfil das matérias-primas e ingredientes, mas estamos trabalhando para isso.", "pontuacao": 1 },
        { "id": "etapa1_05", "texto": "Não sei informar ou não se aplica.", "pontuacao": 0 }
      ]
    },
    {
      "id": "gestao_residuos",
      "titulo": "Etapa 2 - Gestão de Resíduos",
      "pergunta": "Como a empresa trata os resíduos, perdas e subprodutos gerados nos processos de fabricação de alimentos?",
      "type": "single_choice",
      "options": [
        { "id": "etapa2_01", "texto": "A maioria dos resíduos, perdas e rejeitos segue para descarte sem valorização relevante, como disposição em aterros sanitários.", "pontuacao": 0 },
        { "id": "etapa2_02", "texto": "A maioria dos resíduos, perdas e subprodutos é destinada principalmente a reciclagem, reuso, reaproveitamento, compostagem ou outra valorização adequada e rastreável.", "pontuacao": 2, "recomendacao": "Parabéns, você alcançou a pontuação máxima. Consolidar a segregação, a documentação e a valorização segura dos resíduos e subprodutos." },
        { "id": "etapa2_03", "texto": "Partes relevantes dos resíduos ou subprodutos são destinadas à recuperação energética ou a outras formas controladas de valorização.", "pontuacao": 1 },
        { "id": "etapa2_04", "texto": "Não sei informar ou não se aplica.", "pontuacao": 0 }
      ]
    },
    {
      "id": "saida_produto",
      "titulo": "Etapa 3 - Saída do Produto (fim de vida)",
      "pergunta": "Considere os materiais da embalagem e o destino final do produto no mercado.",
      "type": "grouped_single_choice",
      "subsections": [
        {
          "id": "etapa3_reciclagem",
          "titulo": "Reciclabilidade da embalagem",
          "pergunta": "A embalagem utilizada tem potencial de reciclagem e informações para orientar adequadamente o consumidor sobre seu destino final?",
          "options": [
            { "id": "etapa3_01", "texto": "Sim.", "pontuacao": 2, "recomendacao": "Parabéns, você alcançou a pontuação máxima. Manter a reciclabilidade e as informações de destinação da embalagem." },
            { "id": "etapa3_02", "texto": "Não.", "pontuacao": 0 },
            { "id": "etapa3_03", "texto": "Não sei informar ou não se aplica.", "pontuacao": 0 }
          ]
        },
        {
          "id": "etapa3_logistica_reversa",
          "titulo": "Logística reversa",
          "pergunta": "No destino final, a embalagem possui soluções para separação, retorno ou reaproveitamento dos materiais, favorecendo a logística reversa?",
          "options": [
            { "id": "etapa3_04", "texto": "Sim.", "pontuacao": 2, "recomendacao": "Parabéns, você alcançou a pontuação máxima. Manter e ampliar o retorno, a separação e o reaproveitamento dos materiais." },
            { "id": "etapa3_05", "texto": "Não.", "pontuacao": 0 },
            { "id": "etapa3_06", "texto": "Não sei informar ou não se aplica.", "pontuacao": 0 }
          ]
        },
        {
          "id": "etapa3_aterro",
          "titulo": "Destino final",
          "pergunta": "Os materiais das embalagens são destinados principalmente a descarte em aterros sanitários?",
          "options": [
            { "id": "etapa3_07", "texto": "Sim.", "pontuacao": 0 },
            { "id": "etapa3_08", "texto": "Não.", "pontuacao": 2, "recomendacao": "Parabéns, você alcançou a pontuação máxima. Manter os destinos circulares atuais e monitorar os fluxos para evitar aterros." },
            { "id": "etapa3_09", "texto": "Não sei informar ou não se aplica.", "pontuacao": 0 }
          ]
        }
      ]
    },
    {
      "id": "vida_util",
      "titulo": "Etapa 4 - Vida Útil, Conservação e Prevenção de Perdas",
      "pergunta": "Considere os controles de qualidade, conservação, armazenamento e distribuição do alimento.",
      "type": "grouped_single_choice",
      "subsections": [
        {
          "id": "etapa4_vida_util",
          "titulo": "Vida útil e conservação",
          "pergunta": "A empresa utiliza controles, tecnologias ou procedimentos que preservam a qualidade e ampliam a vida útil do alimento dentro dos requisitos de segurança dos alimentos?",
          "options": [
            { "id": "etapa4_01", "texto": "Sim.", "pontuacao": 2, "recomendacao": "Parabéns, você alcançou a pontuação máxima. Manter os controles de qualidade e conservação para reduzir perdas." },
            { "id": "etapa4_02", "texto": "Não.", "pontuacao": 0 },
            { "id": "etapa4_03", "texto": "Não sei informar ou não se aplica.", "pontuacao": 0 }
          ]
        },
        {
          "id": "etapa4_armazenamento",
          "titulo": "Armazenamento e transporte",
          "pergunta": "A empresa ou seus fornecedores monitoram as condições de armazenamento e transporte, incluindo temperatura quando aplicável, para reduzir perdas e manter a segurança dos alimentos?",
          "options": [
            { "id": "etapa4_04", "texto": "Sim.", "pontuacao": 2, "recomendacao": "Parabéns, você alcançou a pontuação máxima. Manter os controles de armazenamento e transporte e ampliar a prevenção de perdas." },
            { "id": "etapa4_05", "texto": "Não.", "pontuacao": 0 },
            { "id": "etapa4_06", "texto": "Não sei informar ou não se aplica.", "pontuacao": 0 }
          ]
        },
        {
          "id": "etapa4_politica",
          "titulo": "Política de prevenção de perdas",
          "pergunta": "Existe uma política interna sobre vida útil, qualidade, conservação e prevenção de perdas?",
          "options": [
            { "id": "etapa4_07", "texto": "Sim.", "pontuacao": 2, "recomendacao": "Parabéns, você alcançou a pontuação máxima. Manter a política de vida útil, qualidade e prevenção de perdas." },
            { "id": "etapa4_08", "texto": "Não, porém estamos trabalhando nisso.", "pontuacao": 1 },
            { "id": "etapa4_09", "texto": "Não sei informar ou não se aplica.", "pontuacao": 0 }
          ]
        }
      ]
    },
    {
      "id": "monitoramento",
      "titulo": "Etapa 5 - Monitoramento e Extensão do Ciclo de Vida do Produto",
      "pergunta": "Considere as informações ao consumidor, a rastreabilidade e o atendimento após a venda.",
      "type": "grouped_single_choice",
      "subsections": [
        {
          "id": "etapa5_informacoes",
          "titulo": "Informações ao consumidor",
          "pergunta": "As informações do alimento e da embalagem são facilmente acessíveis e fáceis de entender para o consumidor final?",
          "options": [
            { "id": "etapa5_01", "texto": "Sim.", "pontuacao": 2, "recomendacao": "Parabéns, você alcançou a pontuação máxima. Manter informações claras sobre o alimento, a embalagem e seu descarte." },
            { "id": "etapa5_02", "texto": "Não.", "pontuacao": 0 },
            { "id": "etapa5_03", "texto": "Não sei informar ou não se aplica.", "pontuacao": 0 }
          ]
        },
        {
          "id": "etapa5_rastreabilidade",
          "titulo": "Rastreabilidade",
          "pergunta": "A empresa possui rastreabilidade do alimento por lote ou cadeia, permitindo acompanhar fornecedores, produção, distribuição e eventuais ações corretivas?",
          "options": [
            { "id": "etapa5_04", "texto": "Sim.", "pontuacao": 2, "recomendacao": "Parabéns, você alcançou a pontuação máxima. Manter os indicadores de rastreabilidade e usar os dados para melhorar os processos." },
            { "id": "etapa5_05", "texto": "Não.", "pontuacao": 0 },
            { "id": "etapa5_06", "texto": "Não sei informar ou não se aplica.", "pontuacao": 0 }
          ]
        },
        {
          "id": "etapa5_atendimento",
          "titulo": "Atendimento e pós-venda",
          "pergunta": "A empresa oferece orientação e atendimento ao cliente sobre qualidade, conservação, uso, reclamações e informações do alimento?",
          "options": [
            { "id": "etapa5_07", "texto": "Sim.", "pontuacao": 2, "recomendacao": "Parabéns, você alcançou a pontuação máxima. Manter os canais de atendimento e o apoio ao cliente." },
            { "id": "etapa5_08", "texto": "Não.", "pontuacao": 0 },
            { "id": "etapa5_09", "texto": "Não sei informar ou não se aplica.", "pontuacao": 0 }
          ]
        }
      ]
    }
  ]
};
