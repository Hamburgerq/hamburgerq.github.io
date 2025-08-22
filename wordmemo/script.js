/*jshint esversion: 6 */
/*jshint sub:true*/
window.addEventListener('load', () => {
  // Get the loading screen and main content elements
  const loadingScreen = document.getElementById('loading-screen');
  const mainContent = document.getElementById('main-content');

  // Add a class to fade out the loading screen
  loadingScreen.style.opacity = 0;

  // Use a short delay to ensure the fade-out transition completes
  setTimeout(() => {
    // Hide the loading screen completely
    loadingScreen.style.display = 'none';

    // Show the main content
    mainContent.style.display = 'block';

    // Allow body scrolling again
    document.body.style.overflow = 'auto';
  }, 500); // This should match the CSS transition duration
});
// --- Global Variables ---
let originalVocabularyList = []; // The unshuffled list from the file
let shuffledVocabularyList = []; // The list for the current practice session
let currentQuestionIndex = 0;
let totalQuestionsAnswered = 0;
let totalQuestions = 0;
let fav_arr = [];

const translations = {
  'en': {
    'excelFile': 'Upload vocabulary file (.xlsx .csv .json)',
    'title': 'Vocabulary Practice',
    'wordclass_Label': 'Word classes',
    'no_file': 'No file selected',
    'placeholder': 'Type your answer here',
    'check_button': 'Check Answer',
    'next_button': 'Next Question',
    'correct_prefix': 'Correct:',
    'incorrect_message': 'Incorrect, correct answer is',
    'invalid_file': 'Invalid file data(valid format: .xlsx .csv or .json), ensure all the row of data has four columns.',
    'all_word_classes': 'All Word Classes',
    'select_word_classes': 'Select Word Class(es):',
    'start_practice': 'Start Practice',
    'back_to_upload': 'Upload a New File',
    'back_to_filter': 'Change Word Classes',
    'data_table': 'Vocabulary Table',
    'import_btn': 'Import',
    'export_btn': 'Export',
    'add_row_btn': 'Add row',
    'delete_row_btn': 'Delete row',
    'clone_row_btn': 'Clone row',
    'col_title1': 'Vocabulary',
    'col_title2': 'Pronunciation',
    'col_title3': 'English',
    'col_title4': 'Word class',
    'uiLabel': 'UI language',
    'pronunciationLabel': 'Pronunciation',
    'settingsLabel': 'Settings',
    'darkModeLabel': 'Dark mode:',
    'helpLabel': 'Help:',
    'helpList': ["1.Support input and output file format: .xlsx, .csv, .json.",                             								"2.Input file should have 4 columns in a certain sequence: Word, Pronunciation, Your native language, Word class.",
                 "3.Phone should install text to voice package of prefer language in order to select as pronunciation language.", "4.You can continuosly check answer and go to next question by input \"Enter\" key while practicing."],
  },
  'zh': {
    'excelFile': '上傳您的單字文件',
    'title': '單字練習',
    'wordclass_Label': '詞性',
    'no_file': '未選擇文件',
    'placeholder': '在此輸入您的答案',
    'check_button': '檢查答案',
    'next_button': '下一題',
    'correct_prefix': '正確:',
    'incorrect_message': '錯誤，正確答案是',
    'invalid_file': '文件格式無效(應為.xlsx .csv 或 .json)，並包含四個資料欄位。',
    'all_word_classes': '所有詞性',
    'select_word_classes': '選擇詞性：',
    'start_practice': '開始練習',
    'back_to_upload': '上傳新文件',
    'back_to_filter': '更改詞性',
    'data_table': '單字表',
    'import_btn': '匯入',
    'export_btn': '匯出',
    'add_row_btn': '新增列',
    'delete_row_btn': '刪除列',
    'clone_row_btn': '複製列',
    'col_title1': '單字',
    'col_title2': '讀音',
    'col_title3': '中文',
    'col_title4': '詞性',
    'uiLabel': '網頁語言',
    'pronunciationLabel': '發音語言',
    'settingsLabel': '設定',
    'darkModeLabel': '深色模式:',
    'helpLabel': '說明:',
    'helpList': ["1.支援匯出、匯入格式: .xlsx, .csv, .json",                             														"2.匯入檔案需依序包含4個欄位: 單字, 發音, 你的母語, 詞性。",
                 "3.手機使用前須先安裝文字轉語音套件，才可選擇該發音。","4.持續輸入\"Enter\"鍵，可以連續檢查答案即跳至下一題。"],
  }
};

// --- DOM Elements ---
const hamburgerBtn = document.getElementById('hamburger-button');
const menuCollapseArea = document.getElementById('menu-collapse-area');
const uiLanguageSelector = document.getElementById('ui-language-selector');
const pronunciationLanguageSelector = document.getElementById('pronunciation-language-selector');
const excelFileInput = document.getElementById('excel-file');
const mainTitle = document.getElementById('main-title');
const customUploadButton = document.getElementById('custom-upload-button');
const fileNameSpan = document.getElementById('file-name');
const fileUploadSection = document.getElementById('file-upload-section');
const filterSectionContainer = document.getElementById('filter-section-container');
const collapsibleFilterContent = document.getElementById('collapsible-filter-content');
const toggleFilterButton = document.getElementById('toggle-filter-button');
const toggleIconUp = document.getElementById('toggle-icon-up');
const toggleIconDown = document.getElementById('toggle-icon-down');
const wordclassLabel = document.getElementById('wordclass-label');
const wordClassToggleButton = document.getElementById('word-class-toggle-button');
const wordClassPanel = document.getElementById('word-class-panel');
const selectedWordClassesSpan = document.getElementById('selected-word-classes');
const applyFilterButton = document.getElementById('apply-filter-button');
const practiceSection = document.getElementById('practice-section');
const wordDisplay = document.getElementById('word-display');
const answerInput = document.getElementById('answer-input');
const feedbackMessage = document.getElementById('feedback-message');
const checkButton = document.getElementById('check-button');
const nextButton = document.getElementById('next-button');
const questionCount = document.getElementById('question-count');
const backToUploadButton = document.getElementById('back-to-upload-button');
const dataTable = document.getElementById('data-table');
const importBtn = document.getElementById('importExcelBtn');
const exportBtn = document.getElementById('exportBtn');
const addRowBtn = document.getElementById('addRowBtn');
const deleteRowBtn = document.getElementById('deleteRowBtn');
const cloneRowBtn = document.getElementById('cloneRowBtn');
const colTitle1 = document.getElementById('col-title1');
const colTitle2 = document.getElementById('col-title2');
const colTitle3 = document.getElementById('col-title3');
const colTitle4 = document.getElementById('col-title4');
const settingButton = document.getElementById('setting-button'); // Get the setting button
const settingsModal = document.getElementById('settingsModal'); // New settings modal
const closeSettingsModalBtn = document.getElementById('closeSettingsModalBtn'); // Close button for settings modal
const uiLabel = document.getElementById('ui-label');
const pronunciationLabel = document.getElementById('pronunciation-label');
const settingsLabel = document.getElementById('settings-label');
const darkModeLabel = document.getElementById('dark-mode-label');
const helpCollapseContent = document.getElementById('help-collapse-content1');
const helpArrowUp = document.getElementById('help-arrow-up');
const helpArrowDown = document.getElementById('help-arrow-down');
const favBtn = document.getElementById("fav-btn");
const loadFavBtn = document.getElementById("load-fav-btn");
const helpLabel = document.getElementById('help-label');

