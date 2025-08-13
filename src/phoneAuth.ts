import { Platform } from 'react-native';

type SendResult = { confirmation?: any; success: boolean; error?: string; code?: string };
type VerifyResult = { user?: any; success: boolean; error?: string; code?: string };

async function webSend(phone: string): Promise<SendResult> {
  try {
    const { setupRecaptcha, signInWithPhone } = await import('./firebase');
    const containerId = 'recaptcha-container';
    
    // Ensure container exists and is visible
    let container = document.getElementById(containerId);
    if (!container) {
      container = document.createElement('div');
      container.id = containerId;
      container.style.cssText = 'position:fixed;bottom:8px;left:8px;z-index:9999;';
      document.body.appendChild(container);
    } else {
      container.style.display = 'block';
    }
    
    console.log('Setting up reCAPTCHA with container:', containerId);
    const verifier = setupRecaptcha(containerId, { size: 'normal' });
    
    console.log('Rendering reCAPTCHA...');
    // @ts-ignore
    await verifier.render?.();
    
    console.log('Sending OTP for phone:', phone);
    const res: any = await signInWithPhone(phone, verifier);
    console.log('signInWithPhone result:', res);
    
    if (res?.success) {
      console.log('OTP sent successfully, confirmation result:', res.confirmationResult);
      return { confirmation: res.confirmationResult, success: true };
    }
    console.error('Failed to send OTP:', res);
    return { success: false, error: res?.error, code: res?.code };
  } catch (e: any) {
    console.error('webSend error:', e);
    return { success: false, error: e?.message, code: e?.code };
  }
}

async function webVerify(confirmation: any, code: string): Promise<VerifyResult> {
  try {
    const { verifyOTP } = await import('./firebase');
    const res: any = await verifyOTP(confirmation, code);
    if (res?.success) return { user: res.user, success: true };
    return { success: false, error: res?.error, code: res?.code };
  } catch (e: any) {
    return { success: false, error: e?.message, code: e?.code };
  }
}

async function nativeSend(phone: string): Promise<SendResult> {
  try {
    const rnAuth = (await import('@react-native-firebase/auth')).default;
    const confirmation = await rnAuth().signInWithPhoneNumber(phone);
    return { confirmation, success: true };
  } catch (e: any) {
    return { success: false, error: e?.message, code: e?.code };
  }
}

async function nativeVerify(confirmation: any, code: string): Promise<VerifyResult> {
  try {
    const cred = await confirmation.confirm(code);
    return { user: cred?.user, success: true };
  } catch (e: any) {
    return { success: false, error: e?.message, code: e?.code };
  }
}

export async function sendOTP(phone: string): Promise<SendResult> {
  return Platform.OS === 'web' ? webSend(phone) : nativeSend(phone);
}

export async function confirmOTP(confirmation: any, code: string): Promise<VerifyResult> {
  return Platform.OS === 'web' ? webVerify(confirmation, code) : nativeVerify(confirmation, code);
}


