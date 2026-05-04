const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const properties = {
  villa: {
    image: "src/assets/images/property-villa.svg",
    imageAlt: "Villa Horizon com jardim escultórico e área externa integrada",
    area: "Jardins reservados",
    name: "Villa Horizon",
    price: "R$ 8,4 mi",
    description:
      "Casa contemporânea com jardim escultórico, spa privativo e integração total com a área externa.",
    meta: ["4 suítes", "620 m² privativos", "Piscina linear"]
  },
  penthouse: {
    image: "src/assets/images/property-penthouse.svg",
    imageAlt: "Penthouse Sienna com terraço linear e galeria integrada",
    area: "Skyline histórico",
    name: "Penthouse Sienna",
    price: "R$ 11,9 mi",
    description:
      "Cobertura duplex com terraço linear, galeria de arte integrada e suíte master com lounge.",
    meta: ["5 suítes", "710 m² privativos", "Sky lounge"]
  },
  loft: {
    image: "src/assets/images/property-loft.svg",
    imageAlt: "Loft Cobalto com estrutura aparente e rooftop compartilhado",
    area: "Distrito criativo",
    name: "Loft Cobalto",
    price: "R$ 4,7 mi",
    description:
      "Planta aberta com pé-direito duplo, acabamentos brutos refinados e rooftop compartilhado.",
    meta: ["2 suítes", "280 m² privativos", "Estrutura aparente"]
  }
};

const propertySheet = {
  image: document.getElementById("propertyImage"),
  area: document.getElementById("propertyArea"),
  name: document.getElementById("propertyName"),
  price: document.getElementById("propertyPrice"),
  description: document.getElementById("propertyDescription"),
  meta: document.querySelector(".property-meta")
};

const mapPins = Array.from(document.querySelectorAll(".map-pin"));

const renderPropertyMeta = (items) => {
  if (!propertySheet.meta) {
    return;
  }

  propertySheet.meta.replaceChildren(
    ...items.map((item) => {
      const chip = document.createElement("span");
      chip.textContent = item;
      return chip;
    })
  );
};

const activateProperty = (propertyKey) => {
  const data = properties[propertyKey];
  if (!data) {
    return;
  }

  propertySheet.image.src = data.image;
  propertySheet.image.alt = data.imageAlt;
  propertySheet.area.textContent = data.area;
  propertySheet.name.textContent = data.name;
  propertySheet.price.textContent = data.price;
  propertySheet.description.textContent = data.description;
  renderPropertyMeta(data.meta);

  mapPins.forEach((pin) => {
    const isActive = pin.dataset.property === propertyKey;
    pin.classList.toggle("is-active", isActive);
    pin.setAttribute("aria-pressed", String(isActive));
  });
};

mapPins.forEach((pin) => {
  pin.addEventListener("click", () => {
    activateProperty(pin.dataset.property);
  });
});

activateProperty("villa");

const compareShell = document.getElementById("compareShell");
const compareOverlay = document.getElementById("compareOverlay");
const compareHandle = document.getElementById("compareHandle");

if (compareShell && compareOverlay && compareHandle) {
  let dragging = false;
  let currentPercentage = 50;

  const applyCompare = (percentage) => {
    currentPercentage = Math.min(Math.max(percentage, 5), 95);
    compareOverlay.style.width = `${currentPercentage}%`;
    compareHandle.style.left = `${currentPercentage}%`;
    compareHandle.setAttribute("aria-valuenow", String(Math.round(currentPercentage)));
    compareHandle.setAttribute("aria-valuetext", `${Math.round(currentPercentage)}% da composição visível`);
  };

  const updateCompare = (clientX) => {
    const rect = compareShell.getBoundingClientRect();
    const percentage = ((clientX - rect.left) / rect.width) * 100;
    applyCompare(percentage);
  };

  compareHandle.addEventListener("pointerdown", (event) => {
    dragging = true;
    compareHandle.setPointerCapture?.(event.pointerId);
    updateCompare(event.clientX);
  });

  window.addEventListener("pointermove", (event) => {
    if (!dragging) {
      return;
    }
    updateCompare(event.clientX);
  });

  window.addEventListener("pointerup", () => {
    dragging = false;
  });

  compareHandle.addEventListener("keydown", (event) => {
    const keyMap = {
      ArrowLeft: -5,
      ArrowDown: -5,
      ArrowRight: 5,
      ArrowUp: 5,
      PageDown: -10,
      PageUp: 10
    };

    if (event.key === "Home") {
      event.preventDefault();
      applyCompare(5);
      return;
    }

    if (event.key === "End") {
      event.preventDefault();
      applyCompare(95);
      return;
    }

    if (keyMap[event.key]) {
      event.preventDefault();
      applyCompare(currentPercentage + keyMap[event.key]);
    }
  });

  applyCompare(50);
}