const helpList = document.getElementById('help-list');
const listItems = helpList.children; // Or orderedList.querySelectorAll('li');


const editableTable = document.getElementById('editableTable');
const tableBody = editableTable.querySelector('tbody');
const importExcelBtn = document.getElementById('importExcelBtn'); // New import button
const importExcelInput = document.getElementById('importExcelInput'); // New hidden input
const openModalBtn = document.getElementById('openModalBtn');
const closeModalBtn = document.getElementById('closeModalBtn');
const editableTableModal = document.getElementById('editableTableModal');
const exportDropdown = document.getElementById('exportDropdown'); // Export dropdown
const exportXLSXBtn = document.getElementById('exportXLSXBtn');
const exportCSVBtn = document.getElementById('exportCSVBtn');
const exportJSONBtn = document.getElementById('exportJSONBtn');


// --- Event Listeners ---
document.addEventListener('DOMContentLoaded', () => {     
  nextButton.disabled = true;

  // Load saved UI language from localStorage
  const savedUiLanguage = localStorage.getItem('uiLanguage');
  if (savedUiLanguage) {
    uiLanguageSelector.value = savedUiLanguage;
  }
  updateLanguage(uiLanguageSelector.value);

  // Load saved pronunciation language from localStorage
  const savedPronunciationLanguage = localStorage.getItem('pronunciationLanguage');
  if (savedPronunciationLanguage) {
    pronunciationLanguageSelector.value = savedPronunciationLanguage;
  }
  loadDarkMode();

  //Initialize favorite words array
  fav_arr.push([colTitle1.textContent, colTitle2.textContent, colTitle3.textContent, colTitle4.textContent]);

  //Hamburger button
  if (screen.width <= 784) {
    menuCollapseArea.classList.add('collapsed');
    menuCollapseArea.classList.add('mt-12');
  }

});

// -----End of DOMContentLoaded-----

uiLanguageSelector.addEventListener('change', (event) => {
  // Save the new UI language to localStorage
  localStorage.setItem('uiLanguage', event.target.value);
  updateLanguage(event.target.value);
  // Re-populate word class selector with the new language
  if (originalVocabularyList.length > 0) {
    populateWordClassPanel();
  }
});

// Event listener to save pronunciation language to localStorage
pronunciationLanguageSelector.addEventListener('change', (event) => {
  localStorage.setItem('pronunciationLanguage', event.target.value);
});

excelFileInput.addEventListener('change', handleFileUpload);
checkButton.addEventListener('click', checkAnswer);
nextButton.addEventListener('click', nextQuestion);

// Listen for the 'Enter' keypress on the entire document
document.addEventListener('keypress', (event) => {
  // Only proceed if the practice section is visible
  if (!practiceSection.classList.contains('hidden')) {
    if (event.key === 'Enter' && !checkButton.disabled) {
      checkAnswer();
    } else if (event.key === 'Enter' && checkButton.disabled) {
      nextQuestion();
    }
  }
});

applyFilterButton.addEventListener('click', applyWordClassFilter);
wordClassToggleButton.addEventListener('click', toggleWordClassPanel);
backToUploadButton.addEventListener('click', resetToUploadScreen);
toggleFilterButton.addEventListener('click', toggleCollapsibleFilterSection);

// Close panel when clicking outside
document.addEventListener('click', (event) => {
  if (!wordClassPanel.contains(event.target) && !wordClassToggleButton.contains(event.target)) {
    wordClassPanel.classList.add('hidden');
    // Ensure overflow-hidden is re-added if the panel is closed this way
    collapsibleFilterContent.classList.add('overflow-hidden');
  }
});

// --- Functions ---

/**
         * Resets the UI back to the file upload screen.
         */
function resetToUploadScreen() {
  fileUploadSection.classList.remove('hidden');
  filterSectionContainer.classList.add('hidden');
  practiceSection.classList.add('hidden');
  excelFileInput.value = '';
  fileNameSpan.textContent = translations[uiLanguageSelector.value].no_file;
  originalVocabularyList = [];
  shuffledVocabularyList = [];
  currentQuestionIndex = 0;
  totalQuestionsAnswered = 0;
  totalQuestions = 0;
}

/**
         * Toggles the visibility of the collapsible filter section with an animation.
         */
function toggleCollapsibleFilterSection() {
  const isCollapsed = collapsibleFilterContent.classList.contains('collapsed');

  // If the section is about to be collapsed, hide the dropdown panel
  if (!isCollapsed) {
    wordClassPanel.classList.add('hidden');
  }

  collapsibleFilterContent.classList.toggle('collapsed', !isCollapsed);
  collapsibleFilterContent.classList.toggle('p-4', isCollapsed);

  toggleIconUp.classList.toggle('hidden', !isCollapsed);
  toggleIconDown.classList.toggle('hidden', isCollapsed);
}

/**
         * Updates the website's text content based on the selected language.
         * @param {string} lang The language code ('en' or 'zh').
         */
