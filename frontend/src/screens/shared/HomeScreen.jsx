import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import colors from "../../constants/colors";
import { useDispatch, useSelector } from "react-redux";
import LoadingScreen from "./LoadingScreen";
import { fetchUserStats } from "../../features/profile/profileThunks";
import { resetStats } from "../../features/profile/profileSlice";
import logOut from "../../features/rootAction";

const HomeScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const { user } = useSelector((state) => state.auth);
  const { stats } = useSelector((state) => state.profile);

  useEffect(() => {
    if (isFocused) {
      dispatch(fetchUserStats());
    } else {
      dispatch(resetStats());
    }
  }, [isFocused]);

  if (!user || !stats) {
    return <LoadingScreen />;
  }

  const handleLearningResourcePress = () => {
    if (user.isLearningStarted) {
      navigation.navigate("Vocabulary Lessons");
    } else {
      navigation.navigate("StartLearningPrompt");
    }
  };

  const handleWordOfTheDayPress = () => {
    navigation.navigate("Word of the Day");
  };

  const totalLessons = 10;
  const { isLevelUpTestTakenToday, totalLessonsCompleted } = stats;

  const handleLevelUpAssessmentPress = () => {
    if (isLevelUpTestTakenToday) {
      alert(
        "You can only take the test once a day. Please try again tomorrow."
      );
    } else {
      navigation.navigate("LevelUpTestPrompt");
    }
  };

  const handleChatAIPress = () => {
    navigation.navigate("ChatScreen");
  };

  const handleSettingsPress = () => {
    Alert.alert("Settings", "Choose an option", [
      { text: "View Profile", onPress: () => navigation.navigate("Profile") },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: () => dispatch(logOut()),
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const progressPercentage = (totalLessonsCompleted / totalLessons) * 100;

  const dailyTips = [
    "Try to learn 5 new words every day to build steady progress.",
    "Use new vocabulary in a sentence — it helps memory stick.",
    "Review yesterday's words before learning new ones.",
    "Don't fear mistakes — they're proof you're learning.",
    "Read English content aloud to improve pronunciation.",
    "Set a small daily goal — consistency beats intensity.",
  ];
  const dailyTip = dailyTips[new Date().getDate() % dailyTips.length];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header with Gradient */}
      <LinearGradient
        colors={["#667eea", "#764ba2"]}
        style={styles.headerGradient}
      >
        <TouchableOpacity
          style={styles.profileHeader}
          onPress={() => navigation.navigate("Profile")}
        >
          <View style={styles.profileInfo}>
            <Image
              source={require("../../assets/profile.png")}
              style={styles.profileImage}
            />
            <View style={styles.userInfo}>
              <Text style={styles.welcomeText}>Welcome back,</Text>
              <Text style={styles.userName}>{user.name}!</Text>
            </View>
          </View>
          <View style={styles.levelBadge}>
            <MaterialIcons name="star" size={16} color="#fbbf24" />
            <Text style={styles.levelText}>{user.level}</Text>
          </View>
        </TouchableOpacity>

        {/* Progress Card */}
        {user?.level !== "Expert" && (
          <View style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressTitle}>Learning Progress</Text>
              <Text style={styles.progressPercentage}>
                {Math.round(progressPercentage)}%
              </Text>
            </View>
            <View style={styles.progressBarContainer}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${progressPercentage}%` },
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {totalLessonsCompleted} of {totalLessons} lessons completed
            </Text>
          </View>
        )}
      </LinearGradient>

      {/* Action Cards */}
      <View style={styles.cardsContainer}>
        {/* Continue Learning Card */}
        <TouchableOpacity
          style={styles.mainCard}
          onPress={handleLearningResourcePress}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={["#3b82f6", "#2563eb"]}
            style={styles.cardGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.cardIconContainer}>
              <Ionicons name="book" size={32} color="#fff" />
            </View>
            <Text style={styles.cardTitle}>Continue Learning</Text>
            <Text style={styles.cardSubtitle}>
              Expand your vocabulary with engaging lessons
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Grid Cards */}
        <View style={styles.gridContainer}>
          {/* Word of the Day */}
          <TouchableOpacity
            style={styles.gridCard}
            onPress={handleWordOfTheDayPress}
            activeOpacity={0.9}
          >
            <View style={[styles.iconCircle, { backgroundColor: "#dcfce7" }]}>
              <Ionicons name="calendar" size={28} color="#22c55e" />
            </View>
            <Text style={styles.gridCardTitle}>Word of the Day</Text>
          </TouchableOpacity>

          {/* Level-up Test */}
          {user?.level !== "Expert" ? (
            <TouchableOpacity
              style={styles.gridCard}
              onPress={handleLevelUpAssessmentPress}
              activeOpacity={0.9}
            >
              <View style={[styles.iconCircle, { backgroundColor: "#fee2e2" }]}>
                <Ionicons name="trophy" size={28} color="#ef4444" />
              </View>
              <Text style={styles.gridCardTitle}>Level-up Test</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.gridCard}>
              <View style={[styles.iconCircle, { backgroundColor: "#fef3c7" }]}>
                <MaterialIcons name="emoji-events" size={28} color="#f59e0b" />
              </View>
              <Text style={styles.gridCardTitle}>Expert Level!</Text>
            </View>
          )}

          {/* Chat AI */}
          <TouchableOpacity
            style={styles.gridCard}
            onPress={handleChatAIPress}
            activeOpacity={0.9}
          >
            <View style={[styles.iconCircle, { backgroundColor: "#ede9fe" }]}>
              <Ionicons name="chatbox-ellipses" size={28} color="#8b5cf6" />
            </View>
            <Text style={styles.gridCardTitle}>Chat AI</Text>
          </TouchableOpacity>

          {/* Stats Preview */}
          <TouchableOpacity
            style={styles.gridCard}
            onPress={() => navigation.navigate("Profile")}
            activeOpacity={0.9}
          >
            <View style={[styles.iconCircle, { backgroundColor: "#dbeafe" }]}>
              <Ionicons name="stats-chart" size={28} color="#3b82f6" />
            </View>
            <Text style={styles.gridCardTitle}>Your Stats</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Stats Row */}
        <Text style={styles.sectionTitle}>Today at a Glance</Text>
        <View style={styles.quickStatsRow}>
          <View style={styles.quickStatCard}>
            <Ionicons name="flame" size={24} color="#f97316" />
            <Text style={styles.quickStatValue}>{stats.currentStreak}</Text>
            <Text style={styles.quickStatLabel}>Day Streak</Text>
          </View>
          <View style={styles.quickStatCard}>
            <Ionicons name="library" size={24} color="#22c55e" />
            <Text style={styles.quickStatValue}>{stats.totalWordsLearned}</Text>
            <Text style={styles.quickStatLabel}>Words Learned</Text>
          </View>
          <View style={styles.quickStatCard}>
            <Ionicons name="checkmark-done" size={24} color="#8b5cf6" />
            <Text style={styles.quickStatValue}>{stats.totalQuizzesCompleted}</Text>
            <Text style={styles.quickStatLabel}>Quizzes Done</Text>
          </View>
        </View>

        {/* Daily Tip */}
        <View style={styles.tipCard}>
          <View style={styles.tipHeader}>
            <View style={styles.tipIconCircle}>
              <Ionicons name="bulb" size={20} color="#f59e0b" />
            </View>
            <Text style={styles.tipTitle}>Daily Tip</Text>
          </View>
          <Text style={styles.tipText}>{dailyTip}</Text>
        </View>
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
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  profileHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  profileInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 3,
    borderColor: "#fff",
  },
  userInfo: {
    marginLeft: 12,
  },
  welcomeText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: 4,
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  levelBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  levelText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
    marginLeft: 4,
  },
  progressCard: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 16,
    padding: 16,
    backdropFilter: "blur(10px)",
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  progressPercentage: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#fff",
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
  },
  cardsContainer: {
    padding: 20,
  },
  mainCard: {
    marginBottom: 20,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  cardGradient: {
    padding: 24,
  },
  cardIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  gridCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  gridCardTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1f2937",
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1f2937",
    marginTop: 8,
    marginBottom: 12,
  },
  quickStatsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  quickStatCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 8,
    marginHorizontal: 4,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  quickStatValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1f2937",
    marginTop: 6,
  },
  quickStatLabel: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 2,
    textAlign: "center",
  },
  tipCard: {
    backgroundColor: "#fffbeb",
    borderRadius: 16,
    padding: 18,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: "#f59e0b",
  },
  tipHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  tipIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#fef3c7",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#92400e",
  },
  tipText: {
    fontSize: 14,
    color: "#78350f",
    lineHeight: 20,
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 8,
    marginHorizontal: 4,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  actionIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  actionLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
  },
});

export default HomeScreen;