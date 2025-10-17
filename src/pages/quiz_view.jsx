import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import '../assets/css/quiz_view.css';

const Quizview = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const { language, difficulty, quizType, promptText } = location.state || {};

    const [quizData, setQuizData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [showResults, setShowResults] = useState(false);
    const [score, setScore] = useState(0);
    const [showAnswerFeedback, setShowAnswerFeedback] = useState(false);
    const [loadingProgress, setLoadingProgress] = useState(0);

    const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

    useEffect(() => {
        if (!language || !difficulty || !quizType || (quizType === 'prompt' && !promptText)) {
            setError('Quiz parameters are missing. Please go back and select your quiz preferences.');
            setLoading(false);
            return;
        }

        const fetchQuiz = async () => {
            setLoading(true);
            setError('');
            setQuizData([]);
            setCurrentQuestionIndex(0);
            setSelectedAnswers({});
            setShowResults(false);
            setScore(0);
            setShowAnswerFeedback(false);
            setLoadingProgress(0);

            const progressInterval = setInterval(() => {
                setLoadingProgress(prev => {
                    if (prev >= 90) return prev;
                    return prev + Math.floor(Math.random() * 10) + 1;
                });
            }, 500);

            let prompt = '';
            if (quizType === 'default') {
                prompt = `Generate a ${difficulty} level programming quiz in ${language}. Provide 20 multiple-choice questions. For each question, include the question text, 4 options (A, B, C, D), and the correct answer (e.g., "A", "B", "C", or "D"). Format the output as a JSON array of objects, where each object has "question", "options" (an array of strings), and "correctAnswer" (a string). Ensure the options are clearly labeled A, B, C, D within the option string itself (e.g., "A. Option 1", "B. Option 2"). Wrap your response in triple backticks like \`\`\`json ... \`\`\``;
            } else if (quizType === 'prompt' && promptText) {
                prompt = `Generate a ${difficulty} level programming quiz in ${language} about "${promptText}". Provide 20 multiple-choice questions. For each question, include the question text, 4 options (A, B, C, D), and the correct answer (e.g., "A", "B", "C", or "D"). Format the output as a JSON array of objects, where each object has "question", "options" (an array of strings), and "correctAnswer" (a string). Ensure the options are clearly labeled A, B, C, D within the option string itself (e.g., "A. Option 1", "B. Option 2"). Wrap your response in triple backticks like \`\`\`json ... \`\`\``;
            } else {
                setError('Invalid quiz type or missing prompt text for custom quiz.');
                setLoading(false);
                return;
            }

            const chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
            const payload = { contents: chatHistory };

            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

            try {
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(`API error: ${response.status} - ${errorData.error.message || 'Unknown API error'}`);
                }

                const result = await response.json();

                if (result.candidates && result.candidates.length > 0 &&
                    result.candidates[0].content && result.candidates[0].content.parts &&
                    result.candidates[0].content.parts.length > 0) {
                    const rawText = result.candidates[0].content.parts[0].text || '';
                    console.log("Raw Gemini Output:", rawText);

                    let jsonText = '';
                    const match = rawText.match(/```json\n([\s\S]*?)```/);
                    if (match && match[1]) {
                        jsonText = match[1].trim();
                    } else {
                        const jsonStructuralMatch = rawText.match(/\[[\s\S]*\]/);
                        if (jsonStructuralMatch) {
                            jsonText = jsonStructuralMatch[0].trim();
                        } else {
                            jsonText = rawText.trim();
                        }
                    }

                    jsonText = jsonText.replace(/[“”‘’]/g, '"');

                    console.log("Attempting to parse JSON:", jsonText);

                    let parsed;
                    try {
                        parsed = JSON.parse(jsonText);
                    } catch (parseError) {
                        console.error("JSON Parse Error:", parseError);
                        console.error("Problematic JSON Text:", jsonText);
                        throw new Error(`Failed to parse quiz data. The response was not valid JSON. Details: ${parseError.message}`);
                    }

                    if (Array.isArray(parsed) && parsed.length > 0) {
                        const isValid = parsed.every(q =>
                            q.question && Array.isArray(q.options) && q.options.length === 4 && q.correctAnswer
                        );
                        if (isValid) {
                            setQuizData(parsed);
                            setLoadingProgress(100);
                            setTimeout(() => setLoading(false), 500);
                        } else {
                            throw new Error('Generated quiz data has an invalid structure. Each question must have "question", "options" (array of 4), and "correctAnswer".');
                        }
                    } else {
                        throw new Error('Parsed data is not a valid array of quiz questions or is empty.');
                    }
                } else {
                    throw new Error('Unexpected API response structure or no content generated.');
                }
            } catch (err) {
                console.error("Quiz API Error:", err);
                setError(`Failed to load quiz: ${err.message}. This might be due to an invalid prompt or API issues. Please try again.`);
            } finally {
                clearInterval(progressInterval);
                if (!error) {
                    setLoadingProgress(100);
                    setTimeout(() => setLoading(false), 500);
                }
            }
        };

        fetchQuiz();
    }, [quizType, promptText, language, difficulty, API_KEY]);

    const handleAnswerSelect = (optionKey) => {
        if (!showAnswerFeedback) {
            setSelectedAnswers({
                ...selectedAnswers,
                [currentQuestionIndex]: optionKey,
            });
            setError('');
        }
    };

    const handleNextQuestion = () => {
        if (selectedAnswers[currentQuestionIndex] === undefined) {
            setError('Please select an answer before proceeding.');
            setTimeout(() => setError(''), 2000);
            return;
        }

        const currentQuestion = quizData[currentQuestionIndex];
        if (currentQuestion && selectedAnswers[currentQuestionIndex] === currentQuestion.correctAnswer) {
            setScore(prevScore => prevScore + 1);
        }

        setShowAnswerFeedback(true);

        setTimeout(() => {
            setShowAnswerFeedback(false);
            if (currentQuestionIndex < quizData.length - 1) {
                setCurrentQuestionIndex(prevIndex => prevIndex + 1);
            } else {
                setShowResults(true);
            }
        }, 1200);
    };

    const handleGoBack = () => {
        navigate('/');
    };

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="loading-container">
                    <div className="loading-spinner">
                        <div className="spinner-circle"></div>
                        <div className="spinner-circle"></div>
                        <div className="spinner-circle"></div>
                        <div className="spinner-circle"></div>
                    </div>
                    <h1 className="loading-title">Crafting Your Quiz...</h1>
                    <p className="loading-subtitle">
                        {quizType === 'default' 
                            ? `Generating a ${difficulty} level ${language} quiz` 
                            : `Creating a custom quiz about "${promptText}"`}
                    </p>
                    <div className="loading-progress">
                        <div 
                            className="loading-progress-bar" 
                            style={{ width: `${loadingProgress}%` }}
                        ></div>
                    </div>
                    <p className="loading-text">This might take a moment. Please don't refresh the page.</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-screen">
                <div className="error-container">
                    <div className="error-icon">
                        <svg viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                        </svg>
                    </div>
                    <h2 className="error-title">Oops! Something went wrong</h2>
                    <p className="error-message">{error}</p>
                    <button 
                        className="error-button"
                        onClick={handleGoBack}
                    >
                        Go Back to Quiz Selection
                    </button>
                </div>
            </div>
        );
    }

    if (!loading && quizData.length === 0 && !error) {
        return (
            <div className="empty-screen">
                <div className="empty-container">
                    <div className="empty-icon">
                        <svg viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                        </svg>
                    </div>
                    <h2 className="empty-title">No Quiz Generated</h2>
                    <p className="empty-message">
                        We couldn't generate a quiz with the selected preferences. Please try different options.
                    </p>
                    <button 
                        className="empty-button"
                        onClick={handleGoBack}
                    >
                        Go Back to Quiz Selection
                    </button>
                </div>
            </div>
        );
    }

    const currentQuestion = quizData[currentQuestionIndex];
    if (!currentQuestion) {
        return (
            <div className="error-screen">
                <div className="error-container">
                    <p className="error-message">An unexpected error occurred: Question data is missing.</p>
                    <button
                        className="error-button"
                        onClick={handleGoBack}
                    >
                        Go Back to Quiz Selection
                    </button>
                </div>
            </div>
        );
    }

    const optionKeys = ['A', 'B', 'C', 'D'];
    const isAnswered = selectedAnswers[currentQuestionIndex] !== undefined;
    const isCurrentAnswerCorrect = currentQuestion && selectedAnswers[currentQuestionIndex] === currentQuestion.correctAnswer;

    if (showResults) {
        return (
            <div className="results-screen">
                <div className="results-container">
                    <h2 className="results-title">Quiz Completed!</h2>
                    
                    <div className="results-score">
                        <div className="score-circle">
                            <svg viewBox="0 0 100 100">
                                <circle className="score-circle-bg" cx="50" cy="50" r="45"/>
                                <circle 
                                    className="score-circle-fill"
                                    cx="50" 
                                    cy="50" 
                                    r="45"
                                    style={{
                                        strokeDashoffset: 283 - (283 * (score / quizData.length))
                                    }}
                                />
                            </svg>
                            <div className="score-text">
                                {score}/{quizData.length}
                            </div>
                        </div>
                        <p className="score-message">
                            {score === quizData.length ? 'Perfect! 🎉' : 
                             score >= quizData.length * 0.8 ? 'Great job! 👍' : 
                             score >= quizData.length * 0.5 ? 'Good effort! 😊' : 'Keep practicing! 💪'}
                        </p>
                    </div>

                    <h3 className="results-subtitle">Review Your Answers:</h3>

                    <div className="results-list">
                        {quizData.map((q, index) => {
                            const userAnswer = selectedAnswers[index];
                            const isCorrect = userAnswer === q.correctAnswer;

                            return (
                                <div 
                                    key={index}
                                    className={`result-item ${isCorrect ? 'correct' : 'incorrect'}`}
                                >
                                    <p className="result-question">Q{index + 1}: {q.question}</p>
                                    <ul className="result-options">
                                        {q.options.map((option, optIndex) => {
                                            const optionKey = optionKeys[optIndex];
                                            const isSelected = selectedAnswers[index] === optionKey;
                                            const isCorrectOption = optionKey === q.correctAnswer;

                                            return (
                                                <li 
                                                    key={optIndex}
                                                    className={`
                                                        ${isCorrectOption ? 'correct-option' : ''}
                                                        ${isSelected && !isCorrectOption ? 'incorrect-selected' : ''}
                                                    `}
                                                >
                                                    {option}
                                                    {isCorrectOption && <span className="correct-badge">✓ Correct</span>}
                                                    {isSelected && !isCorrect && <span className="incorrect-badge">✗ Your Answer</span>}
                                                </li>
                                            );
                                        })}
                                    </ul>
                                    <p className="correct-answer-text">
                                        <strong>Correct Answer</strong>: {q.options[optionKeys.indexOf(q.correctAnswer)]}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                    
                    <button
                        className="results-button"
                        onClick={handleGoBack}
                    >
                        Go Back to Quiz Homepage
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="quiz-screen">
            <div className="quiz-container">
                <h2 className="quiz-header">
                    {quizType === 'default' ? 'Default Quiz' : 'Custom AI Quiz'}: {language} - {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} {quizType === 'prompt' && `(${promptText})`}
                </h2>

                <div className="question-card">
                    <p className="question-counter">
                        Question {currentQuestionIndex + 1} of {quizData.length}
                    </p>
                    
                    <h3 className="question-text">
                        {currentQuestion.question}
                    </h3>
                    
                    <ul className="options-list">
                        {currentQuestion.options?.map((option, optIndex) => {
                            const optionKey = optionKeys[optIndex];
                            const isSelected = selectedAnswers[currentQuestionIndex] === optionKey;
                            const isCorrectOption = optionKey === currentQuestion.correctAnswer;

                            return (
                                <li
                                    key={optIndex}
                                    className={`
                                        ${isSelected ? 'selected' : ''}
                                        ${showAnswerFeedback ? 
                                            (isCorrectOption ? 'correct' : 
                                            (isSelected ? 'incorrect' : '')) : ''}
                                    `}
                                    onClick={() => !showAnswerFeedback && handleAnswerSelect(optionKey)}
                                >
                                    {option}
                                </li>
                            );
                        })}
                    </ul>

                    {showAnswerFeedback && (
                        <div className={`feedback ${isCurrentAnswerCorrect ? 'correct-feedback' : 'incorrect-feedback'}`}>
                            {isCurrentAnswerCorrect ? (
                                <>
                                    Correct! 🎉
                                    <div className="confetti">
                                        {[...Array(20)].map((_, i) => (
                                            <div key={i} className="confetti-piece"></div>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <>
                                    Incorrect. 😕
                                    <p className="correct-answer">
                                        The correct answer was: <span>{currentQuestion.options[optionKeys.indexOf(currentQuestion.correctAnswer)]}</span>
                                    </p>
                                </>
                            )}
                        </div>
                    )}
                </div>

                {error && (
                    <p className="error-message">
                        {error}
                    </p>
                )}

                <div className="navigation">
                    <button
                        className={`next-button ${!isAnswered && !showAnswerFeedback ? 'disabled' : ''}`}
                        onClick={handleNextQuestion}
                        disabled={!isAnswered && !showAnswerFeedback}
                    >
                        {currentQuestionIndex === quizData.length - 1 ? 'Show Score' : 'Next Question'}
                        {currentQuestionIndex === quizData.length - 1 && (
                            <span className="trophy">🏆</span>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Quizview;
