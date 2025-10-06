import React, { useState } from 'react';
import { SafeAreaView, View, TextInput, Button, Text, Alert, StyleSheet, ImageBackground } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function App() {
  const [feedback, setFeedback] = useState('');
  const [contactMethod, setContactMethod] = useState('');
  const [contactValue, setContactValue] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!feedback.trim()) {
      Alert.alert('Uyarı', 'Lütfen geri bildirim giriniz.');
      return;
    }
    if (!contactMethod || !contactValue.trim()) {
      Alert.alert('Uyarı', 'Lütfen iletişim yöntemi ve bilgisini doldurunuz.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('https://localhost:5010/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: feedback,
          contact_method: contactMethod,
          contact_value: contactValue,
        }),
      });
      if (response.ok) {
        Alert.alert('Teşekkürler', 'Geri bildiriminiz alındı.');
        setFeedback('');
        setContactMethod('');
        setContactValue('');
      } else {
        Alert.alert('Hata', 'Bir hata oluştu, lütfen tekrar deneyiniz.');
      }
    } catch (error) {
      Alert.alert('Hata', 'Sunucuya ulaşılamıyor.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <ImageBackground source={require('./assets/background.png')} style={styles.background}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.headerBox}>
          <Text style={styles.header}>Hastane Geri Bildirim Uygulaması v1.0</Text>
        </View>
        <View style={styles.contentBox}>
          {/* Geri bildirim alanları */}
          <Text style={styles.label}>Geri Bildiriminizi Yazın</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Geri bildiriminizi buraya yazın..."
            value={feedback}
            onChangeText={setFeedback}
            multiline
          />

          <Text style={styles.label}>Size Nasıl Ulaşalım?</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={contactMethod}
              onValueChange={setContactMethod}
              style={styles.picker}
            >
              <Picker.Item label="Yöntem Seçiniz" value="" />
              <Picker.Item label="E-posta" value="email" />
              <Picker.Item label="Telefon" value="phone" />
              <Picker.Item label="SMS" value="sms" />
            </Picker>
          </View>

          <TextInput
            style={styles.textInput}
            placeholder={
              contactMethod === 'email'
                ? 'E-posta adresinizi girin'
                : contactMethod === 'phone' || contactMethod === 'sms'
                ? 'Telefon numaranızı girin'
                : 'İletişim bilgisini girin'
            }
            value={contactValue}
            onChangeText={setContactValue}
            keyboardType={contactMethod === 'email' ? 'email-address' : 'phone-pad'}
          />

          <View style={{ marginVertical: 12 }}>
            <Button
              title={loading ? "Gönderiliyor..." : "Geri Bildirim Gönder"}
              onPress={handleSubmit}
              disabled={loading}
              color="#007AFF"
            />
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  safeArea: {
    flex: 1,
    justifyContent: 'center',
  },
  headerBox: {
    paddingTop: 40,
    paddingBottom: 20,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#007AFF',
    textAlign: 'center',
    letterSpacing: 1,
  },
  contentBox: {
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 16,
    margin: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.16,
    shadowRadius: 8,
    elevation: 4,
  },
  label: { fontSize: 16, marginTop: 16, marginBottom: 8, fontWeight: 'bold' },
  textInput: {
    borderWidth: 1,
    borderColor: '#888',
    borderRadius: 6,
    padding: 12,
    marginBottom: 12,
    minHeight: 40,
    backgroundColor: 'rgba(255,255,255,0.95)',
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#888',
    borderRadius: 6,
    marginBottom: 12,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.95)',
  },
  picker: { height: 50, width: '100%' },
});