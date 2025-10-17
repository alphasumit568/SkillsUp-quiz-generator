import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/css/quiz_form.css'; 

const Quizform = () => {
  const [language, setLanguage] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [quizType, setQuizType] = useState('default');
  const [promptText, setPromptText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showLanguagePopup, setShowLanguagePopup] = useState(false);

  const navigate = useNavigate();
  const searchInputRef = useRef(null);
  const popupRef = useRef(null);

  const languages = useMemo(() => [
    'JavaScript', 'Python', 'TypeScript', 'Java',
    'C', 'C++', 'C#', 'Go', 'Kotlin', 'Swift',
    'Rust', 'PHP', 'Ruby', 'Dart', 'R', 'SQL',
    'HTML/CSS'
  ].sort(), []);

  const filteredLanguages = useMemo(() => {
    if (!searchTerm) return languages;
    return languages.filter(lang =>
      lang.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [languages, searchTerm]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const missingFields = [];
    if (!language) missingFields.push('language-search');
    if (!difficulty) missingFields.push('difficulty');
    if (quizType === 'prompt' && !promptText.trim()) missingFields.push('promptText');

    if (missingFields.length > 0) {
      missingFields.forEach(fieldId => {
        const element = document.getElementById(fieldId);
        if (element) {
          element.classList.add('shake-animation');
          setTimeout(() => element.classList.remove('shake-animation'), 500);
        }
      });
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      navigate('/playing-quiz', {
        state: {
          language,
          difficulty,
          quizType,
          ...(quizType === 'prompt' && { promptText })
        }
      });
      setIsLoading(false);
    }, 500);
  };

  const handleLanguageClick = (lang) => {
    setLanguage(lang);
    setSearchTerm(lang);
    setShowLanguagePopup(false);
  };

  const handleClearLanguage = (e) => {
    e.stopPropagation();
    setLanguage('');
    setSearchTerm('');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchInputRef.current && !searchInputRef.current.contains(event.target) &&
        popupRef.current && !popupRef.current.contains(event.target)
      ) {
        setShowLanguagePopup(false);
        if (language && searchTerm.toLowerCase() !== language.toLowerCase()) {
          setSearchTerm(language);
        } else if (!language) {
          setSearchTerm('');
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [language, searchTerm]);

  useEffect(() => {
    if (language && !showLanguagePopup && searchTerm !== language) {
      setSearchTerm(language);
    }
  }, [language, showLanguagePopup, searchTerm]);

  return (
    <div className="quiz-selection-page">
      <div className="decoration-circle circle-1"></div>
      <div className="decoration-circle circle-2"></div>
      <div className="decoration-circle circle-3"></div>

      <header className="selection-header">
        <h1>SkillsUp Quiz Generator</h1>
        <p>Customize your coding challenge with AI-generated questions.</p>
      </header>

      <form onSubmit={handleSubmit} className="quiz-form">
        {/* Added z-index-raised class here */}
        <div className={`form-section animate-float-in ${showLanguagePopup ? 'z-index-raised' : ''}`} style={{ '--delay': '0.1s' }}>
          <div className="input-group">
            <label htmlFor="language-search">
              <i className="icon icon-code"></i>
              <b>Programming Language</b>
            </label>
            <div className="search-container">
              <input
                id="language-search"
                type="text"
                ref={searchInputRef}
                value={searchTerm}
                required
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  if (language && language.toLowerCase() !== e.target.value.toLowerCase()) {
                    setLanguage('');
                  }
                  setShowLanguagePopup(true);
                }}
                onFocus={() => setShowLanguagePopup(true)}
                placeholder="Type to search languages..."
                className={`search-input ${!language && !searchTerm ? 'empty' : ''}`}
                onBlur={() => {
                  setTimeout(() => {
                    if (!popupRef.current || !popupRef.current.contains(document.activeElement)) {
                      setShowLanguagePopup(false);
                      if (language && searchTerm.toLowerCase() !== language.toLowerCase()) {
                        setSearchTerm(language);
                      } else if (!language) {
                        setSearchTerm('');
                      }
                    }
                  }, 100);
                }}
              />
              {language && (
                <div className="selected-language-tag">
                  {language}
                  <button
                    type="button"
                    className="clear-language"
                    onClick={handleClearLanguage}
                  >
                    ×
                  </button>
                </div>
              )}
            </div>

            {showLanguagePopup && (
              <div className="language-popup" ref={popupRef}>
                {filteredLanguages.length > 0 ? (
                  filteredLanguages.map(lang => (
                    <div
                      key={lang}
                      className="language-option"
                      onClick={() => handleLanguageClick(lang)}
                      onMouseDown={(e) => e.preventDefault()}
                    >
                      {lang}
                    </div>
                  ))
                ) : (
                  <div className="no-results">No languages found</div>
                )}
              </div>
            )}
          </div>

          <div className="input-group animate-float-in" style={{ '--delay': '0.3s', 'zIndex': 1 }}>
            <label htmlFor="difficulty">
              <i className="icon icon-difficulty"></i>
              <b>Difficulty Level</b>
            </label>
            <select
              id="difficulty"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className={!difficulty ? 'empty' : ''}
              required
            >
              <option value="">Select difficulty level</option>
              <option value="beginner">Easy</option>
              <option value="intermediate">Medium</option>
              <option value="advanced">hard</option>
              {/* <option value="expert">Expert</option> */}
            </select>
          </div>
        </div>

        <div className="form-section animate-float-in" style={{ '--delay': '0.3s' }}>
          <h3 className="section-title">Quiz Type</h3>
          <div className="toggle-group">
            <input
              type="radio"
              id="defaultType"
              name="quizType"
              value="default"
              checked={quizType === 'default'}
              onChange={() => setQuizType('default')}
            />
            <label htmlFor="defaultType" className="toggle-option">
              <span className="toggle-icon">📊</span>
              <span>Default Quiz</span>
              <span className="toggle-description">General programming questions</span>
            </label>

            <input
              type="radio"
              id="promptType"
              name="quizType"
              value="prompt"
              checked={quizType === 'prompt'}
              onChange={() => setQuizType('prompt')}
            />
            <label htmlFor="promptType" className="toggle-option">
              <span className="toggle-icon">✨</span>
              <span>Prompt Quiz</span>
              <span className="toggle-description">Tailored to your specific needs</span>
            </label>
          </div>
        </div>

        {quizType === 'prompt' && (
          <div className="form-section animate-fade-in">
            <div className="input-group">
              <label htmlFor="promptText">
                <i className="icon icon-edit"></i>
                Search Topic
              </label>
              <textarea
                id="promptText"
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                placeholder="e.g., 'React Hooks patterns', 'Python async programming', 'C++ memory management'"
                className={!promptText.trim() ? 'empty' : ''}
              />
              <div className="prompt-examples">
                <span>Examples: </span>
                <button type="button" onClick={() => setPromptText("Object-oriented design patterns in " + (language || "Java"))}>
                  OOP patterns
                </button>
                <button type="button" onClick={() => setPromptText("Memory management in " + (language || "C++"))}>
                  Memory management
                </button>
                <button type="button" onClick={() => setPromptText("Asynchronous programming in " + (language || "JavaScript"))}>
                  Async patterns
                </button>
              </div>
            </div>
          </div>
        )}

        <button
          type="submit"
          className={`submit-button animate-float-in ${isLoading ? 'loading' : ''}`}
          style={{ '--delay': '0.4s' }}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="spinner"></span>
              Generating...
            </>
          ) : (
            <>
              Generate Quiz
              <span className="button-arrow">→</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default Quizform;