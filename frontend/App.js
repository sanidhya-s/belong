import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import {
  View, Text, StyleSheet, TouchableOpacity,
  TextInput, KeyboardAvoidingView, Platform,
  SafeAreaView, Animated, Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, RADIUS, SHADOW } from './src/theme';
import AppNavigator from './src/navigation/AppNavigator';

const { width, height } = Dimensions.get('window');

function SplashScreen({ onDone }) {
  const scale = new Animated.Value(0.5);
  const opacity = new Animated.Value(0);

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, tension: 50 }),
      Animated.timing(opacity, { toValue: 1, duration: 600, useNativeDriver: true }),
    ]).start();
    const timer = setTimeout(onDone, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={splash.container}>
      <Animated.View style={[splash.logo, { transform: [{ scale }], opacity }]}>
        <Ionicons name="home" size={48} color={COLORS.white} />
      </Animated.View>
      <Animated.Text style={[splash.title, { opacity }]}>Belong</Animated.Text>
      <Animated.Text style={[splash.subtitle, { opacity }]}>
        Community Management made easy
      </Animated.Text>
    </View>
  );
}

function LoginScreen({ onLogin }) {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('phone');

  const handleSendOtp = () => {
    if (phone.length < 10) return;
    setStep('otp');
  };

  const handleVerify = () => {
    if (otp.length < 4) return;
    onLogin();
  };

  return (
    <SafeAreaView style={login.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={login.container}
      >
        <View style={login.top}>
          <View style={login.logoWrap}>
            <Ionicons name="home" size={36} color={COLORS.white} />
          </View>
          <Text style={login.brand}>Belong</Text>
          <Text style={login.tagline}>Your community, connected</Text>
        </View>

        <View style={login.card}>
          <Text style={login.cardTitle}>
            {step === 'phone' ? 'Login with Phone' : 'Enter OTP'}
          </Text>
          <Text style={login.cardSub}>
            {step === 'phone'
              ? 'We\'ll send you a verification code'
              : `OTP sent to +91 ${phone}`}
          </Text>

          {step === 'phone' ? (
            <View style={login.inputWrap}>
              <View style={login.countryCode}>
                <Text style={login.countryCodeText}>🇮🇳 +91</Text>
              </View>
              <TextInput
                style={login.input}
                placeholder="Mobile Number"
                placeholderTextColor={COLORS.textMuted}
                keyboardType="phone-pad"
                maxLength={10}
                value={phone}
                onChangeText={setPhone}
              />
            </View>
          ) : (
            <View>
              <TextInput
                style={login.otpInput}
                placeholder="Enter 4-digit OTP"
                placeholderTextColor={COLORS.textMuted}
                keyboardType="number-pad"
                maxLength={4}
                value={otp}
                onChangeText={setOtp}
                textAlign="center"
              />
              <TouchableOpacity onPress={() => setStep('phone')} style={{ marginTop: 8 }}>
                <Text style={login.changeNum}>Change number</Text>
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity
            style={[login.btn, (step === 'phone' ? phone.length < 10 : otp.length < 4) && login.btnDisabled]}
            onPress={step === 'phone' ? handleSendOtp : handleVerify}
            activeOpacity={0.85}
          >
            <Text style={login.btnText}>
              {step === 'phone' ? 'Send OTP' : 'Verify & Login'}
            </Text>
            <Ionicons name="arrow-forward" size={18} color={COLORS.white} />
          </TouchableOpacity>

          {step === 'phone' && (
            <TouchableOpacity onPress={onLogin} style={login.skip}>
              <Text style={login.skipText}>Skip for demo →</Text>
            </TouchableOpacity>
          )}
        </View>

        <Text style={login.terms}>
          By continuing, you agree to our Terms of Service and Privacy Policy
        </Text>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default function App() {
  const [appState, setAppState] = useState('splash');

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="light" />
      {appState === 'splash' && <SplashScreen onDone={() => setAppState('login')} />}
      {appState === 'login' && <LoginScreen onLogin={() => setAppState('main')} />}
      {appState === 'main' && (
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      )}
    </GestureHandlerRootView>
  );
}

const splash = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: COLORS.primary,
    justifyContent: 'center', alignItems: 'center',
  },
  logo: {
    width: 100, height: 100, borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.lg,
  },
  title: { fontSize: 42, fontWeight: '800', color: COLORS.white, letterSpacing: 2 },
  subtitle: { fontSize: FONTS.sizes.md, color: 'rgba(255,255,255,0.7)', marginTop: 8 },
});

const login = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.primary },
  container: { flex: 1, justifyContent: 'flex-end' },
  top: { alignItems: 'center', paddingBottom: SPACING.xxl },
  logoWrap: {
    width: 80, height: 80, borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.md,
  },
  brand: { fontSize: 36, fontWeight: '800', color: COLORS.white, letterSpacing: 1 },
  tagline: { color: 'rgba(255,255,255,0.7)', fontSize: FONTS.sizes.md, marginTop: 6 },
  card: {
    backgroundColor: COLORS.white, borderTopLeftRadius: 32, borderTopRightRadius: 32,
    padding: SPACING.xl, paddingBottom: 40,
  },
  cardTitle: { fontSize: FONTS.sizes.xxl, fontWeight: '700', color: COLORS.textPrimary },
  cardSub: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, marginTop: 6, marginBottom: SPACING.lg },
  inputWrap: {
    flexDirection: 'row', borderWidth: 1.5, borderColor: COLORS.border,
    borderRadius: RADIUS.md, overflow: 'hidden', marginBottom: SPACING.md,
  },
  countryCode: {
    backgroundColor: COLORS.background, paddingHorizontal: SPACING.md,
    justifyContent: 'center', borderRightWidth: 1, borderRightColor: COLORS.border,
  },
  countryCodeText: { fontSize: FONTS.sizes.md, fontWeight: '600', color: COLORS.textPrimary },
  input: { flex: 1, height: 52, paddingHorizontal: SPACING.md, fontSize: FONTS.sizes.md, color: COLORS.textPrimary },
  otpInput: {
    borderWidth: 1.5, borderColor: COLORS.border, borderRadius: RADIUS.md,
    height: 64, fontSize: FONTS.sizes.xxl, fontWeight: '700',
    color: COLORS.textPrimary, marginBottom: SPACING.sm, letterSpacing: 12,
  },
  changeNum: { color: COLORS.primary, fontWeight: '600', textAlign: 'center', marginBottom: SPACING.md },
  btn: {
    backgroundColor: COLORS.primary, borderRadius: RADIUS.full,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 16, gap: 8, marginTop: SPACING.sm,
  },
  btnDisabled: { backgroundColor: COLORS.textMuted },
  btnText: { color: COLORS.white, fontSize: FONTS.sizes.lg, fontWeight: '700' },
  skip: { alignItems: 'center', marginTop: SPACING.md },
  skipText: { color: COLORS.textMuted, fontSize: FONTS.sizes.sm },
  terms: {
    textAlign: 'center', color: 'rgba(255,255,255,0.6)',
    fontSize: 11, paddingHorizontal: SPACING.xl, paddingBottom: SPACING.lg,
  },
});
