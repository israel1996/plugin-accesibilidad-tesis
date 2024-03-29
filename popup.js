

// Función de debouncing para limitar la frecuencia de ejecución de otra función
function debounce(func, delay) {
  let debounceTimer;
  return function() {
      const context = this;
      const args = arguments;
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => func.apply(context, args), delay);
  };
}

// Función para actualizar la pestaña activa con los ajustes
function updateActiveTab(msg) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      if (tabs[0] && tabs[0].id && tabs[0].url.startsWith('http')) {
          chrome.tabs.sendMessage(tabs[0].id, msg);
      }
  });
}

document.addEventListener('DOMContentLoaded', function() {
  const fontSizeSlider = document.getElementById('fontSizeSlider');
  const buttonSizeSlider = document.getElementById('buttonSizeSlider');
  const lineHeightSlider = document.getElementById('lineHeightSlider');
  const fontSizeValue = document.getElementById('fontSizeValue');
  const buttonSizeValue = document.getElementById('buttonSizeValue');
  const lineHeightValue = document.getElementById('lineHeightValue');

  // Carga y muestra los valores actuales de los controles deslizantes
  chrome.storage.sync.get(['fontSize', 'buttonSize', 'lineHeight'], function(data) {
      if (data.fontSize) {
          fontSizeSlider.value = data.fontSize.replace('px', '');
          fontSizeValue.textContent = data.fontSize;
      }
      if (data.buttonSize) {
          buttonSizeSlider.value = data.buttonSize.replace('px', '');
          buttonSizeValue.textContent = data.buttonSize;
      }
      if (data.lineHeight) {
          lineHeightSlider.value = data.lineHeight;
          lineHeightValue.textContent = data.lineHeight;
      }
  });

  // Eventos de entrada para los controles deslizantes
  fontSizeSlider.addEventListener('input', debounce(function() {
      const fontSize = fontSizeSlider.value + 'px';
      fontSizeValue.textContent = fontSize;
      chrome.storage.sync.set({ fontSize: fontSize });
      updateActiveTab({ action: "changeFontSize", fontSize: fontSize });
  }, 250));

  buttonSizeSlider.addEventListener('input', debounce(function() {
      const buttonSize = buttonSizeSlider.value + 'px';
      buttonSizeValue.textContent = buttonSize;
      chrome.storage.sync.set({ buttonSize: buttonSize });
      updateActiveTab({ action: "changeButtonSize", buttonSize: buttonSize });
  }, 250));

  lineHeightSlider.addEventListener('input', debounce(function() {
      const lineHeight = lineHeightSlider.value;
      lineHeightValue.textContent = lineHeight;
      chrome.storage.sync.set({ lineHeight: lineHeight });
      updateActiveTab({ action: "changeLineHeight", lineHeight: lineHeight });
  }, 250));
});

