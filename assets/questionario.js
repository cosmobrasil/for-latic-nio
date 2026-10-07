const apiBaseUrl = window.APP_CONFIG?.apiBaseUrl || "http://localhost:3001";
const steps = ["consent", "company", "questions", "report"];

const consentPanel = document.querySelector("#consent-panel");
const consentCheckbox = document.querySelector("#consent-checkbox");
const consentButton = document.querySelector("#consent-button");

const form = document.querySelector("#assessment-form");
const companyPanel = document.querySelector("#company-panel");
const questionsPanel = document.querySelector("#questions-panel");
const questionsRoot = document.querySelector("#questions-root");
const questionsStatus = document.querySelector("#questions-status");
const reportPanel = document.querySelector("#report-panel");
const flowIndicator = document.querySelector("#flow-indicator");

const companyBackBtn = document.querySelector("#company-back-btn");
const companyNextBtn = document.querySelector("#company-next-btn");
const questionsBackBtn = document.querySelector("#questions-back-btn");

const companyLookupStatus = document.querySelector("#company-lookup-status");
const lookupCompanyButton = document.querySelector("#lookup-company-button");
const documentInput = form.querySelector('input[name="document"]');
const legalNameInput = form.querySelector('input[name="legalName"]');
const responsibleNameInput = form.querySelector('input[name="responsibleName"]');
const cityInput = form.querySelector('input[name="city"]');
const stateInput = form.querySelector('input[name="state"]');
const segmentInput = form.querySelector('input[name="segment"]');
const productInput = form.querySelector('input[name="product"]');
const phoneInput = form.querySelector('input[name="phone"]');
const emailInput = form.querySelector('input[name="email"]');

const questionnaireFallback = window.foodQuestionnaireFallback;

let recommendationCatalog = {};

const stagePresentation = {
  entrada: {
    titulo: "ORIGEM E TIPOLOGIA DAS MATÉRIAS-PRIMAS - ETAPA 1",
  },
  gestao_residuos: {
    titulo: "GESTÃO INTERNA DE RESÍDUOS - ETAPA 2",
  },
  saida_produto: {
    titulo: "EMBALAGEM (FIM DE VIDA) - ETAPA 3",
  },
  vida_util: {
    titulo: "VIDA ÚTIL DO PRODUTO - ETAPA 4",
  },
  monitoramento: {
    titulo: "MONITORAMENTO - ETAPA 5",
  }
};

function applyStagePresentation(target) {
  for (const section of target.sections || []) {
    const presentation = stagePresentation[section.stageId || section.id];
    if (presentation) {
      section.titulo = presentation.titulo;
    }
  }
  return target;
}

function applyRecommendationCatalog(target) {
  for (const section of target.sections || []) {
    const definitions = section.subsections || [section];
    for (const definition of definitions) {
      for (const option of definition.options || []) {
        const catalogItem = recommendationCatalog[option.id];
        if (catalogItem) {
          option.recomendacao = catalogItem.recomendacao;
          option.prioridade = catalogItem.prioridade;
        }
      }
    }
  }
  return target;
}

const CNPJ_ERROR_MESSAGE = "Confira o número do CNPJ e preencha as informações abaixo.";
const CNPJ_API_UNAVAILABLE = "APIs de consulta indisponíveis no momento. Preencha os dados manualmente e continue.";

let questionnaire = questionnaireFallback;
let currentStep = "consent";

const reportStageConfig = {
  entrada: { label: "Entrada", theme: "theme-blue" },
  gestao_residuos: { label: "Gestão de resíduos", theme: "theme-orange" },
  saida_produto: { label: "Embalagem e fim de vida", theme: "theme-blue" },
  vida_util: { label: "Vida útil", theme: "theme-green" },
  monitoramento: { label: "Monitoramento", theme: "theme-neutral" }
};

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function normalizeDocument(value) {
  return String(value || "").replace(/\D/g, "");
}

function formatPercent(value) {
  return `${Math.round(Number(value || 0))}%`;
}

function formatDateTime(value) {
  const date = value ? new Date(value) : new Date();
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short"
  }).format(date);
}

