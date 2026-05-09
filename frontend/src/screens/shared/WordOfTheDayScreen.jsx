import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import * as Speech from "expo-speech";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import colors from "../../constants/colors";
import { useNavigation } from "@react-navigation/native";

const WordOfTheDayScreen = () => {
  const navigation = useNavigation();

  const wordOfTheDay = {
    word: "Serendipity",
    synonym: "Fortuity",
    meaning: "The occurrence of events by chance in a happy or beneficial way.",
    usage:
      "I experienced serendipity when I found my long-lost friend at the airport.",
  };

  const handleDonePress = () => {
    navigation.navigate("Main");
  };

  const handlePronunciationPress = (word) => {
    Speech.speak(word);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header with Gradient */}
      <LinearGradient
        colors={["#667eea", "#764ba2"]}
        style={styles.headerGradient}
      >
        <View style={styles.headerIconContainer}>
          <MaterialIcons name="wb-sunny" size={48} color="#fbbf24" />
        </View>
        <Text style={styles.headerTitle}>Word of the Day</Text>
        <Text style={styles.headerDate}>
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </Text>
      </LinearGradient>

      <View style={styles.contentContainer}>
        {/* Main Word Card */}
        <View style={styles.wordCard}>
          <View style={styles.wordHeader}>
            <Text style={styles.word}>{wordOfTheDay.word}</Text>
            <TouchableOpacity
              style={styles.soundButton}
              onPress={() => handlePronunciationPress(wordOfTheDay.word)}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={["#667eea", "#764ba2"]}
                style={styles.soundButtonGradient}
              >
                <MaterialCommunityIcons
                  name="volume-high"
                  size={24}
                  color="#fff"
                />
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Synonym */}
          <View style={styles.synonymContainer}>
            <MaterialIcons name="compare-arrows" size={20} color="#6b7280" />
            <Text style={styles.synonymLabel}>Synonym: </Text>
            <Text style={styles.synonym}>{wordOfTheDay.synonym}</Text>
          </View>
        </View>

        {/* Meaning Card */}
        <View style={styles.infoCard}>
          <View style={styles.cardHeader}>
            <View style={styles.iconCircle}>
              <MaterialIcons name="lightbulb" size={24} color="#f59e0b" />
            </View>
            <Text style={styles.cardTitle}>Meaning</Text>
          </View>
          <Text style={styles.cardText}>{wordOfTheDay.meaning}</Text>
        </View>

        {/* Usage Card */}
        <View style={styles.infoCard}>
          <View style={styles.cardHeader}>
            <View style={styles.iconCircle}>
              <MaterialIcons name="chat-bubble" size={24} color="#10b981" />
            </View>
            <Text style={styles.cardTitle}>Example Usage</Text>
          </View>
          <View style={styles.usageContainer}>
            <MaterialIcons name="format-quote" size={20} color="#9ca3af" />
            <Text style={styles.cardText}>{wordOfTheDay.usage}</Text>
          </View>
        </View>

        {/* Tips Card */}
        <View style={styles.tipsCard}>
          <View style={styles.tipsHeader}>
            <MaterialIcons name="tips-and-updates" size={24} color="#667eea" />
            <Text style={styles.tipsTitle}>Learning Tip</Text>
          </View>
          <Text style={styles.tipsText}>
            Try using this word in a sentence today to help remember it better!
          </Text>
        </View>

        {/* Done Button */}
        <TouchableOpacity
          style={styles.doneButton}
          onPress={handleDonePress}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={["#667eea", "#764ba2"]}
            style={styles.doneButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <MaterialIcons name="check" size={24} color="#fff" />
            <Text style={styles.doneButtonText}>Got it!</Text>
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
  headerIconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  headerDate: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
  },
  contentContainer: {
    padding: 20,
  },
  wordCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  wordHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  word: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#1f2937",
    flex: 1,
  },
  soundButton: {
    borderRadius: 25,
    overflow: "hidden",
    shadowColor: "#667eea",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  soundButtonGradient: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  synonymContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9fafb",
    padding: 12,
    borderRadius: 12,
  },
  synonymLabel: {
    fontSize: 14,
    color: "#6b7280",
    marginLeft: 8,
  },
  synonym: {
    fontSize: 16,
    fontWeight: "600",
    color: "#667eea",
  },
  infoCard: {
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
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f9fafb",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
  },
  cardText: {
    fontSize: 16,
    color: "#4b5563",
    lineHeight: 24,
  },
  usageContainer: {
    flexDirection: "row",
    gap: 8,
  },
  tipsCard: {
    backgroundColor: "#eff6ff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#dbeafe",
  },
  tipsHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
    marginLeft: 8,
  },
  tipsText: {
    fontSize: 14,
    color: "#4b5563",
    lineHeight: 22,
  },
  doneButton: {
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
  doneButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    gap: 8,
  },
  doneButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
});

export default WordOfTheDayScreen;