function updateLanguage(lang) {
  mainTitle.textContent = translations[lang]['title'];
  customUploadButton.textContent = translations[lang]['excelFile'];
  wordclassLabel.textContent = translations[lang]['wordclass_Label'];
  answerInput.placeholder = translations[lang]['placeholder'];
  checkButton.textContent = translations[lang]['check_button'];
  nextButton.textContent = translations[lang]['next_button'];
  applyFilterButton.textContent = translations[lang]['start_practice'];
  backToUploadButton.textContent = translations[lang]['back_to_upload'];
  dataTable.textContent = translations[lang]['data_table'];
  importBtn.textContent = translations[lang]['import_btn'];
  exportBtn.textContent = translations[lang]['export_btn'];
  addRowBtn.textContent = translations[lang]['add_row_btn'];
  deleteRowBtn.textContent = translations[lang]['delete_row_btn'];
  cloneRowBtn.textContent = translations[lang]['clone_row_btn'];
  colTitle1.textContent = translations[lang]['col_title1'];
  colTitle2.textContent = translations[lang]['col_title2'];
  colTitle3.textContent = translations[lang]['col_title3'];
  colTitle4.textContent = translations[lang]['col_title4'];
  uiLabel.textContent = translations[lang]['uiLabel'];
  pronunciationLabel.textContent = translations[lang]['pronunciationLabel'];
  settingsLabel.textContent = translations[lang]['settingsLabel'];
  darkModeLabel.textContent = translations[lang]['darkModeLabel'];
  helpLabel.textContent = translations[lang]['helpLabel'];

  for (let i = 0; i < listItems.length; i++) {
    listItems[i].textContent = translations[lang]['helpList'][i];
  }

  // Update file name text if no file is selected
  if (!excelFileInput.files.length) {
    fileNameSpan.textContent = translations[lang]['no_file'];
  }

  // If practice section is visible, update the question count as well
  if (!practiceSection.classList.contains('hidden')) {
    updateQuestionCountDisplay();
  }
  // Update selected word classes text
  updateSelectedWordClassesText();
}

/**
         * Updates the question count display with the correct translation.
         */
function updateQuestionCountDisplay() {
  const currentLang = uiLanguageSelector.value;
  questionCount.textContent = `${translations[currentLang]['correct_prefix']} ${totalQuestionsAnswered}/${totalQuestions}`;
}

/**
         * Populates the word class panel with checkboxes.
         */
function populateWordClassPanel() {
  const currentLang = uiLanguageSelector.value;
  const uniqueWordClasses = [...new Set(originalVocabularyList.map(item => item.word_class))].filter(Boolean);

  wordClassPanel.innerHTML = '';

  // Add 'All' checkbox
  const allCheckbox = createCheckbox('all', translations[currentLang]['all_word_classes'], true);
  wordClassPanel.appendChild(allCheckbox);

  // Add other word class checkboxes
  uniqueWordClasses.forEach(wordClass => {
    const checkbox = createCheckbox(wordClass, wordClass, true); // Set to true to make them checked by default
    wordClassPanel.appendChild(checkbox);
  });

  // Add event listeners for the new checkboxes
  wordClassPanel.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', handleCheckboxChange);
  });
}

// Function to load the saved dark mode value
function loadDarkMode() {
  const savedDarkMode = localStorage.getItem('darkMode');
  const htmlElement = document.getElementById('whole-page');
  var checkBox = document.getElementById("dark-mode-checkbox");

  if (savedDarkMode === 'true') {
    htmlElement.classList.add('dark');
    checkBox.checked = true;
  } else {
    htmlElement.classList.remove('dark');
    checkBox.checked = false;
  }
}
/**
         * Creates a single checkbox element with a label.
         * @param {string} value The value for the checkbox.
         * @param {string} text The text for the label.
         * @param {boolean} isChecked Initial checked state.
         */
function createCheckbox(value, text, isChecked) {
  const wrapper = document.createElement('div');
  wrapper.className = 'theme-droplist flex items-center p-2 cursor-pointer';

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.value = value;
  checkbox.id = `word-class-${value}`;
  checkbox.className = 'w-6 h-6 mr-2 focus:ring-fuchsia-700';
  checkbox.checked = isChecked;

  const label = document.createElement('label');
  label.htmlFor = `word-class-${value}`;
  label.textContent = text;
  label.className = 'text-2xl flex-grow cursor-pointer';

  wrapper.appendChild(checkbox);
  wrapper.appendChild(label);
  return wrapper;
}

/**
         * Handles the change event for the checkboxes.
         * Manages the "All" checkbox behavior to ensure it's deselected when a single word class is selected,
         * and selected when all individual word classes are selected.
         */
function handleCheckboxChange(event) {
  const clickedCheckbox = event.target;
  const allCheckbox = wordClassPanel.querySelector('input[value="all"]');

  if (clickedCheckbox.value === 'all') {
    // If 'All' is clicked, set all others to the same state
    wordClassPanel.querySelectorAll('input[type="checkbox"]').forEach(cb => {
      cb.checked = clickedCheckbox.checked;
    });
  } else {
    // If a single word class is clicked, 'All' must be unchecked
    if (clickedCheckbox.checked) {
      allCheckbox.checked = false;
    }

    // Check if all individual word classes are now checked
    const otherCheckboxes = [...wordClassPanel.querySelectorAll('input[type="checkbox"]')].filter(cb => cb.value !== 'all');
    const allOthersChecked = otherCheckboxes.every(cb => cb.checked);

    if (allOthersChecked) {
      allCheckbox.checked = true;
    } else {
      allCheckbox.checked = false;
    }
  }
  updateSelectedWordClassesText();
}

/**
         * Updates the display text in the toggle button to show the selected word classes.
         */
function updateSelectedWordClassesText() {
  const currentLang = uiLanguageSelector.value;
  const checkedBoxes = [...wordClassPanel.querySelectorAll('input[type="checkbox"]:checked')];

  if (checkedBoxes.length === 0) {
    selectedWordClassesSpan.textContent = 'None selected';
  } else if (checkedBoxes.some(cb => cb.value === 'all')) {
    selectedWordClassesSpan.textContent = translations[currentLang]['all_word_classes'];
  } else {
    const selectedValues = checkedBoxes.map(cb => cb.value).join(', ');
    selectedWordClassesSpan.textContent = selectedValues;
  }
}

/**
         * Toggles the visibility of the word class checkbox panel and the parent container's overflow.
         */
function toggleWordClassPanel() {
  const isPanelHidden = wordClassPanel.classList.contains('hidden');

  wordClassPanel.classList.toggle('hidden');

  // If the panel is now visible, remove overflow-hidden from the parent
  if (isPanelHidden) {
    collapsibleFilterContent.classList.remove('overflow-hidden');
  } else {
    // If the panel is now hidden, re-add overflow-hidden
    collapsibleFilterContent.classList.add('overflow-hidden');
  }
}

