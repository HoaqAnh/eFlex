import CryptoJS from 'crypto-js';

const ENCRYPTION_KEY = process.env.REACT_APP_ENCRYPTION_KEY || 'your-fallback-encryption-key';
const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

class TokenService {
  static encryptData(data) {
    try {
      return CryptoJS.AES.encrypt(data, ENCRYPTION_KEY).toString();
    } catch (error) {
      console.error('Encryption error:', error);
      return null;
    }
  }

  static decryptData(encryptedData) {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      console.error('Decryption error:', error);
      return null;
    }
  }

  static setToken(token) {
    if (!token) return false;
    try {
      const encryptedToken = TokenService.encryptData(token);
      localStorage.setItem(TOKEN_KEY, encryptedToken);
      return true;
    } catch (error) {
      console.error('Error setting token:', error);
      return false;
    }
  }

  static getToken() {
    try {
      const encryptedToken = localStorage.getItem(TOKEN_KEY);
      if (!encryptedToken) return null;
      return TokenService.decryptData(encryptedToken);
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  }

  static setRefreshToken(refreshToken) {
    if (!refreshToken) return false;
    try {
      const encryptedToken = TokenService.encryptData(refreshToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, encryptedToken);
      return true;
    } catch (error) {
      console.error('Error setting refresh token:', error);
      return false;
    }
  }

  static getRefreshToken() {
    try {
      const encryptedToken = localStorage.getItem(REFRESH_TOKEN_KEY);
      if (!encryptedToken) return null;
      return TokenService.decryptData(encryptedToken);
    } catch (error) {
      console.error('Error getting refresh token:', error);
      return null;
    }
  }

  static clearTokens() {
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      return true;
    } catch (error) {
      console.error('Error clearing tokens:', error);
      return false;
    }
  }

  static parseToken(token) {
    if (!token) return null;

    try {
      // Kiểm tra xem token có phải là JWT không
      const parts = token.split('.');
      if (parts.length !== 3) {
        console.error('Invalid token format: not a JWT token');
        return null;
      }

      // Decode phần payload
      const payload = parts[1];
      const decodedPayload = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
      
      try {
        return JSON.parse(decodedPayload);
      } catch (parseError) {
        console.error('Error parsing token payload:', parseError);
        return null;
      }
    } catch (error) {
      console.error('Error parsing token:', error);
      return null;
    }
  }

  static isTokenValid(providedToken = null) {
    const token = providedToken || TokenService.getToken();
    if (!token) return false;
    
    try {
      const tokenData = TokenService.parseToken(token);
      if (!tokenData) return false;

      const currentTime = Date.now() / 1000;
      
      // Kiểm tra thời gian hết hạn
      if (tokenData.exp && tokenData.exp < currentTime) {
        return false;
      }
      
      // Kiểm tra thời gian token được tạo
      if (tokenData.iat && tokenData.iat > currentTime) {
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error validating token:', error);
      return false;
    }
  }

  static getTokenData() {
    const token = TokenService.getToken();
    if (!token) return null;
    return TokenService.parseToken(token);
  }

  static getTokenExpirationTime() {
    const tokenData = TokenService.getTokenData();
    return tokenData ? tokenData.exp * 1000 : null;
  }

  static shouldRefreshToken() {
    const expirationTime = TokenService.getTokenExpirationTime();
    if (!expirationTime) return false;

    // Refresh token if less than 5 minutes until expiration
    const fiveMinutes = 5 * 60 * 1000;
    return Date.now() >= (expirationTime - fiveMinutes);
  }
}

export default TokenService; 