function slugify(value) {
  return String(value || "relatorio")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function formatCnpj(value) {
  const digits = normalizeDocument(value).slice(0, 14);
  return digits
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");
}

function flattenDefinitions() {
  return questionnaire.sections.flatMap((section) => {
    if (section.type === "grouped_single_choice") {
      return section.subsections.map((subsection) => ({
        key: subsection.id,
        stageId: section.id,
        stageTitle: section.titulo,
        title: subsection.titulo,
        prompt: subsection.pergunta || section.pergunta,
        options: subsection.options
      }));
    }

    return [
      {
        key: section.id,
        stageId: section.stageId || section.id,
        stageTitle: section.titulo,
        title: section.titulo,
        prompt: section.pergunta,
        options: section.options
      }
    ];
  });
}

function getStageIdForAnswerKey(answerKey) {
  for (const section of questionnaire.sections) {
    if (section.type === "grouped_single_choice") {
      if (section.subsections.some((subsection) => subsection.id === answerKey)) {
        return section.id;
      }
      continue;
    }

    if (section.id === answerKey) {
      return section.stageId || section.id;
    }
  }

  return answerKey;
}

async function loadQuestionnaire() {
  try {
    const [response, recommendationsResponse] = await Promise.all([
      fetch("./assets/questionnaire.json"),
      fetch("./assets/recommendations.json")
    ]);
    if (response.ok) {
      questionnaire = await response.json();
    }
    if (recommendationsResponse.ok) {
      recommendationCatalog = await recommendationsResponse.json();
    }
    applyRecommendationCatalog(questionnaireFallback);
    applyRecommendationCatalog(questionnaire);
    applyStagePresentation(questionnaireFallback);
    applyStagePresentation(questionnaire);
  } catch (error) {
    console.warn("Questionário local indisponível, usando fallback.", error);
    applyRecommendationCatalog(questionnaireFallback);
    applyStagePresentation(questionnaireFallback);
    questionnaire = questionnaireFallback;
  }
}

function setActiveStep(step) {
  currentStep = step;
  const isConsent = step === "consent";
  const isCompany = step === "company";
  const isQuestions = step === "questions";
  const isReport = step === "report";

  consentPanel.classList.toggle("hidden", !isConsent);
  form.classList.toggle("hidden", isConsent || isReport);
  companyPanel.classList.toggle("hidden", !isCompany);
  questionsPanel.classList.toggle("hidden", !isQuestions);
  reportPanel.classList.toggle("hidden", !isReport);

  flowIndicator.querySelectorAll(".flow-step").forEach((item) => {
    const itemStep = item.dataset.step;
    const itemIndex = steps.indexOf(itemStep);
    const currentIndex = steps.indexOf(step);
    item.classList.toggle("is-active", itemStep === step);
    item.classList.toggle("is-complete", itemIndex < currentIndex);
  });

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderInlineStatus(element, kind, message) {
  element.textContent = message;
  element.className = `inline-status ${kind}`;
  element.classList.remove("hidden");
}

function readCompanyFormData() {
  return {
    legalName: legalNameInput.value.trim(),
    document: documentInput.value.trim(),
    city: cityInput.value.trim(),
    state: stateInput.value.trim().toUpperCase(),
    segment: segmentInput.value.trim(),
    responsibleName: responsibleNameInput.value.trim(),
    product: productInput.value.trim(),
    phone: phoneInput.value.trim(),
    email: emailInput.value.trim()
  };
}

function hideInlineStatus(element) {
  element.classList.add("hidden");
}

function validateCompanyStep() {
  hideInlineStatus(companyLookupStatus);
  return true;
}

function validateQuestions() {
  const firstMissing = flattenDefinitions().find((definition) => !form.querySelector(`input[name="${definition.key}"]:checked`));

  if (!firstMissing) {
    hideInlineStatus(questionsStatus);
    return true;
  }

  renderInlineStatus(
    questionsStatus,
    "status-error",
    `Responda à pergunta do bloco ${firstMissing.stageTitle}: ${firstMissing.title}.`
  );

  const target = document.querySelector(`[data-question-key="${firstMissing.key}"]`);
  if (target) {
    target.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  return false;
}

function syncSelectedOptionCards() {
  questionsRoot.querySelectorAll(".option-card").forEach((card) => {
    const radio = card.querySelector('input[type="radio"]');
    card.classList.toggle("selected", Boolean(radio?.checked));
  });
}

function renderQuestionBlock(definition) {
  return `
    <article class="question-block" data-question-key="${escapeHtml(definition.key)}">
      <div class="question-copy">
        <p class="question-kicker">${escapeHtml(definition.title)}</p>
        <h3>${escapeHtml(definition.prompt)}</h3>
      </div>
      <div class="option-card-grid">
        ${definition.options
          .map(
            (option) => `
              <label class="option-card">
                <input type="radio" name="${escapeHtml(definition.key)}" value="${escapeHtml(option.id)}" />
                <span class="option-card-text">${escapeHtml(option.texto)}</span>
              </label>
            `
          )
          .join("")}
      </div>
    </article>
  `;
}

function renderQuestions() {
  questionsRoot.innerHTML = questionnaire.sections
    .map((section) => {
      if (section.type === "grouped_single_choice") {
        return `
          <section class="question-stage stack">
            <div class="stage-header">
              <p class="eyebrow">${escapeHtml(section.titulo)}</p>
              <p class="stage-description">${escapeHtml(section.descricao || "")}</p>
              ${section.pergunta ? `<h2>${escapeHtml(section.pergunta)}</h2>` : ""}
            </div>
            ${section.subsections
              .map((subsection) =>
                renderQuestionBlock({
                  key: subsection.id,
                  stageId: section.id,
                  stageTitle: section.titulo,
                  title: subsection.titulo,
                  prompt: subsection.pergunta || subsection.titulo,
                  options: subsection.options
                })
              )
              .join("")}
          </section>
        `;
      }

      return `
        <section class="question-stage stack">
          <div class="stage-header">
            <p class="eyebrow">${escapeHtml(section.titulo)}</p>
            <p class="stage-description">${escapeHtml(section.descricao || "")}</p>
          </div>
          ${renderQuestionBlock({
            key: section.id,
            stageId: section.id,
            stageTitle: section.titulo,
            title: section.titulo,
            prompt: section.pergunta,
            options: section.options
          })}
        </section>
      `;
    })
    .join("");
}

async function lookupCompanyByDocument() {
  const document = normalizeDocument(documentInput.value);

  if (document.length !== 14) {
    renderInlineStatus(companyLookupStatus, "status-warning", CNPJ_ERROR_MESSAGE);
    return;
  }

  renderInlineStatus(companyLookupStatus, "status-warning", "Consultando os dados do CNPJ...");

  try {
    const response = await fetchComTimeout(`${apiBaseUrl}/api/company/lookup?document=${encodeURIComponent(document)}`);
    const data = await response.json().catch(() => null);

    if (!response.ok || !data?.found || !data?.company) {
      console.warn("Falha na consulta de CNPJ:", {
        status: response.status,
        responseOk: response.ok,
        data
      });
      renderInlineStatus(companyLookupStatus, "status-info", CNPJ_API_UNAVAILABLE);
      return;
    }

    documentInput.value = formatCnpj(data.company.document || document);
    legalNameInput.value = data.company.legalName || legalNameInput.value;
    cityInput.value = data.company.city || cityInput.value;
    stateInput.value = data.company.state || stateInput.value;
    segmentInput.value = data.company.segment || segmentInput.value;
    responsibleNameInput.value = data.company.responsibleName || responsibleNameInput.value;
    productInput.value = data.company.product || productInput.value;
    phoneInput.value = data.company.phone || phoneInput.value;
    emailInput.value = data.company.email || emailInput.value;

    renderInlineStatus(
      companyLookupStatus,
      "status-success",
      `Dados preenchidos a partir da fonte ${data.source === "empresaqui" ? "EmpresAqui" : "local"}.`
    );
  } catch (error) {
    console.error("Erro na consulta de CNPJ:", error);
    renderInlineStatus(companyLookupStatus, "status-info", CNPJ_API_UNAVAILABLE);
  }
}

function computeLocalReport(answers) {
  const definitions = flattenDefinitions();
  const stageMap = new Map();
  const detailedAnswers = [];
  let total = 0;
  let max = 0;
  let unknown = 0;

  for (const definition of definitions) {
    const option = definition.options.find((item) => item.id === answers[definition.key]);
    const stageId = getStageIdForAnswerKey(definition.key);
    const stageTitle =
      questionnaire.sections.find((section) => section.id === stageId)?.titulo || definition.title;
    const maxScore = Math.max(...definition.options.map((item) => item.pontuacao));

    total += option.pontuacao;
    max += maxScore;

    if (option.texto.toLowerCase().includes("nao sei")) {
      unknown += 1;
    }

    if (!stageMap.has(stageId)) {
      stageMap.set(stageId, {
        stageId,
        stageTitle,
        score: 0,
        maxScore: 0
      });
    }

    const stage = stageMap.get(stageId);
    stage.score += option.pontuacao;
    stage.maxScore += maxScore;

    detailedAnswers.push({
      key: definition.key,
      stageId,
      stageTitle,
      prompt: definition.prompt,
      selectedOptionId: option.id,
      selectedText: option.texto,
      score: option.pontuacao,
      maxScore,
      recommendation: option.recomendacao || null
    });
  }

  const stageScores = Array.from(stageMap.values()).map((stage) => ({
    ...stage,
    percentage: Number(((stage.score / stage.maxScore) * 100).toFixed(2))
  }));

  stageScores.sort((left, right) => left.percentage - right.percentage);

  const igc = Number(((total / max) * 100).toFixed(2));
  const pcm = Number((total / definitions.length).toFixed(2));

  return {
    answersCount: definitions.length,
    igc,
    pcm,
    band: igc >= 80 ? "Avançado" : igc >= 60 ? "Estruturado" : igc >= 40 ? "Em transição" : "Inicial",
    confidence: Number((100 - (unknown / definitions.length) * 100).toFixed(2)),
    notKnownRate: Number(((unknown / definitions.length) * 100).toFixed(2)),
    stageScores,
    strengths: stageScores.filter((stage) => stage.percentage >= 75).map((stage) => stage.stageTitle),
    opportunities: stageScores.filter((stage) => stage.percentage < 60).map((stage) => stage.stageTitle),
    detailedAnswers,
    aiNarrative: {
      text: "",
      source: "fallback"
    }
  };
}

function getStageScoreMap(report) {
  return new Map((report.stageScores || []).map((stage) => [stage.stageId, stage]));
}

function computeMaterialsProfile(report) {
  const relevantStageIds = ["entrada", "gestao_residuos", "vida_util", "saida_produto"];
  const relevantAnswers = (report.detailedAnswers || []).filter((item) => relevantStageIds.includes(item.stageId));

  if (relevantAnswers.length) {
    const totalScore = relevantAnswers.reduce((sum, item) => sum + Number(item.score || 0), 0);
    const totalMax = relevantAnswers.reduce((sum, item) => sum + Number(item.maxScore || 0), 0);
    return totalMax ? Math.round((totalScore / totalMax) * 100) : 0;
  }

  const stageMap = getStageScoreMap(report);
  const relevantStages = relevantStageIds.map((stageId) => stageMap.get(stageId)).filter(Boolean);
  if (!relevantStages.length) {
    return 0;
  }

  const weightedScore = relevantStages.reduce((sum, stage) => sum + Number(stage.score || 0), 0);
  const weightedMax = relevantStages.reduce((sum, stage) => sum + Number(stage.maxScore || 0), 0);
  return weightedMax ? Math.round((weightedScore / weightedMax) * 100) : 0;
}

function computeScoreTotals(report) {
  if (report.detailedAnswers?.length) {
    return {
      totalScore: report.detailedAnswers.reduce((sum, item) => sum + Number(item.score || 0), 0),
      totalMaxScore: report.detailedAnswers.reduce((sum, item) => sum + Number(item.maxScore || 0), 0)
    };
  }

  return {
    totalScore: Math.round(Number(report.pcm || 0) * Number(report.answersCount || 0)),
    totalMaxScore: Number(report.answersCount || 0) * 2
  };
}

function getStageDisplayData(report) {
  const stageMap = getStageScoreMap(report);
  return ["entrada", "gestao_residuos", "saida_produto", "vida_util", "monitoramento"]
    .map((stageId) => {
      const stage = stageMap.get(stageId);
      if (!stage) {
        return null;
      }
      return {
        stageId,
        label: reportStageConfig[stageId]?.label || stage.stageTitle,
        percentage: Math.round(Number(stage.percentage || 0)),
        title: stage.stageTitle,
        theme: reportStageConfig[stageId]?.theme || "theme-neutral"
      };
    })
    .filter(Boolean);
}

function getStageRecommendationItems(stageId, percentage) {
  const low = percentage < 60;
  switch (stageId) {
    case "entrada":
      return low
        ? [
            "Mapear fornecedores críticos e ampliar a rastreabilidade de origem.",
            "Definir critérios de compra com menor impacto e melhor conformidade."
          ]
        : ["Manter o nível atual e ampliar a participação de materiais com menor impacto."];
    case "gestao_residuos":
      return low
        ? [
            "Otimizar a triagem, a documentação e a rastreabilidade de resíduos.",
            "Elevar o reaproveitamento seguro de subprodutos do processo."
          ]
        : ["Consolidar a rotina de segregação e valorização dos resíduos gerados."];
    case "saida_produto":
      return low
        ? [
            "Aplicar design para desmontagem e facilitar a separação de materiais.",
            "Aumentar a reciclabilidade dos materiais e simplificar composições.",
            "Avaliar alternativas à recuperação energética, priorizando a reciclagem."
          ]
        : ["Preservar destinos circulares e reforçar orientações de retorno e descarte."];
    case "vida_util":
      return low
        ? [
            "Testar a durabilidade e estabelecer garantias claras.",
            "Criar programas de reúso e reaproveitamento pós-uso."
          ]
        : ["Expandir iniciativas de durabilidade, reúso e suporte pós-venda."];
    case "monitoramento":
      return low
        ? [
            "Implementar rastreabilidade (QR Code, passaporte digital) para o ciclo de vida.",
            "Disponibilizar documentação clara ao consumidor sobre materiais e certificações."
          ]
        : ["Aprimorar o monitoramento e a comunicação para consolidar a confiança do usuário."];
    default:
      return ["Manter um plano de melhoria contínua para este bloco."];
  }
}

function buildRecommendationsByCategory(report) {
  const recommendationsByStage = new Map();
  for (const answer of report.detailedAnswers || []) {
    const catalogItem = recommendationCatalog[answer.selectedOptionId];
    const recommendation = catalogItem?.recomendacao || answer.recommendation;
    if (!recommendation) continue;
    if (!recommendationsByStage.has(answer.stageId)) {
      recommendationsByStage.set(answer.stageId, []);
    }
    const priority = catalogItem?.prioridade || answer.priority;
    recommendationsByStage.get(answer.stageId).push(
      priority ? `${recommendation} (${priority})` : recommendation
    );
  }

  const stageScoreMap = getStageScoreMap(report);
  return getStageDisplayData(report).map((stage) => {
    const score = stageScoreMap.get(stage.stageId);
    const isMaximum = score && Number(score.score) >= Number(score.maxScore);
    return {
      ...stage,
      items: isMaximum
        ? ["Parabéns! Esta etapa atingiu a pontuação máxima. Mantenha as práticas que já funcionam bem."]
        : recommendationsByStage.get(stage.stageId) || ["Definir um plano de melhoria contínua para esta etapa."]
    };
  });
}

function buildReportModel(company, report, meta = {}) {
  const scoreTotals = computeScoreTotals(report);
  const stageCards = getStageDisplayData(report);
  const recommendations = buildRecommendationsByCategory(report);
  const materialsProfile = computeMaterialsProfile(report);
  const createdAt = meta.createdAt || new Date().toISOString();
  const reportId = meta.assessmentId || "local";
  const companyDisplay = {
    legalName: company.legalName || "Não informado",
    city: company.city || "Não informado",
    phone: company.phone || "Não informado",
    document: company.document || "Não informado",
    responsibleName: company.responsibleName || "Não informado",
    email: company.email || "Não informado",
    segment: company.segment || "Não informado",
    product: company.product || "Não informado"
  };

  return {
    reportId,
    createdAt,
    generatedLabel: formatDateTime(createdAt),
    generatedShortDate: formatDateTime(new Date()),
    company: companyDisplay,
    totalScore: scoreTotals.totalScore,
    totalMaxScore: scoreTotals.totalMaxScore,
    igc: Math.round(Number(report.igc || 0)),
    materialsProfile,
    band: report.band || "Não informado",
    confidence: Math.round(Number(report.confidence || 0)),
    notKnownRate: Math.round(Number(report.notKnownRate || 0)),
    aiNarrative: report.aiNarrative?.text || "",
    stageCards,
    recommendations,
    technicalNote:
      "Os percentuais obtidos nesse relatório não refletem uma classificação de “melhor” ou “pior”, mas funcionam como estímulo para melhorias contínuas nos processos produtivos, visando preparar a empresa para novos nichos de mercado internacionais.\n\nEste resultado está alinhado ao contexto da economia circular com parâmetros internacionais, visando preparar empresas e instituições na organização e abertura de novos nichos de mercado."
  };
}

function renderStageCardsMarkup(stageCards) {
  return stageCards
    .map(
      (stage) => `
        <article class="report-stage-card">
          <small>${escapeHtml(stage.label)}</small>
          <strong>${escapeHtml(formatPercent(stage.percentage))}</strong>
        </article>
      `
    )
    .join("");
}

function renderRecommendationsMarkup(recommendations) {
  return recommendations
    .map(
      (item) => `
        <article class="report-recommendation-card ${escapeHtml(item.theme)}">
          <h3>${escapeHtml(item.label)}</h3>
          <ul>${item.items.map((entry) => `<li>${escapeHtml(entry)}</li>`).join("")}</ul>
        </article>
      `
    )
    .join("");
}

function createReportDocumentMarkup(model) {
  const donutBackground = `conic-gradient(#16a34a 0 ${model.igc}%, #d9f6e6 ${model.igc}% 100%)`;

  return `
    <div class="report-preview">
      <div class="report-document">
        <section class="report-page report-page-results">
          <div class="report-topline">
            <span>Relatório de Circularidade</span>
            <span>${escapeHtml(model.generatedShortDate)}</span>
          </div>
          <header class="report-hero">
            <h1>Relatório de Circularidade</h1>
            <p class="report-meta">ID do Relatório: #${escapeHtml(model.reportId)} · Gerado em ${escapeHtml(model.generatedLabel)}</p>
          </header>
          <div class="report-cover-grid">
            <article class="report-box">
              <h2>Empresa</h2>
              <div class="report-company-list">
                <div><strong>Nome:</strong> ${escapeHtml(model.company.legalName)}</div>
                <div><strong>Cidade:</strong> ${escapeHtml(model.company.city)}</div>
                <div><strong>Celular:</strong> ${escapeHtml(model.company.phone)}</div>
                <div><strong>CNPJ:</strong> ${escapeHtml(model.company.document)}</div>
                <div><strong>Responsável:</strong> ${escapeHtml(model.company.responsibleName)}</div>
                <div><strong>E-mail:</strong> ${escapeHtml(model.company.email)}</div>
                <div><strong>Setor:</strong> ${escapeHtml(model.company.segment)}</div>
                <div><strong>Produto:</strong> ${escapeHtml(model.company.product)}</div>
              </div>
            </article>
            <article class="report-box report-box-accent">
              <h2>Resultado</h2>
              <div class="report-stat-list">
                <div><strong>Pontuação total:</strong> ${escapeHtml(String(model.totalScore))} de ${escapeHtml(String(model.totalMaxScore))} pontos</div>
                <div><strong>Índice de circularidade:</strong> ${escapeHtml(formatPercent(model.igc))}</div>
                <div><strong>Perfil de circularidade de materiais:</strong> ${escapeHtml(formatPercent(model.materialsProfile))}</div>
                <div><strong>Estágio:</strong> ${escapeHtml(model.band)}</div>
              </div>
              <div class="report-stage-cluster">
                <div class="donut-wrap">
                  <div class="donut-chart" style="background:${donutBackground}">
                    <div class="donut-center">${escapeHtml(formatPercent(model.igc))}<span>Índice de circularidade</span></div>
                  </div>
                </div>
                <div class="report-stage-grid">${renderStageCardsMarkup(model.stageCards)}</div>
              </div>
              <p class="report-summary-line">Circularidade alcançada: ${escapeHtml(formatPercent(model.igc))} · Potencial de melhoria: ${escapeHtml(formatPercent(100 - model.igc))}</p>
              <div class="report-info-card">
                <h3>O que é o Índice Global de Circularidade?</h3>
                <p>É a pontuação principal que mede o quanto a sua empresa e o seu produto avaliado já incorporam os princípios da Economia Circular na prática. Ele reflete a sua eficiência no uso de matérias-primas renováveis, no prolongamento da vida útil dos produtos e na gestão correta dos resíduos em todo o ciclo de produção.</p>
              </div>
            </article>
          </div>
          <div class="report-footer">
            <span></span>
            <span>Página 1 de 4</span>
          </div>
        </section>
        <section class="report-page report-page-recommendations">
          <div class="report-topline">
            <span>Relatório de Circularidade</span>
            <span>${escapeHtml(model.generatedShortDate)}</span>
          </div>
          <div class="report-grid" style="margin-top: 1.5rem;">
            <div></div>
            <article class="report-box report-box-accent">
              <h2>O que é o Perfil de Circularidade de Materiais?</h2>
              <p>É a síntese da circularidade dos materiais do produto avaliado, combinando a origem da matéria-prima, a gestão de resíduos e os desfechos de fim de vida mais relevantes. O cálculo transforma o questionário em um indicador único, de leitura mais direta para o usuário.</p>
            </article>
          </div>
          <section style="margin-top: 2rem;">
            <h2>Recomendações personalizadas</h2>
            <div class="report-recommendation-grid">${renderRecommendationsMarkup(model.recommendations.slice(0, 3))}</div>
          </section>
          <div class="report-footer">
            <span></span>
            <span>Página 2 de 4</span>
          </div>
        </section>
        <section class="report-page report-page-recommendations">
          <div class="report-topline">
            <span>Relatório de Circularidade</span>
            <span>${escapeHtml(model.generatedShortDate)}</span>
          </div>
          <section style="margin-top: 1.8rem;">
            <p class="report-section-kicker">Recomendações personalizadas</p>
            <h2>Continuação das recomendações</h2>
            <div class="report-recommendation-grid">${renderRecommendationsMarkup(model.recommendations.slice(3))}</div>
          </section>
          <div class="report-footer">
            <span></span>
            <span>Página 3 de 4</span>
          </div>
        </section>
        <section class="report-page report-page-notes">
          <div class="report-topline">
            <span>Relatório de Circularidade</span>
            <span>${escapeHtml(model.generatedShortDate)}</span>
          </div>
          <article class="report-note-card" style="margin-top:1.8rem;">
            <h2>Observações Técnicas - Importante: interpretação dos resultados</h2>
            <p>${escapeHtml(model.technicalNote).replaceAll("\n", "<br /><br />")}</p>
          </article>
          ${model.aiNarrative ? `
          <article class="report-note-card">
            <h2>Leitura Executiva</h2>
            <p>${escapeHtml(model.aiNarrative)}</p>
          </article>
          ` : ""}
          <div class="report-footer">
            <span></span>
            <span>Página 4 de 4</span>
          </div>
        </section>
      </div>
    </div>
  `;
}

function buildDownloadableReportHtml(model) {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Relatório de Circularidade - ${escapeHtml(model.company.legalName)}</title>
  <style>
    body{margin:0;font-family:Arial,sans-serif;background:#f5f7fb;color:#1f2a3d;padding:24px}
    .report-document{max-width:920px;margin:0 auto;background:#fff;border-radius:28px;box-shadow:0 24px 60px rgba(15,23,42,.16);overflow:hidden}
    .report-page{padding:32px 38px 36px;page-break-after:always}
    .report-page + .report-page{border-top:1px solid #e6edf7;page-break-before:always}
    .report-page:last-child{page-break-after:auto}
    .report-topline,.report-footer{display:flex;justify-content:space-between;gap:16px;color:#41506a;font-size:14px}
    .report-footer{margin-top:28px}
    .report-hero{margin-top:28px}
    .report-hero h1{margin:0 0 10px;color:#182235;font-size:54px;line-height:1.03}
    .report-meta{color:#69768b;font-size:16px}
    .report-section-kicker{margin:0 0 7px;color:#b34d1f;font-size:12px;font-weight:800;letter-spacing:.08em;text-transform:uppercase}
    .report-grid{display:grid;grid-template-columns:1fr 1.05fr;gap:20px;margin-top:28px}
    .report-cover-grid{display:grid;grid-template-columns:1fr;gap:20px;margin-top:28px}
    .report-box{border:1px solid #d7e1ef;border-radius:22px;padding:22px;background:#fff}
    .report-box-accent{border-color:#9fe7c8}
    .report-company-list,.report-stat-list{display:grid;gap:8px;color:#3c4b63;font-size:16px}
    .report-company-list strong,.report-stat-list strong{color:#182235}
    .report-stage-cluster{display:grid;grid-template-columns:148px 1fr;gap:16px;align-items:center;margin:18px 0}
    .report-stage-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
    .report-stage-card{border:1px solid #9fe7c8;border-radius:18px;padding:14px;color:#0b7a5b;background:#fbfffd}
    .report-stage-card small{display:block;font-size:12px;margin-bottom:6px;text-transform:uppercase}
    .report-stage-card strong{font-size:18px}
    .report-summary-line{color:#0b7a5b;font-size:16px;margin:16px 0 20px;text-align:center}
    .report-info-card{border-top:1px solid #9fe7c8;padding-top:18px;color:#0f5c49}
    .report-info-card p,.report-box p,.report-note-card p{line-height:1.45}
    .report-recommendation-grid{display:grid;grid-template-columns:1fr;gap:16px;margin-top:18px}
    .report-recommendation-card{border:1px solid #d7e1ef;border-radius:20px;padding:20px;background:#fff;break-inside:avoid}
    .report-recommendation-card ul{margin:0;padding-left:18px;color:#39475f}
    .report-recommendation-card li + li{margin-top:10px}
    .theme-blue{color:#2c46b4;border-color:#bfd0ff}
    .theme-orange{color:#b34d1f;border-color:#ffd1b7}
    .theme-green{color:#126b63;border-color:#9fe7dd}
    .report-note-card{margin-top:20px;border:1px solid #d7e1ef;border-radius:20px;padding:20px}
    .report-page-notes .report-note-card:first-of-type{border-color:#f2ae00;background:#fffdf4}
    .donut-wrap{width:148px;height:148px;border:1px solid #9fe7c8;border-radius:20px;display:grid;place-items:center;background:#fbfffd}
    .donut-chart{width:94px;height:94px;border-radius:50%;position:relative;background:conic-gradient(#16a34a 0 ${model.igc}%, #d9f6e6 ${model.igc}% 100%)}
    .donut-chart:after{content:"";position:absolute;inset:14px;background:#fff;border-radius:50%}
    .donut-center{position:absolute;inset:0;display:grid;place-items:center;text-align:center;z-index:1;font-size:13px;color:#0b7a5b;font-weight:700}
    .donut-center span{display:block;font-size:8px;font-weight:500}
    @page{size:A4;margin:0}
    @media print{body{padding:0;background:#fff}.report-document{box-shadow:none;border-radius:0}.report-page{min-height:297mm;box-sizing:border-box}}
  </style>
</head>
<body>
  ${createReportDocumentMarkup(model)}
</body>
</html>`;
}

function downloadReportHtml(model) {
  const html = buildDownloadableReportHtml(model);
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${slugify(model.company.legalName)}-relatorio-circularidade.html`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function renderReport(report, options = {}) {
  const reportStatus = options.status
    ? `
      <div class="inline-status ${escapeHtml(options.status.kind)}">
        ${escapeHtml(options.status.message)}
      </div>
    `
    : "";
  const enrichedReport = {
    ...report,
    detailedAnswers: (report.detailedAnswers || []).map((answer) => {
      const catalogItem = recommendationCatalog[answer.selectedOptionId];
      return catalogItem
        ? { ...answer, recommendation: catalogItem.recomendacao, priority: catalogItem.prioridade }
        : answer;
    })
  };
  const model = buildReportModel(options.company || readCompanyFormData(), enrichedReport, options.meta);

  reportPanel.innerHTML = `
    <div class="report-shell stack">
      <div>
        <p class="eyebrow">Relatório final</p>
        <h2>Documento final pronto para leitura e download</h2>
        <p class="lead">O relatório abaixo segue o padrão do PDF de referência e pode ser baixado em HTML.</p>
      </div>
      ${reportStatus}
      <div class="cta-row">
        <span class="pill">${report.answersCount} respostas validadas</span>
        <span class="pill">${Math.round(Number(report.notKnownRate || 0))}% de "Não sei"</span>
        <span class="pill">Fonte: ${escapeHtml(report.aiNarrative?.source || "fallback")}</span>
      </div>
      <div class="report-download-row">
        <button id="report-download-html-btn" class="button" type="button">Baixar HTML</button>
      </div>
      ${createReportDocumentMarkup(model)}
      <div class="navigation-row report-actions">
        <button id="report-edit-company-btn" class="button button-secondary" type="button">Editar empresa</button>
        <button id="report-edit-questions-btn" class="button button-secondary" type="button">Revisar perguntas</button>
      </div>
    </div>
  `;

  document.querySelector("#report-download-html-btn")?.addEventListener("click", () => downloadReportHtml(model));
  document.querySelector("#report-edit-company-btn")?.addEventListener("click", () => setActiveStep("company"));
  document.querySelector("#report-edit-questions-btn")?.addEventListener("click", () => setActiveStep("questions"));
}

function renderReportLoading() {
  reportPanel.innerHTML = `
    <div class="report-shell stack">
      <div>
        <p class="eyebrow">Relatório final</p>
        <h2>Processando respostas</h2>
        <p class="lead">Calculando indicadores e tentando salvar a avaliação no backend.</p>
      </div>
      <div class="inline-status status-warning">Aguarde alguns segundos enquanto o relatório é montado.</div>
    </div>
  `;
}

function collectAnswers() {
  const answers = {};

  for (const definition of flattenDefinitions()) {
    answers[definition.key] = String(form.querySelector(`input[name="${definition.key}"]:checked`)?.value || "");
  }

  return answers;
}

async function init() {
  await loadQuestionnaire();
  renderQuestions();
  syncSelectedOptionCards();
  setActiveStep("consent");
}

consentCheckbox.addEventListener("change", () => {
  consentButton.disabled = !consentCheckbox.checked;
});

consentButton.addEventListener("click", () => {
  setActiveStep("company");
});

companyBackBtn.addEventListener("click", () => {
  setActiveStep("consent");
});

companyNextBtn.addEventListener("click", () => {
  if (validateCompanyStep()) {
    setActiveStep("questions");
  }
});

questionsBackBtn.addEventListener("click", () => {
  setActiveStep("company");
});

documentInput.addEventListener("input", () => {
  documentInput.value = formatCnpj(documentInput.value);
  hideInlineStatus(companyLookupStatus);
});

lookupCompanyButton.addEventListener("click", () => {
  lookupCompanyByDocument();
});

documentInput.addEventListener("blur", () => {
  if (normalizeDocument(documentInput.value).length === 14) {
    lookupCompanyByDocument();
  }
});

questionsRoot.addEventListener("change", (event) => {
  if (event.target.matches('input[type="radio"]')) {
    syncSelectedOptionCards();
    hideInlineStatus(questionsStatus);
  }
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!validateQuestions()) {
    return;
  }

  const company = {
    ...readCompanyFormData()
  };

  const answers = collectAnswers();
  const localReport = computeLocalReport(answers);

  setActiveStep("report");
  renderReportLoading();

  try {
    const response = await fetchComRetry(`${apiBaseUrl}/api/assessments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ company, answers })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.details?.join(" | ") || data.error || "Falha ao salvar avaliação.");
    }

    if (!data.persisted) {
      renderReport(data.analysis || localReport, {
        company,
        meta: {
          assessmentId: data.assessmentId,
          createdAt: data.createdAt
        },
        status: {
          kind: "status-warning",
          message: `Relatório calculado, mas o arquivamento não foi concluído: ${data.archiveError || "erro não informado"}.`
        }
      });
      return;
    }

    renderReport(data.analysis, {
      company,
      meta: {
        assessmentId: data.assessmentId,
        createdAt: data.createdAt
      },
      status: {
        kind: "status-success",
        message: `Relatório salvo com sucesso. ID da avaliação: ${data.assessmentId}`
      }
    });
  } catch (error) {
    renderReport(localReport, {
      company,
      meta: {
        createdAt: new Date().toISOString()
      },
      status: {
        kind: "status-warning",
        message: `Relatório calculado localmente. Motivo: ${error.message}`
      }
    });
  }
});

init();
