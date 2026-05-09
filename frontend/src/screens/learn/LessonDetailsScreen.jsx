import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import colors from "../../constants/colors";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { getWords, startLesson } from "../../features/learn/learnThunks";
import { getQuiz, getQuizStatus } from "../../features/quiz/quizThunks";
import { clearQuizErrors } from "../../features/quiz/quizSlice";
import LoadingScreen from "../shared/LoadingScreen";

const LessonDetailsScreen = ({
  route: {
    params: { lesson },
  },
}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const {
    isQuizStatusFetching,
    quizStatusFetchingError,
    isQuizTaken,
    isQuizFetching,
    quiz,
    quizFetchingError,
  } = useSelector((state) => state.quiz);
  const {
    isStartingLesson,
    startingLessonError,
    isWordsFetching,
    wordsFetchingError,
    words,
  } = useSelector((state) => state.learn);
  const { user } = useSelector((state) => state.auth);

  const [isTakeQuizPressed, setIsTakeQuizPressed] = useState(false);
  const [isErrorClearPressed, setIsErrorClearPressed] = useState(false);

  useEffect(() => {
    if (lesson) {
      dispatch(getQuizStatus({ lessonTitle: lesson.title }));
    }

    return () => {
      dispatch(clearQuizErrors());
    };
  }, [isQuizTaken, navigation]);

  const handleNavigation = async () => {
    if (lesson.status === "not started") {
      await dispatch(startLesson(lesson._id));
    }

    if (words && words.length > 0 && words[0].lessonTitle === lesson.title) {
      navigation.replace("Word", {
        words,
        lessonId: lesson._id,
        lessonNumber: lesson.lessonNumber,
      });
    } else {
      dispatch(getWords(lesson.title));
    }
  };

  const handleQuiz = async () => {
    if (isQuizTaken) {
      navigation.navigate("QuizResult", { lessonTitle: lesson.title });
      return;
    }

    await dispatch(getQuiz({ level: user.level, lessonTitle: lesson.title }));
    setIsTakeQuizPressed(true);
  };

  useEffect(() => {
    if (
      isTakeQuizPressed &&
      !isQuizFetching &&
      !quizFetchingError &&
      !isErrorClearPressed &&
      quiz
    ) {
      navigation.navigate("QuizPrompt");
    }

    return () => {
      setIsErrorClearPressed(false);
    };
  }, [isTakeQuizPressed, isQuizFetching, quizFetchingError, quiz, navigation]);

  const handleClearError = () => {
    dispatch(clearQuizErrors());
    setIsErrorClearPressed(true);
  };

  if (isQuizStatusFetching) {
    return <LoadingScreen />;
  }

  const iconColors = {
    chat: ["#3b82f6", "#2563eb"],
    person: ["#f97316", "#ea580c"],
    home: ["#10b981", "#059669"],
    restaurant: ["#ec4899", "#db2777"],
    flight: ["#f59e0b", "#d97706"],
    favorite: ["#a855f7", "#9333ea"],
    work: ["#8b5a3c", "#6b4423"],
    school: ["#6366f1", "#4f46e5"],
    nature: ["#84cc16", "#65a30d"],
    devices: ["#64748b", "#475569"],
  };

  const colors = iconColors[lesson.icon] || ["#667eea", "#764ba2"];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Lesson Header Card */}
      <LinearGradient
        colors={colors}
        style={styles.headerCard}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.iconCircle}>
          <MaterialIcons name={lesson.icon} size={48} color="#fff" />
        </View>
        <Text style={styles.lessonTitle}>{lesson.title}</Text>
        <View style={styles.lessonBadge}>
          <Text style={styles.lessonBadgeText}>
            Lesson {lesson.lessonNumber}
          </Text>
        </View>
      </LinearGradient>

      <View style={styles.contentContainer}>
        {/* Error Display */}
        {(startingLessonError ||
          quizStatusFetchingError ||
          quizFetchingError ||
          wordsFetchingError) && (
          <View style={styles.errorCard}>
            <MaterialIcons name="error-outline" size={24} color="#ef4444" />
            <View style={styles.errorContent}>
              <Text style={styles.errorText}>
                {startingLessonError ||
                  wordsFetchingError ||
                  quizStatusFetchingError ||
                  quizFetchingError}
              </Text>
              <TouchableOpacity
                style={styles.clearButton}
                onPress={handleClearError}
              >
                <Text style={styles.clearButtonText}>Dismiss</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Status Information */}
        <View style={styles.infoCard}>
          {lesson.status === "not started" && (
            <>
              <MaterialIcons name="start" size={32} color="#667eea" />
              <Text style={styles.infoTitle}>Ready to Begin</Text>
              <Text style={styles.infoText}>
                This lesson covers vocabulary and phrases related to{" "}
                {lesson.title}. Complete the lesson to unlock the quiz and test
                your knowledge.
              </Text>
            </>
          )}

          {lesson.status === "in progress" && (
            <>
              <MaterialIcons name="play-circle-filled" size={32} color="#f59e0b" />
              <Text style={styles.infoTitle}>Continue Learning</Text>
              <Text style={styles.infoText}>
                You're making great progress! Continue where you left off.
              </Text>
            </>
          )}

          {lesson.status === "completed" && user.level !== "Expert" && (
            <>
              <MaterialIcons name="check-circle" size={32} color="#10b981" />
              <Text style={styles.infoTitle}>Lesson Completed!</Text>
              <Text style={styles.infoText}>
                {isQuizTaken
                  ? "You've completed this lesson and taken the quiz. View your results or continue learning."
                  : "Great job completing this lesson! Take the quiz to test your knowledge and move forward."}
              </Text>
            </>
          )}
        </View>

        {/* Action Buttons */}
        {isStartingLesson || isWordsFetching || isQuizFetching ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#667eea" />
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        ) : (
          <View style={styles.buttonsContainer}>
            {lesson.status === "completed" && user.level !== "Expert" && (
              <TouchableOpacity
                style={styles.button}
                onPress={handleQuiz}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={["#ec4899", "#db2777"]}
                  style={styles.buttonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <MaterialIcons
                    name={isQuizTaken ? "assessment" : "quiz"}
                    size={20}
                    color="#fff"
                  />
                  <Text style={styles.buttonText}>
                    {isQuizTaken ? "View Quiz Result" : "Take Quiz"}
                  </Text>
                  <MaterialIcons
                    name="arrow-forward"
                    size={20}
                    color="#fff"
                  />
                </LinearGradient>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.button}
              onPress={handleNavigation}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={colors}
                style={styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <MaterialIcons
                  name={
                    lesson.status === "not started"
                      ? "play-arrow"
                      : "play-circle-filled"
                  }
                  size={20}
                  color="#fff"
                />
                <Text style={styles.buttonText}>
                  {lesson.status === "in progress" && "Continue Learning"}
                  {lesson.status === "not started" && "Start Lesson"}
                  {lesson.status === "completed" && "Review Lesson"}
                </Text>
                <MaterialIcons name="arrow-forward" size={20} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  headerCard: {
    padding: 32,
    alignItems: "center",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  lessonTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 12,
  },
  lessonBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  lessonBadgeText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
  contentContainer: {
    padding: 20,
  },
  errorCard: {
    flexDirection: "row",
    backgroundColor: "#fee2e2",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  errorContent: {
    flex: 1,
    marginLeft: 12,
  },
  errorText: {
    color: "#ef4444",
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 20,
  },
  clearButton: {
    alignSelf: "flex-start",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  clearButtonText: {
    color: "#ef4444",
    fontWeight: "600",
    fontSize: 14,
  },
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1f2937",
    marginTop: 12,
    marginBottom: 12,
    textAlign: "center",
  },
  infoText: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 24,
  },
  loadingContainer: {
    alignItems: "center",
    paddingVertical: 32,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#6b7280",
  },
  buttonsContainer: {
    gap: 12,
  },
  button: {
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    flex: 1,
    textAlign: "center",
  },
});

export default LessonDetailsScreen;