/**
         * Applies the selected word class filter and restarts the practice session.
         */
function applyWordClassFilter() {
  const selectedWordClasses = [...wordClassPanel.querySelectorAll('input[type="checkbox"]:checked')]
  .map(cb => cb.value)
  .filter(value => value !== 'all');

  let filteredList;

  if (selectedWordClasses.length === 0) {
    showAlert('Please select at least one word class.');
    return;
  } else {
    filteredList = originalVocabularyList.filter(item => selectedWordClasses.includes(item.word_class));
  }

  if (filteredList.length > 0) {
    shuffledVocabularyList = shuffleArray(filteredList);
    currentQuestionIndex = 0;
    totalQuestionsAnswered = 0;
    totalQuestions = filteredList.length;

    // Collapse the filter content with the new animated class
    collapsibleFilterContent.classList.add('collapsed');
    collapsibleFilterContent.classList.remove('p-4');
    toggleIconUp.classList.add('hidden');
    toggleIconDown.classList.remove('hidden');

    practiceSection.classList.remove('hidden');
    displayQuestion();
  } else {
    showAlert('No words found for the selected word classes.');
  }
}

/**
         * Shuffles an array using the Fisher-Yates (Knuth) algorithm.
         * @param {Array} array The array to shuffle.
         * @returns {Array} A new shuffled array.
         */
