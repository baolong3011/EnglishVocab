import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Button, KeyboardAvoidingView, Platform } from 'react-native';
import { GoogleGenerativeAI } from '@google/generative-ai';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { GEMINI_API_KEY } from '@env';
import { useHeaderHeight } from '@react-navigation/elements';
import { API_BASE_URL } from '../../constants/baseUrl';

// Khởi tạo Gemini API
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Thử lần lượt các model — nếu cái đầu bị 503/quá tải thì fallback sang cái kế.
const MODEL_FALLBACKS = [
  'gemini-2.0-flash',
  'gemini-flash-latest',
  'gemini-2.5-flash-lite',
  'gemini-2.5-flash',
];

const generateWithFallback = async (prompt) => {
  let lastError;
  for (const modelName of MODEL_FALLBACKS) {
    try {
      const m = genAI.getGenerativeModel({ model: modelName });
      const result = await m.generateContent(prompt);
      return result.response.text();
    } catch (err) {
      lastError = err;
      const msg = String(err?.message || err);
      // Chỉ fallback khi gặp lỗi server (503/overloaded/quota). Còn lại thì throw luôn.
      if (!/503|overloaded|429|quota|UNAVAILABLE|high demand/i.test(msg)) {
        throw err;
      }
      console.warn(`Model ${modelName} failed, trying next...`, msg);
    }
  }
  throw lastError;
};

const CHAT_HISTORY_KEY = 'chatHistory';