const tourPanorama = document.getElementById("tourPanorama");
const tourViewport = document.getElementById("tourViewport");
const tourDetailTitle = document.getElementById("tourDetailTitle");
const tourDetailText = document.getElementById("tourDetailText");
const tourHotspots = Array.from(document.querySelectorAll(".tour-hotspot"));
const tourShiftButtons = Array.from(document.querySelectorAll(".tour-shift"));

const hotspotTexts = {
  living: {
    title: "Living panorâmico",
    text: "Pé-direito generoso, marcenaria sob medida e luz natural em camada dupla."
  },
  cuisine: {
    title: "Cozinha social",
    text: "Ilha central, apoio para chef e fluxo contínuo entre preparo e recepção."
  },
  terrace: {
    title: "Terraço contemplativo",
    text: "Espaço para jantar ao ar livre com paisagismo integrado e skyline aberto."
  }
};

if (tourPanorama && tourViewport && tourDetailTitle && tourDetailText) {
  let isDragging = false;
  let startX = 0;
  let currentTranslate = 0;
  let nextTranslate = 0;

  const clampTranslate = (value) => {
    const maxOffset = Math.max(tourPanorama.offsetWidth - tourViewport.offsetWidth, 0);
    return Math.min(0, Math.max(value, -maxOffset));
  };

  const applyTranslate = (value) => {
    nextTranslate = clampTranslate(value);
    currentTranslate = nextTranslate;
    tourPanorama.style.transform = `translateX(${currentTranslate}px)`;
  };

  const shiftPanorama = (delta) => {
    applyTranslate(currentTranslate + delta);
  };

  tourPanorama.addEventListener("pointerdown", (event) => {
    isDragging = true;
    startX = event.clientX - currentTranslate;
    tourPanorama.classList.add("is-dragging");
  });

  window.addEventListener("pointermove", (event) => {
    if (!isDragging) {
      return;
    }
    nextTranslate = clampTranslate(event.clientX - startX);
    tourPanorama.style.transform = `translateX(${nextTranslate}px)`;
  });

  window.addEventListener("pointerup", () => {
    if (!isDragging) {
      return;
    }
    isDragging = false;
    currentTranslate = nextTranslate;
    tourPanorama.classList.remove("is-dragging");
  });

  tourViewport.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      shiftPanorama(70);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      shiftPanorama(-70);
    }
  });

  tourShiftButtons.forEach((button) => {
    button.addEventListener("click", () => {
      shiftPanorama(button.dataset.pan === "left" ? 110 : -110);
    });
  });

  const activateHotspot = (key) => {
    const data = hotspotTexts[key];
    if (!data) {
      return;
    }

    tourDetailTitle.textContent = data.title;
    tourDetailText.textContent = data.text;

    tourHotspots.forEach((hotspot) => {
      hotspot.classList.toggle("is-active", hotspot.dataset.hotspot === key);
    });
  };

  tourHotspots.forEach((hotspot) => {
    hotspot.addEventListener("click", () => {
      activateHotspot(hotspot.dataset.hotspot);
    });
  });

  window.addEventListener("resize", () => {
    applyTranslate(currentTranslate);
  });

  activateHotspot("living");
  applyTranslate(0);
}

const propertyValueInput = document.getElementById("propertyValue");
const downPaymentInput = document.getElementById("downPayment");
const loanYearsInput = document.getElementById("loanYears");
const installmentValue = document.getElementById("installmentValue");
const fundingRatio = document.getElementById("fundingRatio");
const inkFill = document.getElementById("inkFill");
const financedAmount = document.getElementById("financedAmount");
const paymentTerm = document.getElementById("paymentTerm");

const currency = (value) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0
  }).format(value);

const animateNumber = (element, value) => {
  if (!element) {
    return;
  }

  if (prefersReducedMotion) {
    element.textContent = currency(value);
    element.dataset.value = String(value);
    return;
  }

  const duration = 450;
  const startValue = Number(element.dataset.value || 0);
  const startTime = performance.now();

  const step = (now) => {
    const progress = Math.min((now - startTime) / duration, 1);
    const current = startValue + (value - startValue) * progress;
    element.textContent = currency(current);
    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      element.dataset.value = String(value);
    }
  };

  requestAnimationFrame(step);
};

const updateFinance = () => {
  if (!propertyValueInput || !downPaymentInput || !loanYearsInput || !installmentValue || !fundingRatio || !inkFill) {
    return;
  }

  const propertyValue = Math.max(Number(propertyValueInput.value) || 0, Number(propertyValueInput.min) || 0);
  const downPayment = Math.min(Math.max(Number(downPaymentInput.value) || 0, 0), propertyValue);
  const years = Math.min(Math.max(Number(loanYearsInput.value) || 0, 1), Number(loanYearsInput.max) || 35);
  const financed = Math.max(propertyValue - downPayment, 0);
  const monthlyRate = 0.0087;
  const months = years * 12;
  const installment = financed > 0 ? (financed * monthlyRate) / (1 - (1 + monthlyRate) ** -months) : 0;
  const ratio = propertyValue > 0 ? (downPayment / propertyValue) * 100 : 0;

  propertyValueInput.value = String(propertyValue);
  downPaymentInput.value = String(downPayment);
  loanYearsInput.value = String(years);

  animateNumber(installmentValue, installment);
  fundingRatio.textContent = `Entrada de ${ratio.toFixed(0)}% do valor do imóvel`;
  inkFill.style.width = `${Math.min(Math.max(ratio, 5), 100)}%`;

  if (financedAmount) {
    financedAmount.textContent = currency(financed);
  }
  if (paymentTerm) {
    paymentTerm.textContent = `${months} meses`;
  }
};

