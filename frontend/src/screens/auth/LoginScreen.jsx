import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import colors from "../../constants/colors";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../features/auth/authThunks";
import { getAuthToken } from "../../helpers/tokenStorage";
import { getUserInfo } from "../../helpers/userInfoStorage";
import { clearError } from "../../features/auth/authSlice";
import { MaterialIcons } from "@expo/vector-icons";

const LoginScreen = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [token, setToken] = useState(null);
  const [callhandleLogin, setCallhandleLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (callhandleLogin) handleLogin();
  }, [callhandleLogin]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await getAuthToken();
        const userInfo = await getUserInfo();
        setToken(token);
        setUserInfo(userInfo);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const dispatch = useDispatch();
  const navigation = useNavigation();

  const handleRegistrationPress = () => {
    navigation.navigate("Registration");
  };

  const handleExistingLogin = () => {
    setEmail(userInfo.email);
    setPassword(userInfo.password);
    setCallhandleLogin(true);
  };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { loginError, loading } = useSelector((state) => state.auth);

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please fill in all fields");
      return;
    }
    await dispatch(loginUser({ email, password }));
  };

  useEffect(() => {
    if (loginError) {
      setTimeout(() => {
        dispatch(clearError());
      }, 5000);
    }
  }, [loginError]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={["#667eea", "#764ba2"]}
          style={styles.gradientBackground}
        >
          {/* Logo Section */}
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <MaterialIcons name="school" size={60} color="#fff" />
            </View>
            <Text style={styles.appName}>EnglishVocab</Text>
            <Text style={styles.tagline}>Learn English with confidence</Text>
          </View>

          {/* Form Card */}
          <View style={styles.formCard}>
            <Text style={styles.welcomeTitle}>Welcome Back!</Text>
            <Text style={styles.welcomeSubtitle}>
              Sign in to continue learning
            </Text>

            {loginError && (
              <View style={styles.errorContainer}>
                <MaterialIcons name="error-outline" size={20} color="#ef4444" />
                <View style={styles.errorTextContainer}>
                  {typeof loginError === "string" ? (
                    <Text style={styles.errorText}>{loginError}</Text>
                  ) : (
                    loginError.map((error, index) => (
                      <Text key={index} style={styles.errorText}>
                        {error}
                      </Text>
                    ))
                  )}
                </View>
              </View>
            )}

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <MaterialIcons
                name="email"
                size={20}
                color="#9ca3af"
                style={styles.inputIcon}
              />
              <TextInput
                placeholder="Email"
                placeholderTextColor="#9ca3af"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
              />
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <MaterialIcons
                name="lock"
                size={20}
                color="#9ca3af"
                style={styles.inputIcon}
              />
              <TextInput
                placeholder="Password"
                placeholderTextColor="#9ca3af"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                style={styles.input}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <MaterialIcons
                  name={showPassword ? "visibility" : "visibility-off"}
                  size={20}
                  color="#9ca3af"
                />
              </TouchableOpacity>
            </View>

            {/* Login Button */}
            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={["#667eea", "#764ba2"]}
                style={styles.loginGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.loginButtonText}>Sign In</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* Existing User Login */}
            {token && userInfo && (
              <TouchableOpacity
                style={styles.quickLoginButton}
                onPress={handleExistingLogin}
                activeOpacity={0.8}
              >
                <MaterialIcons name="person" size={20} color="#667eea" />
                <Text style={styles.quickLoginText}>
                  Continue as {userInfo.name}
                </Text>
              </TouchableOpacity>
            )}

            {/* Sign Up Link */}
            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>Don't have an account? </Text>
              <TouchableOpacity onPress={handleRegistrationPress}>
                <Text style={styles.signupLink}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    flexGrow: 1,
  },
  gradientBackground: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  appName: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
  },
  formCard: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
    flex: 1,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: "#6b7280",
    marginBottom: 32,
  },
  errorContainer: {
    flexDirection: "row",
    backgroundColor: "#fee2e2",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    alignItems: "flex-start",
  },
  errorTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  errorText: {
    color: "#ef4444",
    fontSize: 14,
    lineHeight: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 56,
    fontSize: 16,
    color: "#1f2937",
  },
  eyeIcon: {
    padding: 8,
  },
  loginButton: {
    marginTop: 8,
    marginBottom: 16,
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
  loginGradient: {
    height: 56,
    justifyContent: "center",
    alignItems: "center",
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  quickLoginButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f4ff",
    borderRadius: 12,
    height: 56,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#d1d5fd",
  },
  quickLoginText: {
    color: "#667eea",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  signupText: {
    fontSize: 16,
    color: "#6b7280",
  },
  signupLink: {
    fontSize: 16,
    color: "#667eea",
    fontWeight: "600",
  },
});

export default LoginScreen;