const ChatScreen = ({ route }) => {
  const initialQuery = route?.params?.initialQuery;
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState(initialQuery || '');
  const flatListRef = useRef(null);
  const headerHeight = useHeaderHeight();

  const loadChatHistory = async () => {
    try {
      const storedMessages = await AsyncStorage.getItem(CHAT_HISTORY_KEY);
      if (storedMessages) {
        setMessages(JSON.parse(storedMessages));
      }
    } catch (error) {
      console.error('Lỗi khi tải lịch sử tin nhắn:', error);
    }
  };

  const saveChatHistory = async (newMessages) => {
    try {
      await AsyncStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(newMessages));
    } catch (error) {
      console.error('Lỗi khi lưu lịch sử tin nhắn:', error);
    }
  };

  const clearChatHistory = async () => {
    try {
      await AsyncStorage.removeItem(CHAT_HISTORY_KEY);
      setMessages([]);
    } catch (error) {
      console.error('Lỗi khi xóa lịch sử tin nhắn:', error);
    }
  };

  useEffect(() => {
    loadChatHistory();
  }, []);

  useEffect(() => {
    if (messages.length > 0 && flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  // Trích từ khóa khi người dùng hỏi về 1 từ tiếng Anh (nhiều cách hỏi VN/EN)
  const extractWordCandidate = (text) => {
    const lower = text.toLowerCase().trim().replace(/[?.!]+$/g, '');
    let m;

    // Patterns tiếng Anh
    if ((m = lower.match(/^what (?:does|is)\s+["']?([a-z\s-]+?)["']?\s+(?:mean|means)?$/))) return m[1].trim();
    if ((m = lower.match(/^(?:define|meaning of|definition of)\s+["']?([a-z\s-]+?)["']?$/))) return m[1].trim();

    // Patterns tiếng Việt — bắt cụm "từ <X>", "<X> là gì", "<X> nghĩa là gì"
    if ((m = lower.match(/từ\s+["']?([a-z][a-z\s-]{0,29})["']?\s*$/))) return m[1].trim();
    if ((m = lower.match(/^(?:nghĩa(?:\s+của)?|định\s+nghĩa|giải\s+thích(?:\s+từ)?)\s+["']?([a-z][a-z\s-]{0,29})["']?$/))) return m[1].trim();
    if ((m = lower.match(/^["']?([a-z][a-z\s-]{0,29})["']?\s+(?:nghĩa\s+là\s+gì|là\s+gì|có\s+nghĩa)/))) return m[1].trim();

    // Patterns tiếng Anh khác
    if ((m = lower.match(/(?:^|\s)(?:explain|tell me about)\s+(?:the\s+word\s+)?["']?([a-z][a-z\s-]{0,29})["']?$/))) return m[1].trim();

    // Một từ tiếng Anh đơn (1-2 từ, chỉ chữ cái)
    if (/^[a-z][a-z\s-]{1,29}$/.test(lower) && lower.split(/\s+/).length <= 2) return lower;

    // Fallback: nếu câu kết thúc bằng 1 từ tiếng Anh đơn (có vẻ là từ cần tra)
    const lastWordMatch = lower.match(/([a-z][a-z-]{1,20})$/);
    if (lastWordMatch) {
      const lastWord = lastWordMatch[1];
      // Loại bỏ stopwords tránh false positive
      const stopwords = ['mean', 'is', 'the', 'a', 'an', 'what', 'how', 'why', 'when', 'gi', 'la', 'co'];
      if (!stopwords.includes(lastWord) && lastWord.length >= 3) return lastWord;
    }

    return null;
  };

  const lookupWord = async (word) => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/learn/find-word/${encodeURIComponent(word)}`,
        { timeout: 5000 }
      );
      return res.data;
    } catch {
      return null;
    }
  };

  const handleSendMessage = async () => {
    if (inputText.trim() === '') {
      return;
    }

    const newMessage = { text: inputText, user: 'user' };
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    setInputText('');
    await saveChatHistory(updatedMessages);

    try {
      const lowerInput = inputText.toLowerCase();
      let prompt = inputText;

      // 1. Thử tra từ trong DB nếu input có vẻ là 1 từ
      const candidate = extractWordCandidate(inputText);
      if (candidate) {
        const dbWord = await lookupWord(candidate);
        if (dbWord) {
          prompt = `Bạn là trợ lý học tiếng Anh. Dưới đây là dữ liệu của một từ trong app học từ vựng. Hãy trình bày bằng tiếng Việt theo đúng định dạng sau, KHÔNG dùng markdown (không dấu sao **, không #), KHÔNG thêm thông tin nào khác:

📘 Từ: ${dbWord.word}
🏷️ Loại từ: <dịch sang tiếng Việt: ${dbWord.partOfSpeech}>
🔁 Đồng nghĩa: ${dbWord.synonym || '(không có)'}
💡 Nghĩa: <dịch câu sau sang tiếng Việt: "${dbWord.meaning}">
✏️ Ví dụ: ${dbWord.example}
   <dịch ví dụ trên sang tiếng Việt>
📚 Chủ đề: ${dbWord.lessonTitle} · Cấp độ: ${dbWord.level}

Chỉ trả lời theo định dạng trên, không thêm lời chào hay giải thích thêm. Tuyệt đối không dùng dấu sao **.`;
        } else {
          // Không có trong DB → AI tự giải thích
          prompt = `Giải thích từ tiếng Anh "${candidate}" bằng tiếng Việt theo đúng định dạng sau, KHÔNG dùng markdown (không dấu sao **, không #):

📘 Từ: ${candidate}
🏷️ Loại từ: <ví dụ: Danh từ / Động từ / Tính từ>
🔁 Đồng nghĩa: <1-2 từ đồng nghĩa tiếng Anh>
💡 Nghĩa: <giải thích bằng tiếng Việt>
✏️ Ví dụ: <1 câu ví dụ tiếng Anh>
   <dịch sang tiếng Việt>

Chỉ trả lời theo định dạng trên, không thêm lời chào. Tuyệt đối không dùng dấu sao **.`;
        }
      } else if (lowerInput.startsWith('practice with ')) {
        const word = lowerInput.replace('practice with ', '').trim();
        prompt = `Create a fill-in-the-blank exercise using the word "${word}". Provide the sentence with a blank and a hint. Trả lời bằng tiếng Việt.`;
      }

      let botText = await generateWithFallback(prompt);
      // Loại bỏ markdown asterisks (** và *) vì React Native Text không render markdown
      botText = botText
        .replace(/\*\*(.+?)\*\*/g, '$1')
        .replace(/\*(.+?)\*/g, '$1')
        .replace(/^#+\s+/gm, '');
      const botMessage = { text: botText, user: 'bot' };
      const newMessagesWithBot = [...updatedMessages, botMessage];
      setMessages(newMessagesWithBot);
      await saveChatHistory(newMessagesWithBot);
    } catch (error) {
      console.error('Lỗi khi gọi Gemini API:', error);
      const msg = String(error?.message || error);
      let userMsg = 'Đã có lỗi khi kết nối với chatbot.';
      if (/503|overloaded|UNAVAILABLE|high demand/i.test(msg)) {
        userMsg = '⚠️ Tất cả model AI đang quá tải. Vui lòng thử lại sau 1-2 phút.';
      } else if (/429|quota/i.test(msg)) {
        userMsg = '⚠️ Đã hết quota API hôm nay. Vui lòng đợi đến mai hoặc dùng API key khác.';
      } else if (/API key/i.test(msg)) {
        userMsg = '⚠️ API key không hợp lệ. Kiểm tra file .env.';
      }
      const errorMessage = { text: userMsg, user: 'bot', error: true };
      const newMessagesWithError = [...updatedMessages, errorMessage];
      setMessages(newMessagesWithError);
      await saveChatHistory(newMessagesWithError);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={headerHeight}
    >
      <View style={styles.header}>
        <Button title="Xóa lịch sử" onPress={clearChatHistory} color="#FF6347" />
      </View>
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={[styles.message, item.user === 'user' ? styles.userMessage : styles.botMessage]}>
            <Text style={item.user === 'user' ? styles.userText : styles.botText}>
              {item.text}
              {item.error && <Text style={{ color: 'red' }}> (Lỗi)</Text>}
            </Text>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 10 }}
        keyboardShouldPersistTaps="handled"
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Nhập tin nhắn (VD: What does happy mean?)"
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
          <Text style={styles.sendButtonText}>Gửi</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#F0F0F0',
  },
  header: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  message: {
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
    maxWidth: '80%',
  },
  userMessage: {
    backgroundColor: '#DCF8C6',
    alignSelf: 'flex-end',
  },
  botMessage: {
    backgroundColor: '#FFFFFF',
    alignSelf: 'flex-start',
  },
  userText: {
    color: '#000',
  },
  botText: {
    color: '#000',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#CCC',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    backgroundColor: '#FFF',
  },
  sendButton: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  sendButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ChatScreen;