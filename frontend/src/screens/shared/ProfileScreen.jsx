import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useIsFocused } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import colors from "../../constants/colors";
import LoadingScreen from "./LoadingScreen";
import logOut from "../../features/rootAction";
import { fetchUserStats } from "../../features/profile/profileThunks";
import { resetStats } from "../../features/profile/profileSlice";

const ProfileScreen = () => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const { stats } = useSelector((state) => state.profile);
  const { user } = useSelector((state) => state.auth);

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

  const userData = {
    name: user.name,
    profilePicture: require("../../assets/profile.png"),
    level: user.level,
    lessonsCompleted: stats.totalLessonsCompleted,
    practiceQuizResults: {
      highestScore: stats.quizHighestScore,
      averageScore: stats.quizAverageScore,
    },
    longestStreak: stats.longestStreak,
    currentStreak: stats.currentStreak,
    totalWordsLearned: stats.totalWordsLearned,
    totalQuizzesCompleted: stats.totalQuizzesCompleted,
  };

  const StatCard = ({ icon, title, value, gradient, iconBg }) => (
    <View style={styles.statCard}>
      <View style={[styles.statIconContainer, { backgroundColor: iconBg }]}>
        <Feather name={icon} size={24} color={gradient[0]} />
      </View>
      <Text style={styles.statTitle}>{title}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header with Gradient */}
      <LinearGradient
        colors={["#667eea", "#764ba2"]}
        style={styles.headerGradient}
      >
        <View style={styles.profileHeader}>
          <View style={styles.profileImageContainer}>
            <Image source={userData.profilePicture} style={styles.profileImage} />
            <View style={styles.onlineIndicator} />
          </View>
          <Text style={styles.userName}>{userData.name}</Text>
          <View style={styles.levelBadge}>
            <MaterialIcons name="star" size={20} color="#fbbf24" />
            <Text style={styles.levelText}>{userData.level}</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Stats Section */}
      <View style={styles.statsContainer}>
        <Text style={styles.sectionTitle}>Your Progress</Text>

        {/* Lessons & Words Row */}
        <View style={styles.statsRow}>
          <StatCard
            icon="book-open"
            title="Lessons Completed"
            value={userData.lessonsCompleted}
            gradient={["#3b82f6", "#2563eb"]}
            iconBg="#dbeafe"
          />
          <StatCard
            icon="star"
            title="Words Learned"
            value={userData.totalWordsLearned}
            gradient={["#10b981", "#059669"]}
            iconBg="#d1fae5"
          />
        </View>

        {/* Quiz Stats Card */}
        <View style={styles.largeCard}>
          <View style={[styles.largeCardIcon, { backgroundColor: "#fed7aa" }]}>
            <Feather name="trending-up" size={28} color="#f97316" />
          </View>
          <View style={styles.largeCardContent}>
            <Text style={styles.largeCardTitle}>Quiz Performance</Text>
            <View style={styles.quizStatsRow}>
              <View style={styles.quizStat}>
                <Text style={styles.quizStatLabel}>Tests Taken</Text>
                <Text style={styles.quizStatValue}>
                  {userData.totalQuizzesCompleted}
                </Text>
              </View>
              <View style={styles.quizStatDivider} />
              <View style={styles.quizStat}>
                <Text style={styles.quizStatLabel}>Highest Score</Text>
                <Text style={styles.quizStatValue}>
                  {userData.practiceQuizResults.highestScore}%
                </Text>
              </View>
              <View style={styles.quizStatDivider} />
              <View style={styles.quizStat}>
                <Text style={styles.quizStatLabel}>Average</Text>
                <Text style={styles.quizStatValue}>
                  {userData.practiceQuizResults.averageScore}%
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Streak Cards */}
        <View style={styles.statsRow}>
          <View style={styles.streakCard}>
            <View style={[styles.streakIcon, { backgroundColor: "#fef3c7" }]}>
              <MaterialIcons name="local-fire-department" size={28} color="#f59e0b" />
            </View>
            <Text style={styles.streakLabel}>Current Streak</Text>
            <Text style={styles.streakValue}>{userData.currentStreak}</Text>
            <Text style={styles.streakUnit}>days</Text>
          </View>
          <View style={styles.streakCard}>
            <View style={[styles.streakIcon, { backgroundColor: "#e0e7ff" }]}>
              <MaterialIcons name="whatshot" size={28} color="#6366f1" />
            </View>
            <Text style={styles.streakLabel}>Longest Streak</Text>
            <Text style={styles.streakValue}>{userData.longestStreak}</Text>
            <Text style={styles.streakUnit}>days</Text>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => dispatch(logOut())}
          activeOpacity={0.8}
        >
          <Feather name="log-out" size={20} color="#ef4444" />
          <Text style={styles.logoutText}>Sign Out</Text>
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
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  profileHeader: {
    alignItems: "center",
  },
  profileImageContainer: {
    position: "relative",
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: "#fff",
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#10b981",
    borderWidth: 3,
    borderColor: "#fff",
  },
  userName: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 12,
  },
  levelBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  levelText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    marginLeft: 6,
  },
  statsContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginRight: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  statTitle: {
    fontSize: 13,
    color: "#6b7280",
    marginBottom: 8,
  },
  statValue: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1f2937",
  },
  largeCard: {
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
  largeCardIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  largeCardContent: {
    flex: 1,
  },
  largeCardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 16,
  },
  quizStatsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  quizStat: {
    flex: 1,
    alignItems: "center",
  },
  quizStatLabel: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 6,
  },
  quizStatValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
  },
  quizStatDivider: {
    width: 1,
    height: 40,
    backgroundColor: "#e5e7eb",
  },
  streakCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginRight: 8,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  streakIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  streakLabel: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 8,
    textAlign: "center",
  },
  streakValue: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1f2937",
  },
  streakUnit: {
    fontSize: 14,
    color: "#6b7280",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: 8,
    borderWidth: 1.5,
    borderColor: "#fee2e2",
    shadowColor: "#ef4444",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ef4444",
    marginLeft: 8,
  },
});

export default ProfileScreen;