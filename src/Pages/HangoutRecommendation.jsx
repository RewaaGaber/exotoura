import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { Button } from 'primereact/button';
import { ProgressBar } from 'primereact/progressbar';
import { useNavigate } from 'react-router-dom';
import { FaMagic, FaStar, FaHeart, FaUsers, FaCalendarAlt, FaGlassCheers, FaUtensils, FaHiking, FaUmbrellaBeach, FaCoffee, FaWalking, FaLandmark, FaPlus, FaMapMarkerAlt } from 'react-icons/fa';
import axios from 'axios';

// Constants
const questions = [
  {
    id: 1,
    question: "What type of hangout are you looking for?",
    options: [
      { label: "Coffee & Chat", value: "coffee", icon: <FaCoffee className="text-2xl" />, color: "from-amber-400 to-amber-600", description: "Relaxed conversations over coffee" },
      { label: "Walking Tour", value: "walking", icon: <FaWalking className="text-2xl" />, color: "from-green-400 to-green-600", description: "Explore the city on foot" },
      { label: "Street Food", value: "streetfood", icon: <FaUtensils className="text-2xl" />, color: "from-orange-400 to-orange-600", description: "Discover local street food" },
      { label: "Museum Visit", value: "museum", icon: <FaLandmark className="text-2xl" />, color: "from-indigo-400 to-indigo-600", description: "Cultural and historical exploration" },
      { label: "Beach Day", value: "beach", icon: <FaUmbrellaBeach className="text-2xl" />, color: "from-blue-400 to-blue-600", description: "Relax by the sea" },
      { label: "Hiking Trip", value: "hiking", icon: <FaHiking className="text-2xl" />, color: "from-green-400 to-green-600", description: "Outdoor adventure" }
    ]
  },
  {
    id: 2,
    question: "When would you like to hang out?",
    options: [
      { label: "Today", value: "today", icon: <FaCalendarAlt className="text-2xl" />, color: "from-blue-400 to-blue-600", description: "Looking for something happening today" },
      { label: "This Week", value: "week", icon: <FaCalendarAlt className="text-2xl" />, color: "from-teal-400 to-teal-600", description: "Events happening this week" },
      { label: "Upcoming", value: "upcoming", icon: <FaCalendarAlt className="text-2xl" />, color: "from-orange-400 to-orange-600", description: "Future events and activities" }
    ]
  },
  {
    id: 3,
    question: "What's your preferred group size?",
    options: [
      { label: "Small Group (2-5)", value: "small", icon: <FaHeart className="text-2xl" />, color: "from-pink-400 to-pink-600", description: "Intimate gatherings" },
      { label: "Medium Group (6-10)", value: "medium", icon: <FaUsers className="text-2xl" />, color: "from-teal-400 to-teal-600", description: "Social gatherings" },
      { label: "Large Group (10+)", value: "large", icon: <FaGlassCheers className="text-2xl" />, color: "from-red-400 to-red-600", description: "Party atmosphere" }
    ]
  }
];

// Components
const IntroScreen = ({ onStart }) => {
  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      scale: [1, 1.1, 1],
      rotate: [0, 5, -5, 0],
      transition: { duration: 1, repeat: Infinity, repeatType: "reverse" }
    });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], opacity: { duration: 0.8 } }}
        whileHover={{ scale: 1.01 }}
        className="text-center p-8 bg-white rounded-2xl shadow-xl max-w-4xl w-full border border-gray-100"
      >
        <MagicIcon controls={controls} />
        <IntroText />
        <StartButton onStart={onStart} />
      </motion.div>
    </motion.div>
  );
};

const MagicIcon = ({ controls }) => (
  <motion.div
    animate={controls}
    className="w-40 h-40 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg relative overflow-hidden"
  >
    <motion.div
      initial={{ scale: 0, rotate: -45 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1], rotate: { duration: 0.8 } }}
      whileHover={{ rotate: 360, transition: { duration: 1.2, ease: "easeInOut" } }}
    >
      <FaMagic className="text-5xl text-white" />
    </motion.div>
  </motion.div>
);

const IntroText = () => (
  <>
    <motion.h1
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1], opacity: { duration: 0.8 } }}
      whileHover={{ scale: 1.02 }}
      className="text-4xl font-bold text-gray-800 mb-4"
    >
      Discover Your Perfect Hangout
    </motion.h1>
    <motion.p
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1], opacity: { duration: 0.8 } }}
      whileHover={{ scale: 1.01 }}
      className="text-gray-600 mb-8 text-lg max-w-2xl mx-auto"
    >
      Let's find the ideal experience tailored just for you ✨
    </motion.p>
  </>
);