function shuffleArray(array) {
  let newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

/**
         * Handles the file upload, reads the .xlsx, .csv, or .json file, and populates the vocabulary list.
         * @param {Event} event The change event from the file input.
         */
function handleFileUpload(event) {
  const file = event.target.files[0];
  if (!file) {
    fileNameSpan.textContent = translations[uiLanguageSelector.value].no_file;
    return;
  }

  fileNameSpan.textContent = file.name;
  const fileExtension = file.name.split('.').pop().toLowerCase();
  const reader = new FileReader();

  reader.onload = function(e) {
    let parsedData = [];
    let isValidFile = false;

    try {
      if (fileExtension === 'xlsx') {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        // Convert sheet to JSON, skipping header row (header: 1 means first row is header)
        let rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        if (rawData.length > 1 && rawData[0].length >= 2) {
          parsedData = rawData.slice(1).map(row => ({
            answer: String(row[0]),
            pronunciation: String(row[1]),
            question: String(row[2]),
            word_class: String(row[3]),
            fav: 0,
            correct: false
          }));

          isValidFile = true;
        }
      } else if (fileExtension === 'csv') {
        const csvText = e.target.result;
        // Simple CSV parsing: split by new line, then by comma. Assumes no commas within fields.
        // Skips the first row as a header.
        const rows = csvText.split('\n').filter(row => row.trim() !== '');
        if (rows.length > 1) { // Check for header + at least one data row
          parsedData = rows.slice(1).map(row => {
            const cols = row.split(',');
            return {
              answer: String(cols[0]) ? String(cols[0]).trim().replace(/"/g,"") : '',
              pronunciation: String(cols[1]) ? String(cols[1]).trim().replace(/"/g,"") : '',
              question: String(cols[2]) ? String(cols[2]).trim().replace(/"/g,"") : '',
              word_class: String(cols[3]) ? String(cols[3]).trim().replace(/"/g,"") : '',
              fav: 0,
              correct: false
            };
          });
          isValidFile = true;
        }
      } else if (fileExtension === 'json') {
        const jsonText = e.target.result;
        const jsonData = JSON.parse(jsonText);

        if (Array.isArray(jsonData) && jsonData.length > 0) {
          // Get keys from the first object to determine column order
          const headers = Object.keys(jsonData[0]); 

          parsedData = jsonData.map(item => {
            const rowValues = headers.map(header => item[header]);
            return {
              // Use the first four columns based on their order in the JSON object
              answer: String(rowValues[0]) !== undefined ? String(rowValues[0]).trim() : '',
              pronunciation: String(rowValues[1]) !== undefined ? String(rowValues[1]).trim() : '',
              question: String(rowValues[2]) !== undefined ? String(rowValues[2]).trim() : '',
              word_class: String(rowValues[3]) !== undefined ? String(rowValues[3]).trim() : '',
              fav: 0,
              correct: false
            };
          }).filter(item => item.word_class !== ''); // Filter out non four columns rows
          // Check if any valid data was parsed after mapping and filtering
          if (parsedData.length > 0) {
            isValidFile = true;
          }
        }
      } else {
        showAlert(translations[uiLanguageSelector.value]['invalid_file']);
        excelFileInput.value = '';
        return;
      }

      if (isValidFile && parsedData.length > 0) {
        originalVocabularyList = parsedData;
        // Show the filter section and populate it
        filterSectionContainer.classList.remove('hidden');
        // Ensure the content starts in the expanded state by removing the 'collapsed' class
        collapsibleFilterContent.classList.remove('collapsed');
        collapsibleFilterContent.classList.add('p-4'); // Add padding back for expanded state
        collapsibleFilterContent.classList.add('overflow-hidden'); // Ensure overflow is hidden by default
        toggleIconUp.classList.remove('hidden');
        toggleIconDown.classList.add('hidden');
        populateWordClassPanel();

        // Explicitly update the text to reflect the default 'All Word Classes' selection
        updateSelectedWordClassesText();

        // Hide the upload section to create a cleaner flow
        fileUploadSection.classList.add('hidden');
      } else {
        showAlert(translations[uiLanguageSelector.value]['invalid_file']);
        excelFileInput.value = '';
      }
    } catch (error) {

      console.error("File parsing error:", error);
      showAlert(translations[uiLanguageSelector.value]['invalid_file']);
      excelFileInput.value = '';
    }
  };

  // Read file based on type
  if (fileExtension === 'xlsx') {
    reader.readAsArrayBuffer(file);
  } else if (fileExtension === 'csv' || fileExtension === 'json') {
    reader.readAsText(file);
  } else {
    showAlert(translations[uiLanguageSelector.value]['invalid_file']);
    excelFileInput.value = '';
  }
}
/**
         * Favorite button action.
         */
function addFav() {
  const currentItem = shuffledVocabularyList[currentQuestionIndex];
  if (favBtn.classList.contains('text-gray-400')) {
    favBtn.classList.remove("text-gray-400");
    favBtn.classList.add("text-red-600");
    fav_arr.push([currentItem.answer, currentItem.pronunciation, currentItem.question, currentItem.word_class]);
    currentItem.fav = 1;
    //console.log(fav_arr);
    //console.log(shuffledVocabularyList);
  } else {
    favBtn.classList.add("text-gray-400");
    favBtn.classList.remove("text-red-600");
    fav_arr.splice(fav_arr.length-1, 1); // 1st para:target row, 2nd para:rows to remove
    currentItem.fav = 0;
    //console.log(fav_arr);
    //console.log(shuffledVocabularyList);
  }
  // Remove focus from the button
  favBtn.blur();
}
function loadFav() {
  if (loadFavBtn.classList.contains('text-gray-400')) {
    loadFavBtn.classList.remove("text-gray-400");
    loadFavBtn.classList.add("text-red-600");

    //Load favorite array to edit table
    tableBody.innerHTML = ''; 
    if (fav_arr.length > 1) {
      // Populate table with data from the first four columns
      fav_arr.slice(1).forEach(rowData => {
        const newRow = document.createElement('tr');
        for (let i = 0; i < 4; i++) { // Only take the first 4 columns
          const newCell = document.createElement('td');
          newCell.contentEditable = 'false';
          newCell.classList.add('px-2', 'py-1', 'break-all', 'text-base', 'text-gray-900', 'border', 'border-black', 'focus:bg-orange-100');
          newCell.textContent = rowData[i] !== undefined ? rowData[i] : ''; // Handle undefined cells
          newRow.appendChild(newCell);
        }
        tableBody.appendChild(newRow);
      });
    } else {
      const newRow = document.createElement('tr');
      for (let i = 0; i < 4; i++) { // Only take the first 4 columns
        const newCell = document.createElement('td');
        newCell.contentEditable = 'false';
        newCell.classList.add('px-2', 'py-1', 'break-all', 'text-base', 'text-gray-900', 'border', 'border-black', 'focus:bg-orange-100');
        newCell.textContent = ''; // Handle undefined cells
        newRow.appendChild(newCell);
      }
    }
  } else {
    loadFavBtn.classList.add("text-gray-400");
    loadFavBtn.classList.remove("text-red-600");
    //Remove word from favorite array
    tableBody.innerHTML = '';
    for (let j = 1; j < 4; j++) {
      const newRow = document.createElement('tr');
      for (let i = 0; i < 4; i++) { // Only take the first 4 columns
        const newCell = document.createElement('td');
        newCell.contentEditable = 'false';
        newCell.classList.add('px-2', 'py-1', 'break-all', 'text-base', 'text-gray-900', 'border', 'border-black', 'focus:bg-orange-100');
        newCell.textContent = ''; // add blank cells
        newRow.appendChild(newCell);
      }
      tableBody.appendChild(newRow);
    }

  }
}
var drawRipple = function(ev) {
  var x = ev.clientX;
  var y = ev.clientY;
  var node = document.querySelector(".ripple");
  var newNode = node.cloneNode(true);
  newNode.classList.add("animate");
  newNode.style.left = x - 5 + "px";
  newNode.style.top = y - 5 + "px";
  node.parentNode.replaceChild(newNode, node);
  node.classList.remove("animate");
};

favBtn.addEventListener('click', function(e) {
  drawRipple(e, this);
});
loadFavBtn.addEventListener('click', function(e) {
  drawRipple(e, this);
});

/**
         * Displays the current vocabulary question on the screen.
         */
function displayQuestion() {
  if (shuffledVocabularyList.length === 0) {
    showAlert('No questions available for this filter. Please try a different filter or file.');
    return;
  }

  if (currentQuestionIndex >= shuffledVocabularyList.length) {
    shuffledVocabularyList = shuffleArray(shuffledVocabularyList);
    currentQuestionIndex = 0;
  }
  // 0 < currentQuestionIndex < shuffledVocabularyList.length
  let correctNum = 0;
  do {
    if (!shuffledVocabularyList[currentQuestionIndex].correct || correctNum === shuffledVocabularyList.length-1) {
      if (shuffledVocabularyList[currentQuestionIndex].correct && correctNum === shuffledVocabularyList.length-1){
        shuffledVocabularyList.forEach(initializeWord);
        currentQuestionIndex = 0;
      }
      const currentItem = shuffledVocabularyList[currentQuestionIndex];
      // Create a wrapper for the word and the new pronunciation button
      wordDisplay.innerHTML = '';
      const questionText = document.createElement('span');
      questionText.innerHTML = `${currentItem.question}&nbsp;&nbsp;&nbsp;&nbsp;(${currentItem.word_class})`;
      wordDisplay.appendChild(questionText);

      answerInput.value = '';
      feedbackMessage.innerHTML = '';

      checkButton.disabled = false;
      nextButton.disabled = true;
      answerInput.focus();

      updateQuestionCountDisplay();
      if (currentItem.fav === 0 && favBtn.classList.contains('text-red-600')) {
        favBtn.classList.add("text-gray-400");
        favBtn.classList.remove("text-red-600");
      } else if (currentItem.fav === 1 && !favBtn.classList.contains('text-red-600')){
        favBtn.classList.remove("text-gray-400");
        favBtn.classList.add("text-red-600");
      }
      break;
    } else if (currentQuestionIndex === shuffledVocabularyList.length-1) {
      currentQuestionIndex = 0;
      correctNum = 0;
    } else {
      currentQuestionIndex++;
      correctNum++;
    }
  }
  while (currentQuestionIndex < shuffledVocabularyList.length);
}
// Initialize vocabulary array correct status while all words are correct
function initializeWord(item, index, arr) {
  item.correct = false;
}
/**
         * Checks the user's answer against the correct answer.
         */
function checkAnswer() {
  const userAnswer = answerInput.value.trim().toLowerCase();
  const currentItem = shuffledVocabularyList[currentQuestionIndex];
  const correctAnswer = currentItem.answer.trim().toLowerCase();
  const currentLang = uiLanguageSelector.value;

  feedbackMessage.innerHTML = ''; // Clear previous feedback

  const pronunciationButton = createPronunciationButton(currentItem.answer);
  const feedbackTextSpan = document.createElement('span');

  if (userAnswer === correctAnswer) {
    feedbackMessage.className = 'mt-4 text-2xl font-semibold correct-color flex items-center justify-center break-all';
    feedbackTextSpan.innerHTML = `${translations[currentLang]['correct_prefix']}<br>${currentItem.answer} `;
    totalQuestionsAnswered++;
    currentItem.correct = true;
  } else {
    feedbackMessage.className = 'mt-4 text-2xl font-semibold incorrect-color flex items-center justify-center break-all';
    feedbackTextSpan.innerHTML = `${translations[currentLang]['incorrect_message']}<br>${currentItem.answer} (${currentItem.pronunciation})`;
    currentItem.correct = false;
  }

  feedbackMessage.appendChild(feedbackTextSpan);
  if (pronunciationButton) {
    feedbackMessage.appendChild(pronunciationButton);
  }

  nextButton.disabled = false;
  checkButton.disabled = true;
}

/**
         * Creates and returns a button element for playing pronunciation.
         * @param {string} word The word to pronunce.
         * @returns {HTMLElement|null} The created button element or null if not supported.
         */
function createPronunciationButton(word) {
  if (!('speechSynthesis' in window)) {
    console.log('Web Speech API is not supported in this browser.');
    return null;
  }

  const button = document.createElement('button');
  button.className = 'pronun-btn ml-4 p-2 rounded-full border-2 transition duration-300 transform hover:scale-110 flex items-center justify-center';
  button.title = 'Listen to pronunciation';
  button.innerHTML = `
<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
<path stroke-linecap="round" stroke-linejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.414-4.414A1 1 0 0112 5.586v12.828a1 1 0 01-1.586.707L5.586 15z" />
      </svg>
`;
  button.addEventListener('click', () => playPronunciation(word));
  return button;
}

/**
         * Plays the pronunciation of a word using the Web Speech API.
         * @param {string} text The text to convert to speech.
         */
function playPronunciation(text) {
  if (!('speechSynthesis' in window)) {
    showAlert('Web Speech API is not supported in this browser.');
    return;
  }

  // Cancel any ongoing speech
  if (window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel();
  }

  const utterance = new SpeechSynthesisUtterance(text);

  // Get the voice based on the selected pronunciation language
  const selectedLangCode = pronunciationLanguageSelector.value;

  // Try to find a voice with the exact language code
  const voices = window.speechSynthesis.getVoices();
  const matchingVoice = voices.find(voice => voice.lang === selectedLangCode);

  if (matchingVoice) {
    utterance.voice = matchingVoice;
  }

  // Set the lang property as a fallback, which sometimes works
  utterance.lang = selectedLangCode;

  window.speechSynthesis.speak(utterance);
}

/**
         * Moves to the next question. If the previous answer was incorrect,
         * the current question is moved to the end of the list to be asked again.
         */
function nextQuestion() {
  const currentItem = shuffledVocabularyList[currentQuestionIndex];
  //console.log(shuffledVocabularyList);
  if (currentItem.correct) {
    currentQuestionIndex++;
  } else {
    shuffledVocabularyList = shuffleArray(shuffledVocabularyList);
  }
  displayQuestion();
}

/**
         * Custom alert function to display messages without using window.alert().
         * @param {string} message The message to display.
         */
function showAlert(message) {
  const customAlert = document.createElement('div');
  customAlert.innerHTML = `
<div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
<div class="relative p-5 border w-96 shadow-lg rounded-md bg-white text-center">
<p class="text-lg font-bold">${message}</p>
<div class="mt-4">
<button id="close-alert" class="bg-indigo-800 text-white font-bold py-2 px-4 rounded-full shadow-lg hover:bg-fuchsia-700 transition duration-300">
OK
      </button>
      </div>
      </div>
      </div>
`;
  document.body.appendChild(customAlert);
  document.getElementById('close-alert').addEventListener('click', () => {
    customAlert.remove();
  });
}
//============Edit table functionality==========
document.addEventListener('DOMContentLoaded', () => {

  let selectedCells = [];

  /**
           * Clears all currently selected cells.
           */
  function clearSelection() {
    selectedCells.forEach(cell => cell.classList.remove('selected'));
    selectedCells = [];
  }

  /**
           * Adds a cell to the selection.
           * @param {HTMLElement} cell The cell to add.
           */
  function addCellToSelection(cell) {
    if (!selectedCells.includes(cell)) {
      cell.classList.add('selected');
      selectedCells.push(cell);
    }
  }


  /**
           * Handles click event for single cell selection and direct editing.
           * @param {MouseEvent} event
           */

  tableBody.addEventListener('click', (event) => {
    // Clear any existing selections
    clearSelection();
    // Select and make the cell editable
    addCellToSelection(event.target);
    event.target.contentEditable = 'true';
    event.target.focus();
    selectedCell = event.target;
  });


  /**
           * Handles blur event to make the cell non-editable after editing.
           * @param {FocusEvent} event
           */
  tableBody.addEventListener('blur', (event) => {
    if (event.target.tagName === 'TD') {
      event.target.contentEditable = 'false'; // Make the cell non-editable
    }
  }, true); // Use capture phase for blur event

  /**
           * Handles keyboard shortcuts for clear selection.
           * Copy, paste, and select all shortcuts are removed.
           * @param {KeyboardEvent} event
           */
  document.addEventListener('keydown', (event) => {
    // Check if the focus is on a contentEditable cell
    if (document.activeElement.tagName === 'TD' && document.activeElement.isContentEditable) {
      if (event.key === 'Enter') {
        event.preventDefault(); // Prevent new line
        document.activeElement.blur(); // Blur the cell to save changes
        clearSelection();
      } else if (event.key === 'Escape') {
        document.activeElement.blur(); // Blur the cell to exit edit mode
        clearSelection();
      }
    }
  });

  // Function to add a new row
  function addRowListener() {
    const newRow = document.createElement('tr');
    // Create 4 editable cells for the new row
    for (let i = 0; i < 4; i++) {
      const newCell = document.createElement('td');
      newCell.contentEditable = 'false'; // Set to false by default
      newCell.classList.add('theme-table-cell', 'px-2', 'py-1', 'break-all', 'text-base', 'border', 'focus:bg-orange-100');
      newCell.textContent = ''; // Empty content for new cells
      newRow.appendChild(newCell);
    }
    tableBody.appendChild(newRow);
  }
  addRowBtn.addEventListener('click', addRowListener);

  // Function to delete the selected row
  deleteRowBtn.addEventListener('click', () => {
    if (selectedCells.length > 0) {
      const cellToDelete = selectedCells[0]; // Get the first selected cell
      const rowToDelete = cellToDelete.parentNode; // Get its parent row
      const rowIndex = Array.from(tableBody.children).indexOf(rowToDelete); // Get the index of the row to delete
      const columnIndex = Array.from(rowToDelete.children).indexOf(cellToDelete); // Get the index of the column

      tableBody.removeChild(rowToDelete); // Remove the row
      clearSelection(); // Clear selection after deletion

      // Determine which cell to select next
      let targetCell = null;
      if (tableBody.rows.length > 0) {
        // Try to select the cell in the next row at the same column index
        if (tableBody.rows[rowIndex]) {
          targetCell = tableBody.rows[rowIndex].children[columnIndex];
        } else if (rowIndex > 0 && tableBody.rows[rowIndex - 1]) {
          // If no next row, try to select the cell in the previous row
          targetCell = tableBody.rows[rowIndex - 1].children[columnIndex];
        }
      }

      if (targetCell) {
        addCellToSelection(targetCell);
        targetCell.contentEditable = 'true';
        targetCell.focus();
        // Place caret at the end of the text
        const range = document.createRange();
        const sel = window.getSelection();
        range.selectNodeContents(targetCell);
        range.collapse(false); // Collapse to the end
        sel.removeAllRanges();
        sel.addRange(range);
      }
    } else {
      // Optionally, provide feedback if no cell is selected
      // showAlert('Please select a cell in the row you wish to delete.');
    }
  });

  //Clone row to the buttom of table
  cloneRowBtn.addEventListener('click', () => {
    //get current row data
    const cellToClone = selectedCells[0]; // Get the first selected cell
    const rowToClone = cellToClone.parentNode; // Get its parent row

    const newRow = document.createElement('tr');
    // Create 4 editable cells for the new row
    for (let i = 0; i < 4; i++) {
      const newCell = document.createElement('td');
      newCell.contentEditable = 'false'; // Set to false by default
      newCell.classList.add('px-2', 'py-1', 'break-all', 'text-base', 'text-gray-900', 'border', 'border-black', 'focus:bg-orange-100');
      newCell.textContent = Array.from(rowToClone.children)[i].textContent; // Empty content for new cells
      newRow.appendChild(newCell);
    }
    tableBody.appendChild(newRow);
  });

  // Trigger hidden file input when Import button is clicked
  importExcelBtn.addEventListener('click', () => {
    importExcelInput.click();
  });

  // Handle file selection for import
  importExcelInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    const fileExtension = file.name.split('.').pop().toLowerCase();

    reader.onload = function(e) {
      let importedData = [];
      let isValidImport = false;

      try {
        if (fileExtension === 'xlsx') {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          // Convert sheet to array of arrays, without header row (header: -1)
          importedData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          isValidImport = true;
        } else if (fileExtension === 'csv') {
          const csvText = e.target.result;
          // Simple CSV parsing: split by new line, then by comma.
          importedData = csvText.split('\n')
            .filter(row => row.trim() !== '')
            .map(row => row.split(',').map(cell => cell.trim().replace(/"/g,"")));
          isValidImport = true;
        } else if (fileExtension === 'json') {
          const jsonText = e.target.result;
          const jsonData = JSON.parse(jsonText);

          if (Array.isArray(jsonData) && jsonData.length > 0) {
            // Dynamically determine headers from the first object's keys
            const headers = Object.keys(jsonData[0]); 
            importedData.push(headers); // Add headers as the first row

            jsonData.forEach(item => {
              const row = headers.map(header => item[header] !== undefined ? item[header] : '');
              importedData.push(row);
            });
            isValidImport = true;
          } else if (Array.isArray(jsonData) && jsonData.length === 0) {
            // Handle empty JSON array gracefully
            showAlert('The imported JSON file is empty.');
            isValidImport = false; // Still not a valid import for data
          } else {
            // Handle non-array JSON or other unexpected structures
            showAlert('The imported JSON file does not contain a valid array of objects.');
            isValidImport = false;
          }
        } else {
          showAlert('Unsupported file type for import. Please use .xlsx, .csv, or .json.');
          event.target.value = ''; // Clear the file input
          return;
        }

        if (isValidImport && importedData.length > 0) {
          // Clear existing table rows
          tableBody.innerHTML = ''; 
          // Populate table with data from the first four columns
          importedData.slice(1).forEach(rowData => {
            const newRow = document.createElement('tr');
            for (let i = 0; i < 4; i++) { // Only take the first 4 columns
              const newCell = document.createElement('td');
              newCell.contentEditable = 'false';
              newCell.classList.add('px-2', 'py-1', 'break-all', 'text-base', 'text-gray-900', 'border', 'border-black', 'focus:bg-orange-100');
              newCell.textContent = rowData[i] !== undefined ? rowData[i] : ''; // Handle undefined cells
              newRow.appendChild(newCell);
            }
            tableBody.appendChild(newRow);
          });
        } else {
          showAlert('The imported file is empty or has no valid data.');
        }
      } catch (error) {
        console.error("Import file parsing error:", error);
        showAlert('Error parsing the imported file. Please check its format.');
      }
      // Clear the file input value to allow re-importing the same file
      event.target.value = ''; 
    };

    // Read file based on type for import
    if (fileExtension === 'xlsx') {
      reader.readAsArrayBuffer(file);
    } else if (fileExtension === 'csv' || fileExtension === 'json') {
      reader.readAsText(file);
    } else {
      showAlert('Unsupported file type for import. Please use .xlsx, .csv, or .json.');
      event.target.value = ''; // Clear the file input
    }
  });

  /**
             * Extracts data from the editable table.
             * @returns {Array<Array<string>>} A 2D array of table data.
             */
  function getTableData() {
    const data = [];
    const headerRow = editableTable.querySelector('thead tr');
    const headers = Array.from(headerRow.children).map(th => th.textContent.trim());
    data.push(headers); // Add headers as the first row

    Array.from(tableBody.rows).forEach(row => {
      const rowData = Array.from(row.cells).map(cell => cell.textContent.trim());
      data.push(rowData);
    });
    return data;
  }

  /**
             * Downloads a file with the given content and filename.
             * @param {string} content The content of the file.
             * @param {string} fileName The name of the file.
             * @param {string} mimeType The MIME type of the file.
             */


  /**
             * Exports table data to an XLSX file.
             */
  async function exportToXLSX() {
    const data = getTableData();

    // Create the XLSX workbook
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    try {
      // Show the "Save As" dialog
      const fileHandle = await window.showSaveFilePicker({
        suggestedName: 'vocabulary.xlsx',
        types: [{
          description: 'Excel Workbook',
          accept: { 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'] },
        }],
      });

      // Generate the XLSX file as a binary Blob
      const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const xlsxBlob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

      // Create a writable stream and write the Blob
      const writableStream = await fileHandle.createWritable();
      await writableStream.write(xlsxBlob);
      await writableStream.close();

      console.log('XLSX file saved successfully!');
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Save operation cancelled.');
      } else {
        console.error('Error saving the XLSX file:', error);
      }
    }
  }

  /**
             * Exports table data to a CSV file.
             */
  async function exportToCSV() {
    const data = getTableData();
    const csvContent = "\uFEFF" + data.map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(',')).join('\n');

    try {
      // Show the "Save As" dialog
      const fileHandle = await window.showSaveFilePicker({
        suggestedName: 'vocabulary.csv',
        types: [{
          description: 'CSV Files',
          accept: { 'text/csv': ['.csv'] },
        }],
      });

      // Create a writable stream to the selected file
      const writableStream = await fileHandle.createWritable();

      // Write the CSV content and close the stream
      await writableStream.write(csvContent);
      await writableStream.close();

      console.log('File saved successfully!');
    } catch (error) {
      if (error.name === 'AbortError') {
        // User cancelled the file picker dialog
        console.log('Save operation cancelled.');
      } else {
        console.error('Error saving the file:', error);
      }
    }
  }

  /**
             * Exports table data to a JSON file.
             */
  async function exportToJSON() {
    const data = getTableData();

    if (data.length < 1) { // No header row
      showAlert('No data to export to JSON.');
      return;
    }

    const headers = data[0];
    const jsonData = [];
    for (let i = 1; i < data.length; i++) { // Start from 1 to skip header row
      const row = data[i];
      const rowObject = {};
      headers.forEach((header, index) => {
        rowObject[header] = row[index];
      });
      jsonData.push(rowObject);
    }

    const jsonString = JSON.stringify(jsonData, null, 2);
    const jsonBlob = new Blob([jsonString], { type: 'application/json' });

    try {
      // Show the "Save As" dialog
      const fileHandle = await window.showSaveFilePicker({
        suggestedName: 'vocabulary.json',
        types: [{
          description: 'JSON Files',
          accept: { 'application/json': ['.json'] },
        }],
      });

      // Create a writable stream and write the Blob
      const writableStream = await fileHandle.createWritable();
      await writableStream.write(jsonBlob);
      await writableStream.close();

      console.log('JSON file saved successfully!');
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Save operation cancelled.');
      } else {
        console.error('Error saving the JSON file:', error);
      }
    }
  }

  // Event listener for the Export button to toggle dropdown
  exportBtn.addEventListener('click', (event) => {
    exportDropdown.classList.toggle('hidden');
    // Stop propagation to prevent document click from closing it immediately
    event.stopPropagation();
  });

  // Event listeners for export options
  exportXLSXBtn.addEventListener('click', () => {
    exportToXLSX();
    exportDropdown.classList.add('hidden'); // Hide dropdown after selection
  });

  exportCSVBtn.addEventListener('click', () => {
    exportToCSV();
    exportDropdown.classList.add('hidden'); // Hide dropdown after selection
  });

  exportJSONBtn.addEventListener('click', () => {
    exportToJSON();
    exportDropdown.classList.add('hidden'); // Hide dropdown after selection
  });

  // Close export dropdown if clicking outside of it
  document.addEventListener('click', (event) => {
    if (!exportDropdown.classList.contains('hidden') && !exportBtn.contains(event.target) && !exportDropdown.contains(event.target)) {
      exportDropdown.classList.add('hidden');
    }
  });


  // Handle Enter key to blur and save, or Tab to navigate
  tableBody.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent new line in contenteditable
      event.target.blur(); // Blur the cell to "save" changes
    }
    // You could add logic here for Tab key to move between cells
  });


  // Open the vocabulary table modal when the openModalBtn (pencil icon) is clicked
  openModalBtn.addEventListener('click', () => {
    editableTableModal.classList.remove('hidden');
    if (loadFavBtn.classList.contains('text-red-600')){
      loadFav();
    }
    clearSelection(); // Clear selection when modal opens
  });

  // Open the new settings modal when the setting-button is clicked
  settingButton.addEventListener('click', () => {
    settingsModal.classList.remove('hidden');
    // No selection to clear for settings modal, but good practice
  });

  // Close the vocabulary table modal
  closeModalBtn.addEventListener('click', () => {
    editableTableModal.classList.add('hidden');
    clearSelection(); // Clear selection when modal closes
  });

  // Close the new settings modal
  closeSettingsModalBtn.addEventListener('click', () => {
    settingsModal.classList.add('hidden');
  });

  // Close vocabulary table modal if clicking outside the content
  /*
        editableTableModal.addEventListener('click', (event) => {
          if (event.target === editableTableModal) {
            editableTableModal.classList.add('hidden');
            clearSelection(); // Clear selection when modal closes
          }
        });
		*/

  // Close settings modal if clicking outside the content
  settingsModal.addEventListener('click', (event) => {
    if (event.target === settingsModal) {
      settingsModal.classList.add('hidden');
    }
  });
  /*Help collapse content*/
  helpArrowUp.addEventListener('click',() => {
    helpArrowUp.classList.add('hidden');
    helpArrowDown.classList.remove('hidden');
    helpCollapseContent.classList.remove('collapsed');
  });
  helpArrowDown.addEventListener('click',() => {
    helpArrowUp.classList.remove('hidden');
    helpArrowDown.classList.add('hidden');
    helpCollapseContent.classList.add('collapsed');
  });

  /* Hamburger button */
  hamburgerBtn.addEventListener('click',() => {
    if (!hamburgerBtn.classList.contains('hidden') && !menuCollapseArea.classList.contains('collapsed')) {
      menuCollapseArea.classList.add('collapsed');
      //collapsibleFilterContent.classList.add('overflow-hidden'); // Ensure overflow is hidden by default
    } else {
      menuCollapseArea.classList.remove('collapsed');
      menuCollapseArea.classList.add('mt-12');
    }

  });
});
// End of DOMContentLoaded

function darkModeChecker() {
  // Get the checkbox
  var checkBox = document.getElementById("dark-mode-checkbox");
  const htmlElement = document.getElementById('whole-page');

  localStorage.setItem('darkMode', checkBox.checked);

  if (checkBox.checked == true){
    // Add the filter property to its style
    htmlElement.classList.add('dark');
  } else {
    htmlElement.classList.remove('dark');
  }

}
