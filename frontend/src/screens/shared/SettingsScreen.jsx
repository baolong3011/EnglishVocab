import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import logOut from "../../features/rootAction";

const SettingsRow = ({ icon, color, title, subtitle, onPress, danger }) => (
  <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.7}>
    <View style={[styles.iconCircle, { backgroundColor: color + "22" }]}>
      <Ionicons name={icon} size={22} color={color} />
    </View>
    <View style={styles.rowText}>
      <Text style={[styles.rowTitle, danger && { color: "#ef4444" }]}>
        {title}
      </Text>
      {subtitle ? <Text style={styles.rowSubtitle}>{subtitle}</Text> : null}
    </View>
    <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
  </TouchableOpacity>
);

const SettingsScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const confirmLogout = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: () => dispatch(logOut()),
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Settings</Text>

      {user && (
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user.name?.charAt(0).toUpperCase() || "U"}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
          </View>
          <View style={styles.levelTag}>
            <Text style={styles.levelTagText}>{user.level}</Text>
          </View>
        </View>
      )}

      <Text style={styles.sectionLabel}>Account</Text>
      <View style={styles.section}>
        <SettingsRow
          icon="person-outline"
          color="#3b82f6"
          title="View Profile"
          subtitle="See your stats and progress"
          onPress={() => navigation.navigate("Profile")}
        />
      </View>

      <Text style={styles.sectionLabel}>About</Text>
      <View style={styles.section}>
        <SettingsRow
          icon="information-circle-outline"
          color="#8b5cf6"
          title="EnglishVocab"
          subtitle="Version 1.0.0"
          onPress={() => {}}
        />
      </View>

      <View style={[styles.section, { marginTop: 16 }]}>
        <SettingsRow
          icon="log-out-outline"
          color="#ef4444"
          title="Sign Out"
          onPress={confirmLogout}
          danger
        />
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  header: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1f2937",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#667eea",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: { color: "#fff", fontSize: 24, fontWeight: "700" },
  userName: { fontSize: 16, fontWeight: "600", color: "#1f2937" },
  userEmail: { fontSize: 13, color: "#6b7280", marginTop: 2 },
  levelTag: {
    backgroundColor: "#fef3c7",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  levelTagText: { fontSize: 12, fontWeight: "600", color: "#92400e" },
  sectionLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6b7280",
    paddingHorizontal: 20,
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  section: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  rowText: { flex: 1 },
  rowTitle: { fontSize: 15, fontWeight: "600", color: "#1f2937" },
  rowSubtitle: { fontSize: 12, color: "#6b7280", marginTop: 2 },
});

export default SettingsScreen;