[propertyValueInput, downPaymentInput, loanYearsInput].forEach((field) => {
  field?.addEventListener("input", updateFinance);
});

updateFinance();

const customSliders = Array.from(document.querySelectorAll(".custom-slider"));
const propertyCards = Array.from(document.querySelectorAll(".property-card"));
const filterSummary = document.getElementById("filterSummary");
const emptyState = document.getElementById("emptyState");

const formatSliderValue = (slider, value) => {
  const prefix = slider.dataset.prefix ?? "";
  const suffix = slider.dataset.suffix ?? "";
  if (prefix.includes("R$")) {
    return `${prefix}${new Intl.NumberFormat("pt-BR").format(value)}`;
  }
  return `${value}${suffix}`;
};

const filterProperties = () => {
  const priceLimit = Number(document.querySelector('[data-target="priceDisplay"]')?.dataset.currentValue ?? 0);
  const minArea = Number(document.querySelector('[data-target="areaDisplay"]')?.dataset.currentValue ?? 0);
  let visibleCount = 0;

  propertyCards.forEach((card) => {
    const cardPrice = Number(card.dataset.price);
    const cardArea = Number(card.dataset.area);
    const visible = cardPrice <= priceLimit && cardArea >= minArea;
    card.hidden = !visible;
    if (visible) {
      visibleCount += 1;
    }
  });

  if (filterSummary) {
    filterSummary.textContent =
      visibleCount === 1
        ? "1 imóvel dentro dos filtros atuais."
        : `${visibleCount} imóveis dentro dos filtros atuais.`;
  }

  if (emptyState) {
    emptyState.hidden = visibleCount !== 0;
  }
};

customSliders.forEach((slider) => {
  const min = Number(slider.dataset.min);
  const max = Number(slider.dataset.max);
  const step = Number(slider.dataset.step);
  const output = document.getElementById(slider.dataset.target);
  const track = slider.querySelector(".slider-track");
  const fill = slider.querySelector(".slider-fill");
  const thumb = slider.querySelector(".slider-thumb");
  const bubble = slider.querySelector(".slider-bubble");
  const label = slider.dataset.label ?? "Controle deslizante";
  let value = Number(slider.dataset.value);
  let dragging = false;

  if (!output || !track || !fill || !thumb || !bubble) {
    return;
  }

  const updateSlider = (percentage) => {
    const normalized = Math.min(Math.max(percentage, 0), 1);
    const rawValue = min + normalized * (max - min);
    value = Math.round(rawValue / step) * step;
    const thumbPercent = ((value - min) / (max - min)) * 100;
    const text = formatSliderValue(slider, value);

    fill.style.width = `${thumbPercent}%`;
    thumb.style.left = `${thumbPercent}%`;
    slider.dataset.currentValue = String(value);
    output.textContent = text;
    bubble.textContent = text;
    thumb.setAttribute("role", "slider");
    thumb.setAttribute("aria-valuemin", String(min));
    thumb.setAttribute("aria-valuemax", String(max));
    thumb.setAttribute("aria-valuenow", String(value));
    thumb.setAttribute("aria-valuetext", `${label}: ${text}`);
    filterProperties();
  };

  const handlePointer = (clientX) => {
    const rect = track.getBoundingClientRect();
    updateSlider((clientX - rect.left) / rect.width);
  };

  track.addEventListener("pointerdown", (event) => {
    handlePointer(event.clientX);
  });

  thumb.addEventListener("pointerdown", (event) => {
    dragging = true;
    thumb.setPointerCapture?.(event.pointerId);
    handlePointer(event.clientX);
  });

  window.addEventListener("pointermove", (event) => {
    if (!dragging) {
      return;
    }
    handlePointer(event.clientX);
  });

  window.addEventListener("pointerup", () => {
    dragging = false;
  });

  thumb.addEventListener("keydown", (event) => {
    const keyMap = {
      ArrowRight: step,
      ArrowUp: step,
      ArrowLeft: -step,
      ArrowDown: -step,
      PageUp: step * 2,
      PageDown: -step * 2
    };

    if (event.key === "Home") {
      event.preventDefault();
      updateSlider(0);
      return;
    }

    if (event.key === "End") {
      event.preventDefault();
      updateSlider(1);
      return;
    }

    if (keyMap[event.key]) {
      event.preventDefault();
      updateSlider((value + keyMap[event.key] - min) / (max - min));
    }
  });

  updateSlider((value - min) / (max - min));
});