const StartButton = ({ onStart }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1], opacity: { duration: 0.8 } }}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className="mb-4"
  >
    <Button
      label="Begin Your Journey"
      className="bg-gradient-to-r from-blue-500 to-purple-600 border-none text-white shadow-md hover:shadow-lg transition-all duration-300 text-lg py-4 px-8"
      onClick={onStart}
    />
  </motion.div>
);

const QuestionScreen = ({ currentQuestion, answers, onAnswer, onBack, progress }) => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 md:p-8">
    <div className="max-w-6xl mx-auto">
      <ProgressHeader progress={progress} currentQuestion={currentQuestion} />
      <QuestionCard
        question={questions[currentQuestion]}
        answers={answers}
        onAnswer={onAnswer}
        onBack={onBack}
        currentQuestion={currentQuestion}
      />
    </div>
  </div>
);

const ProgressHeader = ({ progress, currentQuestion }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="text-center mb-4 md:mb-6"
  >
    <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
      Let's Find Your Perfect Match
    </h1>
    <div className="max-w-md mx-auto">
      <ProgressBar
        value={progress}
        className="h-2 bg-gray-100 rounded-full overflow-hidden"
        showValue={false}
        pt={{
          value: { className: 'bg-gradient-to-r from-blue-500 to-purple-600' }
        }}
      />
      <div className="text-sm text-gray-500 mt-1">
        Question {currentQuestion + 1} of {questions.length}
      </div>
    </div>
  </motion.div>
);

