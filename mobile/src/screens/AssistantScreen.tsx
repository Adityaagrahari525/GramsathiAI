import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../context/LanguageContext';
import { apiClient } from '../services/apiClient';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const AssistantScreen: React.FC = () => {
  const { language } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'assistant',
      text:
        language === 'mr'
          ? 'नमस्कार! मी ग्रामसाथी AI सहाय्यक आहे. आपल्याला कोणत्या योजनेबद्दल माहिती हवी आहे? (उदा. सौर पंप, विहीर अनुदान, शेततळे, ट्रॅक्टर किंवा महिलांच्या योजना)'
          : 'Hello! I am GramSathi AI Assistant. Ask me anything about Maharashtra government schemes, eligibility, documents, or subsidies.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const quickPrompts = [
    'सौर पंप कसा मिळेल?',
    'ट्रॅक्टर अनुदान योजना',
    'लाडकी बहीण योजना माहिती',
    'विहीर अनुदानासाठी निकष काय?',
  ];

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    try {
      const history = messages.slice(-4).map((m) => ({
        role: m.sender === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }],
      }));

      const res = await apiClient.askAssistant(text.trim(), language, history);

      let reply = '';
      if (res.success && res.data?.reply) {
        reply = res.data.reply;
      } else {
        // High quality offline fallback response
        reply =
          language === 'mr'
            ? `आपल्या "${text.trim()}" या विषयावर महाडीबीटी (MahaDBT) पोर्टलवर विविध योजना उपलब्ध आहेत. कृपया ७/१२ उतारा, ८-अ, आधार कार्ड व बँक पासबुक सोबत ठेवावे. 'पात्रता तपासा' टॅबमधून आपली अचूक पात्रता नक्की पडताळून पहावी.`
            : `For "${text.trim()}", various subsidies and welfare schemes are open on MahaDBT. Keep your 7/12 extract, 8-A, Aadhaar, and Bank Passbook ready. Use the Eligibility tab to check your exact match.`;
      }

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch {
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text:
          language === 'mr'
            ? 'माफ करा, तांत्रिक समस्येमुळे उत्तर देता आले नाही. कृपया पुन्हा प्रयत्न करा.'
            : 'Sorry, could not process request right now. Please try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      {/* Subheader */}
      <View style={styles.topInfo}>
        <Ionicons name="sparkles" size={16} color="#2563eb" />
        <Text style={styles.topInfoText}>
          {language === 'mr' ? '२४/७ डिजिटल ग्रामसेवक व सल्लागार' : 'Official Multilingual Civic Intelligence'}
        </Text>
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messageList}
        renderItem={({ item }) => {
          const isUser = item.sender === 'user';
          return (
            <View style={[styles.bubbleWrapper, isUser ? styles.userWrapper : styles.assistantWrapper]}>
              {!isUser && (
                <View style={styles.botAvatar}>
                  <Ionicons name="shield-checkmark" size={16} color="#ffffff" />
                </View>
              )}
              <View style={[styles.bubble, isUser ? styles.userBubble : styles.assistantBubble]}>
                <Text style={[styles.bubbleText, isUser ? styles.userBubbleText : styles.assistantBubbleText]}>
                  {item.text}
                </Text>
                <Text style={[styles.timeText, isUser ? styles.userTimeText : styles.assistantTimeText]}>
                  {item.timestamp}
                </Text>
              </View>
            </View>
          );
        }}
      />

      {/* Quick Prompts */}
      <View style={styles.quickPromptsBar}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={quickPrompts}
          keyExtractor={(_, i) => String(i)}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.quickPill} onPress={() => handleSend(item)}>
              <Text style={styles.quickPillText}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Input Row */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder={language === 'mr' ? 'आपला प्रश्न येथे टाईप करा...' : 'Type your question here...'}
          value={inputText}
          onChangeText={setInputText}
          placeholderTextColor="#94a3b8"
          multiline
        />
        <TouchableOpacity
          style={[styles.sendBtn, (!inputText.trim() || loading) && styles.sendBtnDisabled]}
          onPress={() => handleSend()}
          disabled={!inputText.trim() || loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Ionicons name="send" size={18} color="#ffffff" />
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  topInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  topInfoText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1e40af',
  },
  messageList: {
    padding: 16,
    gap: 12,
  },
  bubbleWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    marginBottom: 4,
  },
  userWrapper: {
    justifyContent: 'flex-end',
  },
  assistantWrapper: {
    justifyContent: 'flex-start',
  },
  botAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#1e40af',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bubble: {
    maxWidth: '82%',
    borderRadius: 14,
    padding: 12,
  },
  userBubble: {
    backgroundColor: '#1e40af',
    borderBottomRightRadius: 2,
  },
  assistantBubble: {
    backgroundColor: '#ffffff',
    borderBottomLeftRadius: 2,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  bubbleText: {
    fontSize: 14,
    lineHeight: 20,
  },
  userBubbleText: {
    color: '#ffffff',
  },
  assistantBubbleText: {
    color: '#0f172a',
  },
  timeText: {
    fontSize: 10,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  userTimeText: {
    color: '#93c5fd',
  },
  assistantTimeText: {
    color: '#94a3b8',
  },
  quickPromptsBar: {
    backgroundColor: '#ffffff',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  quickPill: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  quickPillText: {
    fontSize: 12,
    color: '#334155',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    gap: 8,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 14,
    color: '#0f172a',
    maxHeight: 100,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: '#94a3b8',
  },
});
