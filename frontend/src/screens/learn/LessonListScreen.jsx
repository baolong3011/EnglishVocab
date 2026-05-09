import React, { useEffect } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import { fetchLessons } from "../../features/learn/learnThunks";

const LessonListScreen = ({ navigation }) => {
  const { lessons, isFetching } = useSelector((state) => state.learn);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!lessons || lessons.length === 0) {
      dispatch(fetchLessons());
    }
  }, []);

  if (isFetching || !lessons) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#667eea" />
        <Text style={styles.loadingText}>Loading lessons...</Text>
      </View>
    );
  }

  if (!lessons || lessons.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <MaterialIcons name="school" size={64} color="#d1d5db" />
        <Text style={styles.emptyText}>No lessons available.</Text>
      </View>
    );
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

  const handleLessonPress = (lesson) => {
    navigation.navigate("Lesson Information", { lesson });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return { name: "check-circle", color: "#10b981" };
      case "in progress":
        return { name: "timelapse", color: "#f59e0b" };
      case "locked":
        return { name: "lock", color: "#9ca3af" };
      default:
        return { name: "radio-button-unchecked", color: "#d1d5db" };
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Lessons</Text>
        <Text style={styles.headerSubtitle}>
          Choose a lesson to start learning
        </Text>
      </View>

      <View style={styles.lessonsContainer}>
        {lessons?.map((lesson, index) => {
          // Treat locked lessons as "not started" — all lessons are unlocked.
          const displayStatus =
            lesson.status === "locked" ? "not started" : lesson.status;
          const statusIcon = getStatusIcon(displayStatus);
          const isLocked = false;
          const colors = iconColors[lesson.icon] || ["#6b7280", "#4b5563"];

          return (
            <TouchableOpacity
              key={lesson.lessonNumber}
              style={[styles.lessonCard, isLocked && styles.lessonCardLocked]}
              onPress={() => handleLessonPress(lesson)}
              activeOpacity={isLocked ? 1 : 0.7}
            >
              <LinearGradient
                colors={isLocked ? ["#f3f4f6", "#e5e7eb"] : ["#fff", "#fff"]}
                style={styles.cardGradient}
              >
                <View style={styles.lessonContent}>
                  <View
                    style={[
                      styles.iconContainer,
                      {
                        backgroundColor: isLocked
                          ? "#f3f4f6"
                          : `${colors[0]}15`,
                      },
                    ]}
                  >
                    <MaterialIcons
                      name={lesson.icon}
                      size={28}
                      color={isLocked ? "#9ca3af" : colors[0]}
                    />
                  </View>

                  <View style={styles.lessonInfo}>
                    <View style={styles.lessonHeader}>
                      <Text style={styles.lessonNumber}>
                        Lesson {lesson.lessonNumber}
                      </Text>
                      <MaterialIcons
                        name={statusIcon.name}
                        size={24}
                        color={statusIcon.color}
                      />
                    </View>
                    <Text
                      style={[
                        styles.lessonTitle,
                        isLocked && styles.lessonTitleLocked,
                      ]}
                    >
                      {lesson.title}
                    </Text>
                    <View style={styles.statusBadge}>
                      <Text
                        style={[
                          styles.statusText,
                          isLocked && styles.statusTextLocked,
                        ]}
                      >
                        {displayStatus === "not started" && "Ready to start"}
                        {displayStatus === "in progress" && "In progress"}
                        {displayStatus === "completed" && "Completed"}
                      </Text>
                    </View>
                  </View>
                </View>

                {!isLocked && (
                  <View style={styles.arrowContainer}>
                    <MaterialIcons
                      name="arrow-forward-ios"
                      size={16}
                      color="#9ca3af"
                    />
                  </View>
                )}
              </LinearGradient>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9fafb",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#6b7280",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9fafb",
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: "#6b7280",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#6b7280",
  },
  lessonsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  lessonCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lessonCardLocked: {
    opacity: 0.6,
  },
  cardGradient: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  lessonContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  lessonInfo: {
    flex: 1,
  },
  lessonHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  lessonNumber: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "600",
    textTransform: "uppercase",
  },
  lessonTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 8,
  },
  lessonTitleLocked: {
    color: "#9ca3af",
  },
  statusBadge: {
    alignSelf: "flex-start",
  },
  statusText: {
    fontSize: 13,
    color: "#667eea",
    fontWeight: "500",
  },
  statusTextLocked: {
    color: "#9ca3af",
  },
  arrowContainer: {
    marginLeft: 12,
  },
});

export default LessonListScreen;