const QuestionCard = ({ question, answers, onAnswer, onBack, currentQuestion }) => (
  <AnimatePresence mode="wait">
    <motion.div
      key={currentQuestion}
      initial={{ x: 50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -50, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl p-4 md:p-6 shadow-md border border-gray-100"
    >
      <BackButton onBack={onBack} currentQuestion={currentQuestion} />
      <QuestionTitle question={question.question} />
      <OptionsGrid
        options={question.options}
        currentAnswer={answers[currentQuestion]}
        onAnswer={onAnswer}
      />
    </motion.div>
  </AnimatePresence>
);

const BackButton = ({ onBack, currentQuestion }) => (
  <div className="flex justify-first mb-2">
    {currentQuestion >0 && (
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          icon="pi pi-arrow-left"
          className="p-button-rounded p-button-text"
          onClick={onBack}
        />
      </motion.div>
    )}
  </div>
);

const QuestionTitle = ({ question }) => (
  <motion.h2
    className="text-xl md:text-2xl font-semibold mb-4 text-gray-800 text-center"
    initial={{ y: -20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ delay: 0.2 }}
  >
    {question}
  </motion.h2>
);

const OptionsGrid = ({ options, currentAnswer, onAnswer }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
    {options.map((option, index) => (
      <OptionCard
        key={option.value}
        option={option}
        index={index}
        isSelected={currentAnswer === option.value}
        onSelect={() => onAnswer(option.value)}
      />
    ))}
  </div>
);

const OptionCard = ({ option, index, isSelected, onSelect }) => (
  <motion.div
    initial={{ x: 50, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    transition={{ delay: index * 0.1 }}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className={`p-3 md:p-4 rounded-xl cursor-pointer border-2 transition-all duration-200 ${
      isSelected
        ? 'border-blue-500 bg-blue-50 shadow-md'
        : 'border-gray-200 hover:border-blue-300 bg-white'
    }`}
    onClick={onSelect}
  >
    <div className="flex flex-col items-center text-center">
      <div className={`w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-r ${option.color} flex items-center justify-center mb-2 shadow-sm`}>
        {option.icon}
      </div>
      <span className="font-medium text-gray-800 text-sm md:text-base mb-1">{option.label}</span>
      <span className="text-gray-500 text-xs">{option.description}</span>
    </div>
  </motion.div>
);

const ResultsScreen = ({ recommendedHangouts, noMatches, onRestart, navigate }) => (
  <div className="space-y-6">
    {noMatches ? (
      <NoMatchesScreen onRestart={onRestart} navigate={navigate} />
    ) : (
      <RecommendedHangoutsScreen
        recommendedHangouts={recommendedHangouts}
        onRestart={onRestart}
        navigate={navigate}
      />
    )}
  </div>
);

const NoMatchesScreen = ({ onRestart, navigate }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50"
  >
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 10 }}
      className="text-center p-8 rounded-xl border border-indigo-100 shadow-lg max-w-md w-full bg-white"
    >
      <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
        <FaPlus className="text-2xl md:text-3xl text-white" />
      </div>
      <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text mb-2">
        No Matches Found
      </h2>
      <p className="text-gray-600 mb-4 max-w-md mx-auto text-sm">
        We couldn't find any hangouts matching your preferences. But don't worry, you can create your own!
      </p>
      <div className="flex flex-col md:flex-row justify-center gap-2">
        <ActionButton
          label="Create Hangout"
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
          onClick={() => navigate('/hangouts/create')}
        />
        <ActionButton
          label="Try Again"
          className="bg-white text-indigo-600 border-2 border-indigo-600"
          onClick={onRestart}
        />
      </div>
    </motion.div>
  </motion.div>
);

const RecommendedHangoutsScreen = ({ recommendedHangouts, onRestart, navigate }) => (
  <>
    <ResultsHeader />
    <HangoutsGrid hangouts={recommendedHangouts} navigate={navigate} />
    <ActionButtons onRestart={onRestart} navigate={navigate} />
  </>
);

const ResultsHeader = () => (
  <motion.div
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    transition={{ type: "spring", stiffness: 200, damping: 10 }}
    className="text-center mb-4"
  >
    <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
      <FaStar className="text-2xl text-white" />
    </div>
    <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
      We Found Your Perfect Matches!
    </h2>
    <p className="text-gray-600 mb-4 text-sm">
      Based on your preferences, we've found these amazing hangouts for you
    </p>
  </motion.div>
);

const HangoutsGrid = ({ hangouts, navigate }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
    {hangouts.map((hangout, index) => (
      <HangoutCard key={hangout._id} hangout={hangout} index={index} navigate={navigate} />
    ))}
  </div>
);

const HangoutCard = ({ hangout, index, navigate }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
  >
    <HangoutImage hangout={hangout} />
    <HangoutDetails hangout={hangout} navigate={navigate} />
  </motion.div>
);

const HangoutImage = ({ hangout }) => (
  <div className="relative h-48 overflow-hidden">
    <img
      src={hangout.images?.[0] || 'https://images.unsplash.com/photo-1516026672322-bc52d61a6d9a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'}
      alt={hangout.name}
      className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
    <HangoutImageOverlay hangout={hangout} />
  </div>
);

const HangoutImageOverlay = ({ hangout }) => (
  <>
    <div className="absolute bottom-0 left-0 right-0 p-4">
      <h3 className="text-xl font-bold text-white mb-1">{hangout.name}</h3>
      <div className="flex items-center gap-2 text-white/90">
        <FaUsers className="text-white/80" />
        <span>{hangout.participants?.length || 0} going</span>
      </div>
    </div>
    <div className="absolute top-4 right-4">
      <span className="bg-gradient-to-br from-blue-300 to-purple-700 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
        {hangout.type}
      </span>
    </div>
  </>
);

const HangoutDetails = ({ hangout, navigate }) => (
  <div className="p-6">
    <p className="text-gray-600 mb-4 line-clamp-2">{hangout.description}</p>
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2 text-gray-500">
        <FaCalendarAlt className="text-purple-500" />
        <span>{new Date(hangout.date).toLocaleDateString()}</span>
      </div>
      <div className="flex items-center gap-2 text-gray-500">
        <FaMapMarkerAlt className="text-purple-500" />
        <span>{hangout.location}</span>
      </div>
    </div>
    <ViewDetailsButton hangout={hangout} navigate={navigate} />
  </div>
);

const ViewDetailsButton = ({ hangout, navigate }) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className="w-full bg-gradient-to-br from-blue-300 to-purple-700 text-white py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300"
    onClick={() => navigate(`/hangouts/${hangout._id}`)}
  >
    View Details
  </motion.button>
);

const ActionButtons = ({ onRestart, navigate }) => (
  <div className="flex flex-col md:flex-row justify-center gap-2 mt-4">
    <ActionButton
      label="Browse All Hangouts"
      className="bg-white hover:bg-gray-50 text-blue-600 border border-blue-600"
      onClick={() => navigate('/hangouts')}
    />
    <ActionButton
      label="Start Over"
      className="bg-gradient-to-r from-blue-500 to-purple-600 border-none text-white"
      onClick={onRestart}
    />
  </div>
);

const ActionButton = ({ label, className, onClick }) => (
  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
    <Button
      label={label}
      className={`py-2 px-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 text-sm ${className}`}
      onClick={onClick}
    />
  </motion.div>
);

// Main Component
const HangoutRecommendation = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [hangouts, setHangouts] = useState([]);
  const [recommendedHangouts, setRecommendedHangouts] = useState([]);
  const [noMatches, setNoMatches] = useState(false);

  useEffect(() => {
    const fetchHangouts = async () => {
      try {
        const response = await axios.get('https://exotoura-api.vercel.app/hangout?limit=50');
        setHangouts(response.data.data.hangouts);
      } catch (error) {
        console.error('Error fetching hangouts:', error);
      }
    };
    fetchHangouts();
  }, []);

  // دالة للتحقق من الشروط
  const checkHangoutMatch = (hangout, selectedType, answers) => {
    const hangoutType = hangout.type.toLowerCase();
    const hangoutDate = new Date(hangout.date);
    const today = new Date();
    const oneWeekFromNow = new Date();
    oneWeekFromNow.setDate(today.getDate() + 7);
    const participants = hangout.participants?.length || 0;

    // التحقق من النوع
    const typeMatches =
      (selectedType === "coffee" && (hangoutType.includes("coffee") || hangoutType.includes("chat") || hangoutType.includes("cafe"))) ||
      (selectedType === "walking" && (hangoutType.includes("walking") || hangoutType.includes("tour") || hangoutType.includes("explore"))) ||
      (selectedType === "streetfood" && (hangoutType.includes("food") || hangoutType.includes("street") || hangoutType.includes("tasting"))) ||
      (selectedType === "museum" && (hangoutType.includes("museum") || hangoutType.includes("cultural") || hangoutType.includes("art"))) ||
      (selectedType === "beach" && (hangoutType.includes("beach") || hangoutType.includes("sea") || hangoutType.includes("coast"))) ||
      (selectedType === "hiking" && (hangoutType.includes("hiking") || hangoutType.includes("outdoor") || hangoutType.includes("nature")));

    // التحقق من التاريخ
    const dateMatches =
      (answers[1] === "today" && hangoutDate.toDateString() === today.toDateString()) ||
      (answers[1] === "week" && hangoutDate >= today && hangoutDate <= oneWeekFromNow) ||
      (answers[1] === "upcoming" && hangoutDate > oneWeekFromNow);

    // التحقق من عدد المشاركين
    const participantsMatch =
      (answers[2] === "small" && participants <= 5) ||
      (answers[2] === "medium" && participants > 5 && participants <= 10) ||
      (answers[2] === "large" && participants > 10);

    // إذا كانت كل الشروط متوافقة، يرجع true
    return typeMatches && dateMatches || participantsMatch;
  };

  const calculateRecommendations = () => {
    const selectedType = answers[0]?.toLowerCase();

    const scoredHangouts = hangouts.filter(hangout => {
      // التحقق إذا كان الأنشطة تتوافق مع الشروط
      return checkHangoutMatch(hangout, selectedType, answers);
    });

    // إذا كانت الأنشطة متوافقة مع الشروط، نقوم بترتيبها حسب الأولوية
    const sortedHangouts = scoredHangouts.sort((a, b) => b.score - a.score);
    
    if (sortedHangouts.length === 0) {
      setRecommendedHangouts([]);
      setNoMatches(true);
    } else {
      setRecommendedHangouts(sortedHangouts.slice(0, 3));
      setNoMatches(false);
    }
  };

  const handleAnswer = async (value) => {
    setAnswers({ ...answers, [currentQuestion]: value });
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateRecommendations();
      setShowResult(true);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResult(false);
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  if (showIntro) {
    return <IntroScreen onStart={() => setShowIntro(false)} />;
  }

  if (showResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <ResultsScreen
            recommendedHangouts={recommendedHangouts}
            noMatches={noMatches}
            onRestart={handleRestart}
            navigate={navigate}
          />
        </div>
      </div>
    );
  }

  return (
    <QuestionScreen
      currentQuestion={currentQuestion}
      answers={answers}
      onAnswer={handleAnswer}
      onBack={handleBack}
      progress={progress}
    />
  );
};


export default HangoutRecommendation;