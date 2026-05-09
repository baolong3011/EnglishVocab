import React, { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import colors from "../../constants/colors";
import { useDispatch, useSelector } from "react-redux";
import { fetchLessons, startLearning } from "../../features/learn/learnThunks";
import { resetLoadingAndErrorStates } from "../../features/learn/learnSlice";

const StartLearningPrompt = () => {
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const { isStarting, isStarted, startingError } = useSelector(
    (state) => state.learn
  );
  const { user } = useSelector((state) => state.auth);

  const handleStartLearning = async () => {
    await dispatch(startLearning());
    await dispatch(fetchLessons());
  };

  useEffect(() => {
    if (isStarted) {
      navigation.replace("Vocabulary Lessons");
    }

    return () => {
      dispatch(resetLoadingAndErrorStates());
    };
  }, [isStarted, isFocused]);

  const getLevelInfo = () => {
    switch (user.level) {
      case "Beginner":
        return {
          icon: "rocket-launch",
          title: "Start Your Journey!",
          subtitle: "Welcome to the beginning",
          description:
            "Get ready for an exciting language learning adventure with 10 engaging lessons covering everyday conversations, work, travel, and much more!",
          features: [
            "Essential vocabulary and phrases",
            "Interactive learning experience",
            "Track your progress",
            "Unlock quizzes as you go",
          ],
        };
      case "Intermediate":
        return {
          icon: "trending-up",
          title: "Level Up!",
          subtitle: "Congratulations on reaching Intermediate",
          description:
            "Take your language skills to the next level with more advanced lessons and challenging topics.",
          features: [
            "Advanced vocabulary",
            "Complex sentence structures",
            "Real-world scenarios",
            "Cultural insights",
          ],
        };
      case "Advanced":
        return {
          icon: "emoji-events",
          title: "Master Level!",
          subtitle: "Welcome to Advanced learning",
          description:
            "Challenge yourself with the most sophisticated language content and become fluent.",
          features: [
            "Professional vocabulary",
            "Nuanced expressions",
            "Native-level content",
            "Specialized topics",
          ],
        };
      default:
        return {
          icon: "school",
          title: "Start Learning",
          subtitle: "Begin your journey",
          description: "Start learning with engaging lessons.",
          features: [],
        };
    }
  };

  const levelInfo = getLevelInfo();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={["#667eea", "#764ba2"]}
        style={styles.headerGradient}
      >
        <View style={styles.iconContainer}>
          <MaterialIcons name={levelInfo.icon} size={64} color="#fff" />
        </View>
        <Text style={styles.title}>{levelInfo.title}</Text>
        <Text style={styles.subtitle}>{levelInfo.subtitle}</Text>
      </LinearGradient>

      <View style={styles.contentContainer}>
        {/* Error Display */}
        {startingError && (
          <View style={styles.errorCard}>
            <MaterialIcons name="error-outline" size={24} color="#ef4444" />
            <Text style={styles.errorText}>{startingError}</Text>
          </View>
        )}

        {/* Description Card */}
        <View style={styles.descriptionCard}>
          <Text style={styles.descriptionText}>{levelInfo.description}</Text>
        </View>

        {/* Features List */}
        {levelInfo.features.length > 0 && (
          <View style={styles.featuresCard}>
            <Text style={styles.featuresTitle}>What You'll Learn</Text>
            {levelInfo.features.map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <View style={styles.featureIconContainer}>
                  <MaterialIcons name="check-circle" size={24} color="#10b981" />
                </View>
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Stats Card */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <MaterialIcons name="menu-book" size={32} color="#667eea" />
            <Text style={styles.statNumber}>10</Text>
            <Text style={styles.statLabel}>Lessons</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <MaterialIcons name="quiz" size={32} color="#ec4899" />
            <Text style={styles.statNumber}>10</Text>
            <Text style={styles.statLabel}>Quizzes</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <MaterialIcons name="psychology" size={32} color="#10b981" />
            <Text style={styles.statNumber}>100+</Text>
            <Text style={styles.statLabel}>Words</Text>
          </View>
        </View>

        {/* Start Button */}
        <TouchableOpacity
          style={styles.startButton}
          onPress={handleStartLearning}
          disabled={isStarting || isStarted}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={
              isStarting || isStarted
                ? ["#9ca3af", "#9ca3af"]
                : ["#667eea", "#764ba2"]
            }
            style={styles.startButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            {isStarting ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <MaterialIcons name="play-arrow" size={24} color="#fff" />
                <Text style={styles.startButtonText}>Start Learning</Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
    alignItems: "center",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
  },
  contentContainer: {
    padding: 20,
  },
  errorCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fee2e2",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  errorText: {
    flex: 1,
    marginLeft: 12,
    color: "#ef4444",
    fontSize: 14,
    lineHeight: 20,
  },
  descriptionCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
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
  descriptionText: {
    fontSize: 16,
    color: "#4b5563",
    lineHeight: 26,
    textAlign: "center",
  },
  featuresCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
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
  featuresTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  featureIconContainer: {
    marginRight: 12,
  },
  featureText: {
    flex: 1,
    fontSize: 15,
    color: "#4b5563",
    lineHeight: 22,
  },
  statsCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: "#6b7280",
  },
  statDivider: {
    width: 1,
    backgroundColor: "#e5e7eb",
    marginHorizontal: 8,
  },
  startButton: {
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#667eea",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  startButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    gap: 8,
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
});

export default StartLearningPrompt;